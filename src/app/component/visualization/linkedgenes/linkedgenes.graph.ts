import { linkedGeneComputeFn } from './linkedgenes.compute';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { LinkedGeneConfigModel, LinkedGeneDataModel } from './linkedgenes.model';
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

export class LinkedGeneGraph implements ChartObjectInterface {

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
    private data: LinkedGeneDataModel;
    private config: LinkedGeneConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    public lines: Array<THREE.Line>;
    private graphData: any;
    private colors = [0xb71c1c, 0x880e4f, 0x4a148c, 0x311b92, 0x1a237e, 0x0d47a1, 0x01579b, 0x006064,
        0x004d40, 0x1b5e20, 0x33691e, 0x827717, 0xf57f17, 0xff6f00, 0xe65100, 0xbf360c, 0x3e2723,
        0xf44336, 0xe91e63, 0x9c27b0, 0x673ab7, 0x3f51b5, 0x2196f3, 0x03a9f4, 0x00bcd4, 0x009688,
        0x4caf50, 0x8bc34a, 0xcddc39, 0xffeb3b, 0xffc107, 0xff9800, 0xff5722, 0x795548];

    createNodeUI = (node, color): THREE.Mesh => {
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: color });
        const nodeGeometry = new THREE.SphereGeometry(this.NODE_SIZE);
        return new THREE.Mesh(nodeGeometry, nodeMaterial);
    }

    createLinkUI = (link): THREE.Line => {
        const linkGeometry = new THREE.Geometry();
        linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        linkGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        const linkMaterial = new THREE.LineBasicMaterial({ color: 0x3F51B5 });
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
        linkedGeneComputeFn(config as LinkedGeneConfigModel).then(graphData => {
            this.graphData = graphData;
            this.config = config as LinkedGeneConfigModel;
            this.data = data;
            this.removeObjects();
            this.addObjects();
        });
    }

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
    }

    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    addObjects() {

        const _graph = graph();

        this.graphData.nodes.forEach( (v, i ) => { _graph.addNode(v, this.graphData.nodeData[i]); } );
        this.graphData.edges.forEach( v => _graph.addLink( v.source, v.target ));

        const _layout = forcelayout3d(_graph);
        for (let i = 0; i < 200; i++) {
             _layout.step();
        }

        _graph.forEachNode( node => {

            let color = 0x000000;
            try {
                color = this.colors[node.data.chr];
            } catch (e) {
                color = 0x000000;
            }

            const mesh = this.createNodeUI(node, color);
            const position = _layout.getNodePosition(node.id);
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;
            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        } );

        _graph.forEachLink( link => {
            const line = this.createLinkUI(link);
            const position = _layout.getLinkPosition(link.id);
            const from = position.from;
            const to = position.to;
            const geometry = line.geometry as THREE.Geometry;
            geometry.vertices[0].set(from.x, from.y, from.z);
            geometry.vertices[1].set(to.x, to.y, to.z);
            geometry.verticesNeedUpdate = true;
            this.lines.push(line);
            this.view.scene.add(line);
        });

    }

    removeObjects() {
        // this.lines.forEach( this.view.scene.remove);
        // this.meshes.forEach( this.view.scene.remove);
    }

    constructor() { }
}
