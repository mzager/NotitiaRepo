import { hicComputeFn } from './hic.compute';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HicConfigModel, HicDataModel } from './hic.model';
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

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{type: GraphConfig}> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
        
    private NODE_SIZE = 5;

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
    public chromosomeMesh: THREE.Mesh;
    private graphData: any;

    // Private Subscriptions
    private sMouseMove: Subscription;
    

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
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.COLOR) {
            const idProperty = (config.entity === EntityTypeEnum.GENE) ? 'mid' :
            (this.config.pointColor.ctype & CollectionTypeEnum.MOLECULAR) ? 'sid' : 'pid';
            const objMap = data.pointColor;
            this.meshes.forEach(mesh => {
                const color = objMap[mesh.userData[idProperty]];
                (mesh as THREE.Mesh).material = ChartFactory.getColorPhong(color);
                mesh.userData.color = color;
            });
        }
        if (this.config.dirtyFlag & DirtyEnum.OPTIONS | DirtyEnum.LAYOUT) {

            // Remove Objects
            this.labels.innerHTML = '';
            if (this.chromosomeMesh !== null) {
                this.view.scene.remove(this.chromosomeMesh);
                this.chromosomeMesh = null;
            }
            for (let i = 0; i < this.lines.length; i++) {
                this.view.scene.remove(this.lines[i]);
            }

            // Add Objects
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
            if (this.chromosomeMesh !== null) {
                this.view.scene.remove(this.chromosomeMesh);
                this.chromosomeMesh = null;
            }
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

                this.chromosomeMesh = new THREE.Mesh(this.chromosomeLine.geometry, mat); // this syntax could definitely be improved!
                this.chromosomeMesh.frustumCulled = false;
                this.view.scene.add(this.chromosomeMesh);
            }
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

        const sl = scaleLinear().range([.2, 2]).domain([1, 20]);
        const cs = scaleSequential(interpolateYlGnBu).domain([0, 7]);
        this.data.nodes.forEach(node => {
            const data = { tip: node.gene, type: EntityTypeEnum.GENE, mid: node.gene };
            const edges = this.data.edges;
            const metrics = edges.reduce((p, c) => {
                if (c.source.gene === node.gene || c.target.gene === node.gene) {
                    p.c += 1;
                    p.t += c.tension;
                }
                return p;
            }, { c: 0, t: 0 });
            const scale = sl(metrics.c);

            const color = 0x039BE5;

            const mesh = ChartFactory.meshAllocate(color, ShapeEnum.CIRCLE, scale,
                new THREE.Vector3(node.x, node.y, node.z), data);

            data.tip += ' [' + metrics.c + '.' + Math.round(metrics.t / metrics.c) + ']';

            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        });

        this.onRequestRender.emit();
        // this.animateCamera();
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
        for (let i = 0; i < this.meshes.length; i++) {
            this.view.scene.remove(this.meshes[i]);
        }
        if (this.chromosomeMesh !== null) {
            this.view.scene.remove(this.chromosomeMesh);
            this.chromosomeMesh = null;
        }
        for (let i = 0; i < this.lines.length; i++) {
            this.view.scene.remove(this.lines[i]);
        }
    }

    private onMouseMove(e: ChartEvent): void {

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
        this.labels.innerHTML = '';


        // const meshes = ChartUtil.getVisibleMeshes(this.view).map<{ label: string, x: number, y: number, z: number }>(mesh => {
        //     const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
        //         this.view.viewport.width, this.view.viewport.height);
        //     return { label: mesh.userData.tip, x: coord.x + 10, y: coord.y - 5, z: coord.z };
        // });

        // const html = meshes.filter(v => v.label !== undefined).map(data => {
        //     return '<div class="chart-label" style="background: rgba(255, 255, 255, .5);font-size:8px;left:' + data.x + 'px;top:' + data.y +
        //         'px;position:absolute;">' + data.label + '</div>';
        // }).reduce((p, c) => p += c, '');
        // this.labels.innerHTML = html;
    }

    constructor() { }

}
