import { HeatmapDataModel, HeatmapConfigModel } from './heatmap.model';
import { EventEmitter, Output } from '@angular/core';

import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { GraphConfig } from 'app/model/graph-config.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvents, ChartEvent } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { FontFactory } from './../../../service/font.factory';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { DimensionEnum, EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { Memoize } from 'typescript-memoize';
import { ShapeEnum, GraphEnum } from 'app/model/enum.model';

export class HeatmapGraph implements ChartObjectInterface {

    // Events
    public onSelect: EventEmitter<{type: EntityTypeEnum, ids: Array<string>}> =
        new EventEmitter<{type: EntityTypeEnum, ids: Array<string>}>();
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: HeatmapDataModel;
    private config: HeatmapConfigModel;
    private isEnabled: boolean;

    // Objects
    pointSize = 1;
    particles: THREE.Points;
    geometry = new THREE.BufferGeometry();
    material = new THREE.PointsMaterial( {
        size: this.pointSize,
        vertexColors: THREE.VertexColors
    });

    meshes: THREE.Object3D[];


    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {

        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.view.controls.enableRotate = true;
        // this.meshes = [];
        // this.selector = new THREE.Mesh(
        //     new THREE.SphereGeometry(3, 30, 30),
        //     new THREE.MeshStandardMaterial({ opacity: .2, transparent: true }));
        return this;
    }

    destroy() {
        this.enable(false);
    }

    update( config: GraphConfig, data: any) {
        debugger;
        this.config = config as HeatmapConfigModel;
        this.data = data;
        this.removeObjects();
        this.addObjects();

    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
    }
    removeObjects() {

    }
    addObjects() {
        const addNode = (tree, index, parent) => {
            const node = {i: index, children: [], data: tree[index]};
            parent.children.push(node);
            if (node.data === undefined) {

            }else {
                if (node.data.l >= 0) { addNode(tree, node.data.l, node); }
                if (node.data.r >= 0) { addNode(tree, node.data.r, node); }
            }
        };

        const root = {children: []};
        addNode(this.data.tree, 0, root);
        debugger;
        // this.material.size = 30;
        // this.geometry.addAttribute('position', new THREE.BufferAttribute(this.data.positions, 3));
        // this.geometry.addAttribute('color', new THREE.BufferAttribute(this.data.colors, 3));
        // this.geometry.computeBoundingSphere();
        // this.particles = new THREE.Points(this.geometry, this.material);
        // this.view.scene.add( this.particles );
        this.onRequestRender.next();
    }

    createLine(node) {

    }

    constructor() { }
}
