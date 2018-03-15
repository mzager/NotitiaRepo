import { DataDecorator } from './../../../model/data-map.model';
// import { Tween, Easing } from 'es6-tween';
import { Colors, EntityTypeEnum, WorkspaceLayoutEnum, DirtyEnum, CollectionTypeEnum } from './../../../model/enum.model';
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
import { GenomeConfigModel, GenomeDataModel } from './genome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import * as TWEEN from 'tween.js';
import { ChromosomeConfigModel } from 'app/component/visualization/chromosome/chromosome.model';
import { DataTable } from 'app/model/data-field.model';

export class GenomeGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{type: GraphConfig}> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();


    // Chart Elements
    private labels: HTMLElement;
    private overlay: HTMLElement;
    private tooltips: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: GenomeDataModel;
    private config: GenomeConfigModel;
    private isEnabled: boolean;

    // Objects
    public tads: Array<THREE.Object3D>;
    public lines: Array<THREE.Line>;
    public meshes: Array<THREE.Mesh>;
    public groups: Array<THREE.Group>;
    public chromosomeMeshes: Array<THREE.Mesh>;
    private arms: any;
    private chromosomes: any;
    private group: THREE.Group;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        view.camera.position.set(0, 0, 1000);
        view.camera.rotation.setFromVector3( new THREE.Vector3(0, 0, 0) );
        this.labels = labels;
        this.labels.innerText = '';

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild( this.tooltips );

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild( this.overlay );
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.arms = {};
        this.meshes = [];
        this.lines = [];
        this.tads = [];
        this.groups = [];
        this.chromosomeMeshes = [];
        this.view.controls.enableRotate = false;
        this.group = new THREE.Group();
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }
    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        throw new Error('Method not implemented.');
    }
    updateData(config: GraphConfig, data: any) {
        this.config = config as GenomeConfigModel;
        this.data = data;

        this.removeObjects();
        this.addObjects();

        // if (this.config.dirtyFlag & DirtyEnum.COLOR) {
        //     const objMap = data.pointColor;

        //     this.meshes.forEach(mesh => {
        //         const color = objMap[mesh.userData.mid];
        //        mesh.material = ChartFactory.getColorPhong(color);
        //         mesh.userData.color = color;
        //     });
        //     this.lines.forEach(line => {
        //         const color = objMap[line.userData.mid];
        //         line.material = new THREE.LineBasicMaterial({color: color});
        //         line.userData.color = color;
        //     });
        // }
    }

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
            this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
        } else {
            this.sMouseMove.unsubscribe();
            this.sMouseDown.unsubscribe();
            this.tooltips.innerHTML = '';
        }
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    addObjects() {
        const chromoMultiplier = 15;
        const chromoOffset = 12 * chromoMultiplier;

        this.arms = {};
        this.chromosomes  = {};
        for (let i = 0; i < this.data.chromo.length; i++) {
            this.chromosomes[i] = new THREE.Group();
            (this.chromosomes[i] as THREE.Group).userData.chromosome = i;
            this.arms[i + 'P'] = new THREE.Group();
            this.arms[i + 'Q'] = new THREE.Group();
            this.arms[i + 'P'].position.setX(i * chromoMultiplier - chromoOffset);
            this.arms[i + 'Q'].position.setX(i * chromoMultiplier - chromoOffset);
            this.chromosomes[i].add(this.arms[i + 'P']);
            this.chromosomes[i].add(this.arms[i + 'Q']);
            this.group.add(this.chromosomes[i]);
        }

        this.data.chromo.forEach((v, i) => {
            const chromosomeNumber = i + 1;
            const centro: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(0, 0, 0), {});
            centro.userData.type = GenomicEnum.CENTROMERE;
            centro.userData.chromosome = chromosomeNumber;
            centro.userData.chr = v.chr;
            centro.userData.tip = 'Centromere ' + chromosomeNumber;
            this.arms[i + 'Q'].add(centro);
            this.chromosomeMeshes.push(centro);

            const teleQ: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(0, v.Q - v.C, 0), {});
            teleQ.userData.chr = v.chr;
            teleQ.userData.type = GenomicEnum.Q_TELOMERE;
            centro.userData.chromosome = chromosomeNumber;
            teleQ.userData.tip = 'Telemere Q ' + chromosomeNumber;
            this.arms[i + 'Q'].add(teleQ);
            this.chromosomeMeshes.push(teleQ);

            const teleP: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(0, v.P - v.C, 0), {});
            teleP.userData.chr = v.chr;
            teleP.userData.type = GenomicEnum.P_TELOMERE;
            centro.userData.chromosome = chromosomeNumber;
            centro.userData.chr = v.chr;
            centro.userData.type = GenomicEnum.CENTROMERE;
            teleP.userData.tip = 'Telemere P ' + chromosomeNumber;
            this.arms[i + 'P'].add(teleP);
            this.chromosomeMeshes.push(teleP);
        });

        this.data.bands.forEach((chromo, i) => {
            const centro = this.data.chromo[i].C;
            let yPos = 0;
            chromo.forEach((band, j) => {

                const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.5, band.l);
                const material: THREE.Material = ChartFactory.getColorPhong(band.c);
                const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
                mesh.userData.type = GenomicEnum.CYTOBAND;
                mesh.position.set(0, (yPos + (band.l / 2)) - centro, 0);
                mesh.userData.tip = band.chr + band.arm.toLowerCase() +
                    ((band.subband) ? '.' + band.subband : '') + ' | ' + band.tag.replace('neg', '-').replace('pos', '+');
                this.arms[i + band.arm].add(mesh);
                yPos += band.l;
                this.chromosomeMeshes.push(mesh);
            });
        });

        // Tads
        if (this.config.showTads) {
            this.data.tads.forEach(tad => {
                const chromoIndex: number = (tad.chr === 'X') ? 23 : (tad.chr === 'Y') ? 24 : parseInt(tad.chr, 10);
                const xPos = (chromoIndex - 1) * chromoMultiplier - chromoOffset;
                const centro = this.data.chromo[chromoIndex - 1].C;
                const q = this.data.chromo[chromoIndex].Q;
                const line = ChartFactory.lineAllocateCurve(
                    0x9c27b0,
                    new THREE.Vector2(xPos, tad.s -  centro),
                    new THREE.Vector2(xPos, tad.e -  centro),
                    new THREE.Vector2(
                        xPos + (chromoMultiplier * 0.2),
                        (Math.abs(tad.e - tad.s) * 0.5) + tad.s - centro
                    )
                );
                this.tads.push(line);
                this.view.scene.add(line);
            });
        }

        // Genes
        Object.keys(this.data.genes).forEach(chromo => {
            const chromoIndex: number = (chromo === 'X') ? 23 : (chromo === 'Y') ? 24 : parseInt(chromo, 10);
            const genes = this.data.genes[chromo];
            const centro = this.data.chromo[chromoIndex - 1].C;
            genes.filter((v) => v.color !== 0xFFFFFF)
                .forEach(gene => {
                    const group = new THREE.Group();
                    // group.userData.mid = gene.gene.toUpperCase();
                    // group.userData.tip = gene.gene;
                    group.position.x = 0;
                    group.position.y = (gene.tss - centro);
                    group.position.z = 0;
                    this.groups.push(group);

                    const lineMat = new THREE.LineBasicMaterial({color: gene.color});
                    const lineGeom = new THREE.Geometry();
                    lineGeom.vertices.push(
                        new THREE.Vector3( -2, 0, 0 ),
                        new THREE.Vector3( 0, 0, 0 )
                    );
                    const line = new THREE.Line(lineGeom, lineMat);
                    line.userData.mid = gene.gene.toUpperCase();
                    line.userData.tip = gene.gene;
                    this.lines.push(line);
                    group.add(line);

                    const shape = new THREE.PlaneGeometry(4, 1);
                    const color = ChartFactory.getColorPhong(gene.color);
                    const mesh = new THREE.Mesh(shape, color);
                    mesh.userData.mid = gene.gene.toUpperCase();
                    mesh.userData.tip = gene.gene;
                    mesh.position.setX(-3.5);
                    this.meshes.push(mesh);
                    group.add(mesh);

                    this.arms[ (chromoIndex - 1) + gene.arm].add(group);
                });
        });
        this.view.scene.add(this.group);
    }

    removeObjects() {
        this.tads.forEach( tad => {
            this.view.scene.remove(tad);
        });
        this.groups.forEach( group => {
            this.view.scene.remove(group);
        });
        this.tads = [];
        this.meshes = [];
        this.arms = [];
        this.groups = [];
        while (this.group.children.length) {
            this.group.remove(this.group.children[0]);
        }
        this.view.scene.remove(this.group);
    }

    private onMouseDown(e: ChartEvent): void {
        const hits = ChartUtil.getIntersects(this.view, e.mouse, this.chromosomeMeshes);
        if (hits.length > 0) {
            const data = hits[0].object.userData;
            switch (data.type) {
                case GenomicEnum.CENTROMERE:
                    const chromosomeConfig = new ChromosomeConfigModel();
                    chromosomeConfig.graph = (this.config.graph === GraphEnum.GRAPH_A) ? GraphEnum.GRAPH_B : GraphEnum.GRAPH_A;
                    chromosomeConfig.chromosome = data.chromosome.toString();
                    chromosomeConfig.dirtyFlag = DirtyEnum.LAYOUT;
                    console.log('TODO: Should not takeover table definition and preserve if possible origional chromo options');
                    chromosomeConfig.table = this.config.table;
                    this.onConfigEmit.next({type: chromosomeConfig as GraphConfig});
                    break;
                // case GenomicEnum.P_TELOMERE:
                //     debugger;
                // case GenomicEnum.Q_TELOMERE:
                //     debugger;
            }
        }
    }
    private onMouseMove(e: ChartEvent): void {
       this.showLabels(e);
    }

    showLabels(e: ChartEvent) {

        let hits;
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (hit.length > 0) {
            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                hit[0].object.userData.tip + '</div>';
            return;
        }

        const keys: Array<string> = Object.keys(this.arms);
        for (let i = 0; i < keys.length; i++) {
            const kids = this.arms[keys[i]].children;
            hits = ChartUtil.getIntersects(this.view, e.mouse, kids);
            if (hits.length > 0) {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                this.tooltips.innerHTML = '<div style="background:rgba(255,255,255,.8);padding:3px;border-radius:3px;' +
                    'z-index:9999;position:absolute;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    hits[0].object.userData.tip + '</div>';
                break;
            } else {
                this.tooltips.innerHTML = '';
            }
        }
    }

    hideLabels() {
        this.tooltips.innerHTML = '';
    }

    constructor() { }
}
