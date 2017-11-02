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

import { scaleLinear, scaleOrdinal } from 'd3-scale';

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

    createNodeUI = (node, color): THREE.Mesh => {
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: color });
        const nodeGeometry = new THREE.SphereGeometry(this.NODE_SIZE);
        return new THREE.Mesh(nodeGeometry, nodeMaterial);
    }

    createLinkUI = (link): THREE.Line => {
        const linkGeometry = new THREE.Geometry();
        linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        const linkMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
        return new THREE.Line(linkGeometry, linkMaterial);
    }

    nodeRenderer = (node) => {
        node.position.x = node.pos.x;
        node.position.y = node.pos.y;
        node.position.z = node.pos.z;
    }

    linkRenderer = (link) => {
        const from = link.from;
        const to = link.to;
        link.geometry.vertices[0].set(from.x, from.y, from.z);
        link.geometry.vertices[1].set(to.x, to.y, to.z);
        link.geometry.verticesNeedUpdate = true;
    }

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
        hicComputeFn(config as HicConfigModel).then(graphData => {
            this.config = config as HicConfigModel;
            this.data = graphData;
            this.removeObjects();
            this.addObjects();
        });
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

        
        this.data.nodes.forEach( node => {
            const data = {tip: node.id, type: EntityTypeEnum.GENE};
            const mesh = ChartFactory.meshAllocate( 0x039BE5, ShapeEnum.CIRCLE, 3,
                new THREE.Vector3(node.data.x, node.data.y, node.data.z), data);
            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        });

        this.data.edges.forEach( edge => {
            const line = this.createLinkUI(edge);
            const from = edge.data.from;
            const to = edge.data.to;
            const geometry = line.geometry as THREE.Geometry;
            geometry.vertices[0].set(from.x, from.y, from.z);
            geometry.vertices[1].set(to.x, to.y, to.z);
            geometry.verticesNeedUpdate = true;
            this.lines.push(line);
            this.view.scene.add(line);
        });

        this.onRequestRender.emit();

    }

    removeObjects() {
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
        const meshes = ChartUtil.getVisibleMeshes(this.view).map<{ label: string, x: number, y: number, z:number }>(mesh => {
            const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
                this.view.viewport.width, this.view.viewport.height);
            return { label: mesh.userData.tip, x: coord.x + 25, y: coord.y - 10, z: coord.z };
        })
        //.sort( (a, b) => (a.z < b.z) ? 1 : -1 ).filter( (v, i) => i < 10);


        const html = meshes.map(data => {
            return '<div class="chart-label" style="background: rgba(255, 255, 255, .5);font-size:8px;left:' + data.x + 'px;top:' + data.y +
                'px;position:absolute;">' + data.label + '</div>';
        }).reduce((p, c) => p += c, '');
        this.labels.innerHTML = html;
    }

    constructor() {}

}
