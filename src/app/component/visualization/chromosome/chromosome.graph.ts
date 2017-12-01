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
    private geneLines: Array<THREE.Line>;
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
        this.geneLines = [];
        this.chords = [];
        this.view.controls.enableRotate = true;
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
            this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
            this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            this.sMouseUp.unsubscribe();
            this.sMouseDown.unsubscribe();
            this.sMouseMove.unsubscribe();
        }
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }

    //#region bar
    armsCompute(genes: Array<any>, chromosome: any): any {
        const scaleP = scaleLinear();
        const scaleQ = scaleLinear();
        scaleP.domain([0, chromosome.C]);
        scaleQ.domain([chromosome.C, chromosome.Q]);
        const w = (this.view.viewport.width * 0.25);
        scaleP.range([-w, w]);
        scaleQ.range([-w, w]);
    }
    armsAddObjet() {
        const result = this.armsCompute(this.data.result.genes, this.data.result.chromosome);

    }
    //#endregion

    //#region circle
    circleCompute(genes: Array<any>, chromosome: any): any {
        const scaleGene = scaleLinear();
        scaleGene.domain([0, chromosome.Q]);
        scaleGene.range([0, 365]);
        // const radius = 80;
        // const r = 5;
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
        this.geneLines.push( line );
        this.group.add( line );

        line = ChartFactory.lineAllocate(0x039be5, new THREE.Vector2(0, 0),
            new THREE.Vector2(result.telem.x * 50, result.telem.y * 50),
            { genomicEnum: GenomicEnum.TELOMERE } );
        this.geneLines.push( line );
        this.group.add( line );

        result.genes.forEach(gene => {
            if (gene.inSet) {
                line = ChartFactory.lineAllocate(this.colorMap[gene.type], new THREE.Vector2(gene.sPos.x * 30, gene.sPos.y * 30),
                new THREE.Vector2(gene.ePos.x * 40, gene.ePos.y * 40),
                gene );
                this.geneLines.push( line );
                this.group.add( line );
            }

            line = ChartFactory.lineAllocate(this.colorMap[gene.type], new THREE.Vector2(gene.sPos.x * 50, gene.sPos.y * 50),
                new THREE.Vector2(gene.ePos.x * 40, gene.ePos.y * 40),
                gene );
            this.geneLines.push( line );
            this.group.add( line );
        });
    }
    //#endregion

    addObjects() {
       this.circleAddObjects();
    }

    removeObjects() {
        this.enable(false);
        this.geneLines.forEach( gene => {
            this.group.remove(gene);
        });
    }



    private onMouseMove(e: ChartEvent): void {
        const intersects = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (intersects.length > 0) {

            const gene = intersects[0].object.userData.gene;

            this.chords.forEach( v => {
                if ( (gene === v.userData.source) || (gene === v.userData.target) ) {
                    v.material = this.overMaterial;
                    (v.geometry as THREE.Geometry).vertices = v.userData.overGeometry;
                    (v.geometry as THREE.Geometry).verticesNeedUpdate = true;
                }else {
                    v.material = this.outMaterial;
                    (v.geometry as THREE.Geometry).vertices = v.userData.outGeometry;
                    (v.geometry as THREE.Geometry).verticesNeedUpdate = true;
                }
            });
            this.onRequestRender.emit();
        }
    }

    private onMouseUp(e: ChartEvent): void {

    }

    private onMouseDown(e: ChartEvent): void {

    }

    constructor() { }
}
