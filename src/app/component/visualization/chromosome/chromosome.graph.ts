import { element } from 'protractor';
import { DirtyEnum } from 'app/model/enum.model';
// import { Tween, Easing } from 'es6-tween';
import { Colors, EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { FontFactory } from './../../../service/font.factory';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { ShapeEnum, ColorEnum, GraphEnum, GenomicEnum } from 'app/model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { ChromosomeConfigModel, ChromosomeDataModel } from './chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { BoxGeometry, Vector3 } from 'three';

export class ChromosomeGraph implements ChartObjectInterface {

    private colorMap = {
        'protein_coding': 0x039BE5,
        'lincRNA': 0x4A148C,
        'antisense': 0x880E4F,
        'TEC': 0x0D47A1,
        'unprocessed_pseudogene': 0x00B8D4,
        'transcribed_unprocessed_pseudogene': 0xAA00FF,
        'processed_pseudogene': 0x6200EA,
        'transcribed_processed_pseudogene': 0x304FFE,
        'processed_transcript': 0x2196F3,
        'sense_intronic': 0x0091EA,
        'sense_overlapping': 0x00B8D4,
        'unitary_pseudogene': 0x00BFA5,
        'transcribed_unitary_pseudogene': 0x64DD17,
        'miRNA': 0xAEEA00,
        'misc_RNA': 0xFFD600,
        'rRNA': 0xFFAB00,
        'snRNA': 0xFF6D00,
        'snoRNA': 0xDD2C00,
        'vaultRNA': 0x5D4037
    };

    private overMaterial = new THREE.LineBasicMaterial( { color: 0x000000 }) ;
    private outMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF }) ;


    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: ChromosomeDataModel;
    private config: ChromosomeConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    private arms: any;
    private chromosomes: any;
    private selector: THREE.Mesh;
    private selectorOrigin: { x: number, y: number, yInit: number };
    private selectorScale: any;
    private group: THREE.Group;
    private lineMaterial;
    private chords: Array<THREE.Line>;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.chords = [];
        this.view.controls.enableRotate = false;
        this.group = new THREE.Group();
        this.view.scene.add(this.group);
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x039BE5 });
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    update(config: GraphConfig, data: any) {

        this.config = config as ChromosomeConfigModel;
        this.data = data;
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        // if (this.config.dirtyFlag & DirtyEnum.SIZE) {

        // }
        // if (this.config.dirtyFlag & DirtyEnum.COLOR) {
        //     const lines = this.geneLines;
        //     this.meshes.forEach( v => {
        //         if (data.pointColor.hasOwnProperty(v.userData.gene)) {
        //             const color = data.pointColor[v.userData.gene];
        //             (v as THREE.Mesh).material = new THREE.MeshBasicMaterial( {color: color } );
        //         } else {
        //             (v as THREE.Mesh).material = new THREE.MeshBasicMaterial( {color: 0xDDDDDD } );
        //         }
        //     });
        //     lines.forEach( v => {
        //         if (data.pointColor.hasOwnProperty(v.userData.gene)) {
        //             const color = data.pointColor[v.userData.gene];
        //             (v as THREE.Line).material = new THREE.LineBasicMaterial( { color: color });
        //         } else {
        //             (v as THREE.Line).material = new THREE.LineBasicMaterial( { color: 0xDDDDDD });
        //         }
        //     });
        this.onRequestRender.next();
    }


    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            this.sMouseMove.unsubscribe();
        }
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }

    //#region bar
    armsCompute(genes: Array<any>, chromosome: any): any {
        const mf = new Set(this.config.markerFilter);
        const arms = _.groupBy(genes, 'arm');
        arms.P = arms.P.sort( (a, b) => (b.tss - a.tss)).map( (v, i) => {
            return Object.assign(v, {
                inSet: mf.has(v.gene),
                pos: -i
            });
        });
        arms.Q = arms.Q.sort( (a, b) => (a.tss - b.tss)).map( (v, i) => {
            return Object.assign(v, {
                inSet: mf.has(v.gene),
                pos: i
            });
        });

        return {
            genes: arms,
            centro: null,
            telem: null
        };
    }
    armsAddObjets() {
        const result = this.armsCompute(this.data.result.genes, this.data.result.chromosome);
        let box: THREE.Mesh;
        const molecObjects = this.data.result.molec;

        result.genes.P.forEach(gene => {
            box = new THREE.Mesh();
            box.geometry = new THREE.BoxGeometry(20, 1, 1);
            box.position.set(0, gene.pos * 2 - 30, 0);
            box.userData.tip = gene.gene + ' - ' + gene.type.replace(/_/gi, ' ');
            box.userData.color = this.colorMap[gene.type];
            box.userData.mid = gene.gene;
            box.material = ChartFactory.getColorPhong(box.userData.color);
            this.meshes.push( box );
            this.group.add( box );

            molecObjects.forEach( (element, i) => {
                if (element.hasOwnProperty(gene.gene)) {
                    box = new THREE.Mesh();
                    box.geometry = new THREE.BoxGeometry( 20, 1, 1);
                    box.position.set(21 * i + 21, gene.pos * 2 - 30, 0);
                    box.userData.tip = gene.gene + ' - ' + gene.type.replace(/_/gi, ' ');
                    box.userData.color = 0xFF0000;//this.colorMap[gene.type];
                    box.userData.mid = gene.gene;
                    box.material = ChartFactory.getColorPhong(box.userData.color);
                    this.meshes.push( box );
                    this.group.add( box );
                }
            });
        });
        result.genes.Q.forEach(gene => {
            box = new THREE.Mesh();
            box.geometry = new THREE.BoxGeometry(20, 1, 1);
            // box.geometry = new THREE.BoxGeometry(50, 1, 1);
            box.position.set(0, gene.pos * 2 + 30, 0);
            box.userData.tip = gene.gene + ' - ' + gene.type.replace(/_/gi, ' ');
            box.userData.color = this.colorMap[gene.type];
            box.userData.mid = gene.gene;
            box.material = ChartFactory.getColorPhong(box.userData.color);
            this.meshes.push( box );
            this.group.add( box );

            molecObjects.forEach( (element, i) => {
                if (element.hasOwnProperty(gene.gene)) {
                    box = new THREE.Mesh();
                    box.geometry = new THREE.BoxGeometry( 20, 1, 1);
                    box.position.set(21 * i + 21, gene.pos * 2 + 30, 0);
                    box.userData.tip = gene.gene + ' - ' + gene.type.replace(/_/gi, ' ');
                    box.userData.color = 0xFF0000;//this.colorMap[gene.type];
                    box.userData.mid = gene.gene;
                    box.material = ChartFactory.getColorPhong(box.userData.color);
                    this.meshes.push( box );
                    this.group.add( box );
                }
            });
        });
        const mesh = ChartFactory.meshAllocate(0x039BE5, ShapeEnum.CIRCLE, 12, new Vector3(0, 0, 0), {});
        this.meshes.push(mesh);
        this.group.add(mesh);
    }
    //#endregion

    //#region circle
    circleCompute(genes: Array<any>, chromosome: any): any {
        const scaleGene = scaleLinear();
        scaleGene.domain([0, chromosome.Q]);
        scaleGene.range([0, 365]);
        const mf = new Set(this.config.markerFilter);
        const processedGenes = genes.map( (v, i) => {
            const angle = scaleGene(v.tss) * Math.PI / 180;
            return Object.assign(v, {
                inSet: mf.has(v.gene),
                sPos: { x: Math.cos(angle), y: Math.sin(angle) },
                ePos: { x: Math.cos(angle), y: Math.sin(angle) }
            });
        });
        const centroAngle = scaleGene(chromosome.C) * Math.PI / 180;
        const centro = {
            x: Math.cos(centroAngle),
            y: Math.sin(centroAngle)
        };
        const telemAngle = scaleGene(chromosome.P) * Math.PI / 180;
        const telem = {
            x: Math.cos(telemAngle),
            y: Math.sin(telemAngle)
        };
        return {
            genes: processedGenes,
            centro: centro,
            telem: telem
        };
    }
    circleAddObjects() {
        const result = this.circleCompute(this.data.result.genes, this.data.result.chromosome);
        let line;

        line = ChartFactory.lineAllocate(0x000000, new THREE.Vector2(0, 0),
            new THREE.Vector2(result.centro.x * 50, result.centro.y * 50),
            { genomicEnum: GenomicEnum.CENTROMERE } );
        this.meshes.push( line );
        this.group.add( line );

        line = ChartFactory.lineAllocate(0x039be5, new THREE.Vector2(0, 0),
            new THREE.Vector2(result.telem.x * 50, result.telem.y * 50),
            { genomicEnum: GenomicEnum.TELOMERE } );
        this.meshes.push( line );
        this.group.add( line );

        const molecObjects = this.data.result.molec;
        result.genes.forEach(gene => {

            let len = molecObjects.length;
            line = ChartFactory.lineAllocate(this.colorMap[gene.type],
                new THREE.Vector2(gene.sPos.x * (len * 10 + 12), gene.sPos.y * (len * 10 + 12)),
                new THREE.Vector2(gene.ePos.x * (len * 10 + 20), gene.ePos.y * (len * 10 + 20)),
                gene );
            this.meshes.push( line );
            this.group.add( line );

            molecObjects.forEach( (element, i) => {
                if (element.hasOwnProperty(gene.gene)) {
                    line = ChartFactory.lineAllocate(this.colorMap[gene.type],
                        new THREE.Vector2(gene.sPos.x * (i * 10 + 12), gene.sPos.y * (i * 10 + 12)),
                        new THREE.Vector2(gene.ePos.x * (i * 10 + 20), gene.ePos.y * (i * 10 + 20)),
                        gene );
                    this.meshes.push( line );
                    this.group.add( line );
                }
            });

            len += 1;
            if (gene.inSet) {
                line = ChartFactory.lineAllocate(this.colorMap[gene.type],
                    new THREE.Vector2(gene.sPos.x * (len * 10 + 12), gene.sPos.y * (len * 10 + 12)),
                    new THREE.Vector2(gene.ePos.x * (len * 10 + 20), gene.ePos.y * (len * 10 + 20)),
                    gene );
                this.meshes.push( line );
                this.group.add( line );
            }

        });
    }
    //#endregion

    addObjects() {
        if (this.config.layoutOption === 'Line') {
            this.armsAddObjets();
        } else {
            this.circleAddObjects();
        }
    }

    removeObjects() {
        this.enable(false);
        this.meshes.forEach( gene => {
            this.group.remove(gene);
        });
    }



    private onMouseMove(e: ChartEvent): void {
       this.showLabels(e);
    }

    showLabels(e: ChartEvent) {
        const meshes = ChartUtil.getVisibleMeshes(this.view, this.group);
        if (meshes.length < 0) {
            const m = meshes.map<{ label: string, x: number, y: number, z: number }>(mesh => {
                const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
                    this.view.viewport.width, this.view.viewport.height);
                return { label: mesh.userData.tip, x: coord.x + 10, y: coord.y - 5, z: coord.z };
            });
            const html = m.filter(v => v.label !== undefined).map(data => {
                return '<div class="chart-label" style="background:rgba(255,255,255,.8);font-size:10px;text-align:center;left:' +
                    (data.x - 100) + 'px;top:' + data.y +
                    'px;width:200px;position:absolute;">' + data.label + '</div>';
                }).reduce((p, c) => p += c, '');
            this.labels.innerHTML = html;
        } else {
            const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
            if (geneHit.length > 0) {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                this.labels.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#fff;padding:3px;border-radius:' +
                    '3px;z-index:9999;position:absolute;font-size:10px;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    geneHit[0].object.userData.tip + '</div>';
                return;
            } else {
                this.labels.innerHTML = '';
            }
        }
    }

    hideLabels() {
        this.labels.innerHTML = '';
    }

    constructor() { }
}
