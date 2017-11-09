import { hicComputeFn } from './hic.compute';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HicConfigModel, HicDataModel } from './hic.model';
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
import { ShapeEnum, ColorEnum, GraphEnum } from 'app/model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import graph from 'ngraph.graph';
import forcelayout3d from 'ngraph.forcelayout3d';
import MeshLine from 'three.meshline';
import * as TWEEN from 'tween.js';
import { schemeRdBu, interpolateRdBu, interpolateYlGnBu } from 'd3-scale-chromatic';
import { scaleLinear, scaleOrdinal, scaleSequential } from 'd3-scale';

export class HicGraph implements ChartObjectInterface {

    private NODE_SIZE = 5;

    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: HicDataModel;
    private config: HicConfigModel;
    private isEnabled: boolean;
    chromosomeLine: any;
    chromosomeGeometry: THREE.Geometry;
    chromosomeCurve: THREE.CatmullRomCurve3;
    chromosomePath: THREE.CurvePath<THREE.Vector>;
    normal = new THREE.Vector3(0, 0, 0);
    binormals = new THREE.Vector3(0, 0, 0);

    // Objects
    public meshes: Array<THREE.Mesh>;
    public lines: Array<THREE.Line>;
    private graphData: any;
    private colors = [0xb71c1c, 0x880e4f, 0x4a148c, 0x311b92, 0x1a237e, 0x0d47a1, 0x01579b, 0x006064,
        0x004d40, 0x1b5e20, 0x33691e, 0x827717, 0xf57f17, 0xff6f00, 0xe65100, 0xbf360c, 0x3e2723,
        0xf44336, 0xe91e63, 0x9c27b0, 0x673ab7, 0x3f51b5, 0x2196f3, 0x03a9f4, 0x00bcd4, 0x009688,
        0x4caf50, 0x8bc34a, 0xcddc39, 0xffeb3b, 0xffc107, 0xff9800, 0xff5722, 0x795548];

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
        this.lines = [];
        this.view.controls.enableRotate = true;
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    update(config: GraphConfig, data: any) {
        this.config = config as HicConfigModel;
        this.data = data;
        this.removeObjects();
        this.addObjects();
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

        if (this.config.showChromosome) {
            const geneLocations = this.data.nodes.filter(v => v.data)    // Filter Out genes That Don't Have Chromosome Info
                .sort((a, b) => ((a.data.tss <= b.data.tss) ? -1 : 1)) // Sort Genes By Location On Chromosome
                .map(node => new THREE.Vector3(node.x, node.y, node.z));
            this.chromosomeCurve = new THREE.CatmullRomCurve3(geneLocations);
            this.chromosomeCurve['type'] = 'chordal';
            this.chromosomePath = new THREE.CurvePath();
            this.chromosomePath.add(this.chromosomeCurve);

            this.chromosomeGeometry = this.chromosomePath.createPointsGeometry(1000);
            this.chromosomeLine = new MeshLine.MeshLine();
            this.chromosomeLine.setGeometry(this.chromosomeGeometry);
            const mat = new MeshLine.MeshLineMaterial({
                color: new THREE.Color(0x90caf9),
                lineWidth: 2,
            });

            const chromosomeMesh = new THREE.Mesh(this.chromosomeLine.geometry, mat); // this syntax could definitely be improved!
            chromosomeMesh.frustumCulled = false;
            this.view.scene.add(chromosomeMesh);
            this.meshes.push(chromosomeMesh);
        }


        if (this.config.showLinks) {
            this.data.edges.forEach(edge => {
                const linkGeometry = new THREE.Geometry();
                linkGeometry.vertices.push(new THREE.Vector3(edge.source.x, edge.source.y, edge.source.z));
                linkGeometry.vertices.push(new THREE.Vector3(edge.target.x, edge.target.y, edge.target.z));
                const linkMaterial = new THREE.LineBasicMaterial({ color: edge.color });
                const line = new THREE.Line(linkGeometry, linkMaterial);
                this.lines.push(line);
                this.view.scene.add(line);
            });
        }

        // const geneLocations = this.data.nodes.map( node => new THREE.Vector3(node.data.x, node.data.y, node.data.z) );
        // this.chromosomeCurve = new THREE.CatmullRomCurve3( geneLocations );
        // this.chromosomeCurve['type'] = 'chordal';
        // this.chromosomePath = new THREE.CurvePath();
        // this.chromosomePath .add(this.chromosomeCurve);

        //  this.chromosomeGeometry =  this.chromosomePath.createPointsGeometry(1000);
        //  this.chromosomeLine = new MeshLine.MeshLine();
        //  this.chromosomeLine.setGeometry( this.chromosomeGeometry );
        //  const mat = new MeshLine.MeshLineMaterial({
        //     color: new THREE.Color( 0x90caf9),
        //     lineWidth: 2,
        //  });



        const sl = scaleLinear().range([.2, 2]).domain([1, 20]);
        const cs = scaleSequential(interpolateYlGnBu).domain([0, 7]);
        this.data.nodes.forEach(node => {
            const data = { tip: node.gene, type: EntityTypeEnum.GENE };
            const edges = this.data.edges;
            const metrics = edges.reduce((p, c) => {
                if (c.source.gene === node.gene || c.target.gene === node.gene) {
                    p.c += 1;
                    p.t += c.tension;
                }
                return p;
            }, { c: 0, t: 0 });
            const scale = sl(metrics.c);
            const color = parseInt('0x' +
                cs(Math.round(metrics.t / metrics.c)).toString()
                    .split('(')[1]
                    .split(')')[0]
                    .split(',')
                    .map(v => {
                        v = parseInt(v, 10).toString(16);
                        return (v.length === 1) ? '0' + v : v;
                    })
                    .join(''), 16);
            const mesh = ChartFactory.meshAllocate(color, ShapeEnum.CIRCLE, scale,
                new THREE.Vector3(node.x, node.y, node.z), data);

            data.tip += ' [' + metrics.c + '.' + Math.round(metrics.t / metrics.c) + ']';

            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        });

        this.onRequestRender.emit();
        //this.animateCamera();
    }

