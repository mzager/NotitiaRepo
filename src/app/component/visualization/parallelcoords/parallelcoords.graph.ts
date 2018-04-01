import { DataDecorator } from './../../../model/data-map.model';
import { ParallelCoordsDataModel, ParallelCoordsConfigModel } from './parallelcoords.model';
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
import { Injectable, EventEmitter, Output } from '@angular/core';
import { ShapeEnum, ColorEnum, GraphEnum, GenomicEnum } from 'app/model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';

export class ParallelCoordsGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
    private overMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
    private outMaterial = new THREE.LineBasicMaterial({ color: 0xDDDDDD });


    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: ParallelCoordsDataModel;
    private config: ParallelCoordsConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    public decorators: DataDecorator[];
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
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
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
        this.config = config as ParallelCoordsConfigModel;
        this.data = data;
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.COLOR) {

            const lines = this.geneLines;
            this.meshes.forEach(v => {
                if (data.pointColor.hasOwnProperty(v.userData.gene)) {
                    const color = data.pointColor[v.userData.gene];
                    (v as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: color });
                } else {
                    (v as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: 0xDDDDDD });
                }
            });
            lines.forEach(v => {
                if (data.pointColor.hasOwnProperty(v.userData.gene)) {
                    const color = data.pointColor[v.userData.gene];
                    (v as THREE.Line).material = new THREE.LineBasicMaterial({ color: color });
                } else {
                    (v as THREE.Line).material = new THREE.LineBasicMaterial({ color: 0xDDDDDD });
                }
            });
            this.onRequestRender.next();
        }
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


    addObjects() {
        const genes = this.data.genes;
        const links = this.data.links;

        genes.forEach(gene => {
            // const mesh = ChartFactory.meshAllocate(0xC0DDC0, ShapeEnum.SQUARE, .5, new THREE.Vector3(gene.x, gene.y, 0), gene);
            // (mesh.geometry as Rect)

            const geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(gene.sPos.x, gene.sPos.y, 0));
            geometry.vertices.push(new THREE.Vector3(gene.ePos.x, gene.ePos.y, 0));

            const geo = new THREE.BoxGeometry(1, 1, 1);
            const mat = new THREE.MeshBasicMaterial({ color: 0x039BE5 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.userData = gene;
            mesh.position.x = gene.sPos.x;
            mesh.position.y = gene.sPos.y;

            const geneLine = new THREE.Line(geometry, this.lineMaterial);
            geneLine.userData = gene;
            this.meshes.push(mesh);
            this.geneLines.push(geneLine);
            this.group.add(geneLine);
            this.group.add(mesh);
        });

        links.forEach((link, i) => {

            // Adjust Height According To Size - So the tall ones project out both from the ring and also from the center
            // const curve = new THREE.CatmullRomCurve3( [
            //     new THREE.Vector3( link.sPos.x, link.sPos.y, 0 ),
            //     new THREE.Vector3( 0, 30, 100 ),
            //     new THREE.Vector3( link.tPos.x, link.tPos.y, 0 ),
            // ] );
            // curve.type = 'catmullrom';
            // curve.tension = 0.9; //link.tension; // * 0.1; //0.9;

            // const curve = new THREE.CubicBezierCurve3(
            //     new THREE.Vector3( link.sPos.x, link.sPos.y, 0 ),
            //     new THREE.Vector3( 0, 0, 0 ),
            //     new THREE.Vector3( 0, 0, 0 ),
            //     new THREE.Vector3( link.tPos.x, link.tPos.y, 0 )
            // );

            // const curve = new THREE.LineCurve3(
            //     new THREE.Vector3( link.sPos.x, link.sPos.y, 0 ),
            //     new THREE.Vector3( link.tPos.x, link.tPos.y, 0 )
            // );

            let curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(link.sPos.x, link.sPos.y, 0),
                new THREE.Vector3(0, 0, 100),
                new THREE.Vector3(link.tPos.x, link.tPos.y, 0),
            );

            const geometry = new THREE.Geometry();
            link.overGeometry = geometry.vertices = curve.getPoints(50);

            curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(link.sPos.x, link.sPos.y, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(link.tPos.x, link.tPos.y, 0),
            );
            link.outGeometry = geometry.vertices = curve.getPoints(50);


            const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xDDDDDD }));
            line.userData = link;

            this.chords.push(line);
            this.group.add(line);
        });

    }

    removeObjects() {
        while (this.group.children.length) {
            this.group.remove(this.group.children[0]);
        }
        this.meshes = [];
    }



    private onMouseMove(e: ChartEvent): void {
        const intersects = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (intersects.length > 0) {

            const gene = intersects[0].object.userData.gene;
            this.chords.forEach(v => {
                if ((gene === v.userData.source) || (gene === v.userData.target)) {
                    v.material = this.overMaterial;
                    (v.geometry as THREE.Geometry).vertices = v.userData.overGeometry;
                    (v.geometry as THREE.Geometry).verticesNeedUpdate = true;
                } else {
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

    showLabels() {
        // const meshes = ChartUtil.getVisibleMeshes(this.view).map<{ label: string, x: number, y: number }>(mesh => {
        //     const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
        //         this.view.viewport.width, this.view.viewport.height);
        //     return { label: mesh.userData.tip, x: coord.x + 40, y: coord.y - 10 };
        // });
        // const html = meshes.map(data => {
        //     return '<div class="chart-label" style="font-size:12px;left:' + data.x + 'px;top:' + data.y +
        //         'px;position:absolute;">' + data.label + '</div>';
        // }).reduce((p, c) => p += c, '');
        // this.labels.innerHTML = html;
    }

    hideLabels() {
        // this.labels.innerHTML = '';
    }

    // // Events
    private molabels(e: ChartEvent): void {

        // let hits;
        // const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        // if (geneHit.length > 0) {
        //     const xPos = e.mouse.xs + 10;
        //     const yPos = e.mouse.ys;
        //     this.labels.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
        //         '3px;z-index:9999;position:absolute;left:' +
        //         xPos + 'px;top:' +
        //         yPos + 'px;">' +
        //         geneHit[0].object.userData.tip + '</div>';
        //     return;
        // }

        // const keys: Array<string> = Object.keys(this.arms);
        // for (let i = 0; i < keys.length; i++) {
        //     const kids = this.arms[keys[i]].children;
        //     hits = ChartUtil.getIntersects(this.view, e.mouse, kids);
        //     if (hits.length > 0) {
        //         const xPos = e.mouse.xs + 10;
        //         const yPos = e.mouse.ys;
        //         this.labels.innerHTML = '<div style="background:rgba(255,255,255,.8);padding:3px;border-radius:3px;' +
        //             'z-index:9999;position:absolute;left:' +
        //             xPos + 'px;top:' +
        //             yPos + 'px;">' +
        //             hits[0].object.userData.tip + '</div>';
        //         break;
        //     } else {
        //         this.labels.innerHTML = '';
        //     }
        // }
    }

    constructor() { }
}
