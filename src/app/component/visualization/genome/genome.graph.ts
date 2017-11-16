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

export class GenomeGraph implements ChartObjectInterface {

    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: GenomeDataModel;
    private config: GenomeConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
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
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.arms = {};
        this.meshes = [];
        this.chromosomeMeshes = [];
        this.view.controls.enableRotate = false;
        this.group = new THREE.Group();
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    update(config: GraphConfig, data: any) {
        this.config = config as GenomeConfigModel;
        this.data = data;
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.COLOR) {
            const objMap = data.pointColor;
            this.meshes.forEach(mesh => {
                const color = objMap[mesh.userData.id];
                (mesh as THREE.Mesh).material = ChartFactory.getColorPhong(color);
                mesh.userData.color = color;
            });
        }
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

            const centro: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(0, 0, 0), {});
            centro.userData.type = GenomicEnum.CENTROMERE;
            centro.userData.chromosome = i;
            centro.userData.tip = 'Centromere ' + i;
            this.arms[i + 'Q'].add(centro);
            this.chromosomeMeshes.push(centro);

            const teleQ: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(0, v.Q - v.C, 0), {});
            teleQ.userData.type = GenomicEnum.Q_TELOMERE;
            centro.userData.chromosome = i;
            teleQ.userData.tip = 'Telemere Q ' + i;
            this.arms[i + 'Q'].add(teleQ);
            this.chromosomeMeshes.push(teleQ);

            const teleP: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(0, v.P - v.C, 0), {});
            teleP.userData.type = GenomicEnum.P_TELOMERE;
            centro.userData.chromosome = i;
            teleP.userData.tip = 'Telemere P ' + i;
            this.arms[i + 'P'].add(teleP);
            this.chromosomeMeshes.push(teleP);

        });

        this.data.bands.forEach((chromo, i) => {
            const centro = this.data.chromo[i].C;
            let yPos = 0;
            chromo.forEach((band, j) => {
                const geometry: THREE.CylinderGeometry =
                    new THREE.CylinderGeometry(
                        (band.tag === 'acen' && band.arm === 'P') ? 0 : .5,
                        (band.tag === 'acen' && band.arm === 'Q') ? 0 : .5,
                         band.l);
                const material: THREE.Material = ChartFactory.getColorMetal(band.c);
                const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
                mesh.userData.type = GenomicEnum.CYTOBAND;
                mesh.position.set(0, (yPos + (band.l / 2)) - centro, 0);
                mesh.userData.tip = band.chr + band.arm.toLowerCase() + band.band +
                    ((band.subband) ? '.' + band.subband : '') + ' | ' + band.tag.replace('neg', '-').replace('pos', '+');
                this.arms[i + band.arm].add(mesh);
                yPos += band.l;
                this.chromosomeMeshes.push(mesh);
            });
        });

        // Genes
        Object.keys(this.data.genes).forEach(chromo => {
            const chromoIndex: number = (chromo === 'X') ? 23 : (chromo === 'Y') ? 24 : parseInt(chromo, 10);
            const genes = this.data.genes[chromo];
            const centro = this.data.chromo[chromoIndex - 1].C;
            genes.filter((v) => v.color !== 0xFFFFFF)
                .forEach(gene => {
                    const shape = new THREE.BoxGeometry(5, 1, 5); //THREE.CylinderGeometry(3, 3, 1, 6);
                    const color = ChartFactory.getColorPhong(gene.color);
                    const mesh = new THREE.Mesh(shape, color);
                    // mesh.position.x = ((chromoIndex - 1) * chromoMultiplier - chromoOffset);
                    mesh.position.x = 0;
                    mesh.position.y = (gene.tss - centro);
                    mesh.position.z = 0;
                    mesh.userData.id = gene.gene;
                    mesh.userData.tip = gene.gene;
                    //  +
                    //     ' | x̅ ' + (Math.round(100 * gene.mean) / 100) +
                    //     ' σx̅ ' + (Math.round(100 * gene.meandev) / 100);
                    this.meshes.push(mesh);
                    this.arms[ (chromoIndex - 1) + gene.arm].add(mesh);
                });
        });

        this.group.rotateX(Math.PI); // Flip View
        this.view.scene.add(this.group);
    }

    removeObjects() {
        while (this.group.children.length) {
            this.group.remove(this.group.children[0]);
        }
        this.view.scene.remove(this.group);
    }

    private onMouseMove(e: ChartEvent): void {
       this.showLabels(e);
    }

    showLabels(e: ChartEvent) {
        let hits;
        const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (geneHit.length > 0) {
            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            this.labels.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                geneHit[0].object.userData.tip + '</div>';
            return;
        }

        const keys: Array<string> = Object.keys(this.arms);
        for (let i = 0; i < keys.length; i++) {
            const kids = this.arms[keys[i]].children;
            hits = ChartUtil.getIntersects(this.view, e.mouse, kids);
            if (hits.length > 0) {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                this.labels.innerHTML = '<div style="background:rgba(255,255,255,.8);padding:3px;border-radius:3px;' +
                    'z-index:9999;position:absolute;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    hits[0].object.userData.tip + '</div>';
                break;
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