    animateCamera(): void {
        const animation = {
            step: 0, view: this.view,
            line: this.chromosomeLine,
            path: this.chromosomePath,
            geo: this.chromosomeGeometry,
            chromosomeCurve: this.chromosomeCurve,
            onRequestRender: this.onRequestRender
        };
        const steps = this.chromosomePath.getPoints().length;
        new TWEEN.Tween(animation)
            .to({ step: 1, target: 1.5 }, 90000)
            .delay(500)
            .onUpdate((step) => {

                const cameraPos = this.chromosomeCurve.getPointAt(step);
                const tan = this.chromosomeCurve.getTangentAt(step);
                this.view.camera.position.copy(cameraPos);
                this.view.camera.rotation.setFromVector3(tan);
                (this.view.camera as THREE.PerspectiveCamera).fov = 80;

                this.view.camera.lookAt(this.chromosomeCurve.getPointAt(step + 0.01));
                this.onRequestRender.emit();
            })
            .start();
    }

    removeObjects() {
        this.labels.innerHTML = '';
        for (let i = 0; i < this.lines.length; i++) {
            this.view.scene.remove(this.lines[i]);
        }
        for (let i = 0; i < this.meshes.length; i++) {
            this.view.scene.remove(this.meshes[i]);
        }
    }

    private onMouseUp(e: ChartEvent): void {
    }
    private onMouseDown(e: ChartEvent): void {
    }
    private onMouseMove(e: ChartEvent): void {
        if (!this.config.showLabels) {
            return;
        }
        const meshes = ChartUtil.getVisibleMeshes(this.view).map<{ label: string, x: number, y: number, z: number }>(mesh => {
            const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
                this.view.viewport.width, this.view.viewport.height);
            return { label: mesh.userData.tip, x: coord.x + 10, y: coord.y - 5, z: coord.z };
        });

        const html = meshes.filter(v => v.label !== undefined).map(data => {
            return '<div class="chart-label" style="background: rgba(255, 255, 255, .5);font-size:8px;left:' + data.x + 'px;top:' + data.y +
                'px;position:absolute;">' + data.label + '</div>';
        }).reduce((p, c) => p += c, '');
        this.labels.innerHTML = html;
    }

    constructor() { }

}
