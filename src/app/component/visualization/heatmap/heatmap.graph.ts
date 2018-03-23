import { DataDecorator } from './../../../model/data-map.model';
import { NoneAction } from './../../../action/compute.action';
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
import { ShapeEnum, GraphEnum } from 'app/model/enum.model';
import { Vector2, Vector3 } from 'three';
import * as d3 from 'd3';

export class HeatmapGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

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
    material = new THREE.PointsMaterial({
        size: this.pointSize,
        vertexColors: THREE.VertexColors
    });

    public meshes: THREE.Object3D[];
    public decorators: DataDecorator[];
    private points: THREE.Points;
    private group: THREE.Group;


    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {

        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.view.controls.enableRotate = false;
        this.meshes = [];
        // this.selector = new THREE.Mesh(
        //     new THREE.SphereGeometry(3, 30, 30),
        //     new THREE.MeshStandardMaterial({ opacity: .2, transparent: true }));
        return this;
    }

    destroy() {
        this.removeObjects();
        this.enable(false);
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        throw new Error('Method not implemented.');
    }
    updateData(config: GraphConfig, data: any) {
        console.log('REDRAW');
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
        if (this.points !== null) {
            this.view.scene.remove(this.group);
        }
    }
    drawDendogram(result: any, horizontal: boolean): void {

        const dendrogram = new THREE.Group;
        this.group.add(dendrogram);


        if (horizontal) {
            dendrogram.rotateZ(Math.PI * 0.5);
            for (let n = 0; n < result.dendo.icoord.length; n += 1) {
                const x = result.dendo.icoord[n];
                const y = result.dendo.dcoord[n];
                dendrogram.add(ChartFactory.linesAllocate(0x029BE5, [
                    new Vector2(x[0] * .2 - 1, y[0] + 1),
                    new Vector2(x[1] * .2 - 1, y[1] + 1),
                    new Vector2(x[2] * .2 - 1, y[2] + 1),
                    new Vector2(x[3] * .2 - 1, y[3] + 1),
                ], {}));
            }
        } else {
            for (let n = 0; n < result.dendo.icoord.length; n += 1) {
                const x = result.dendo.icoord[n];
                const y = result.dendo.dcoord[n];
                dendrogram.add(ChartFactory.linesAllocate(0x029BE5, [
                    new Vector2(x[0] * .2 - 1, -y[0] - 1),
                    new Vector2(x[1] * .2 - 1, -y[1] - 1),
                    new Vector2(x[2] * .2 - 1, -y[2] - 1),
                    new Vector2(x[3] * .2 - 1, -y[3] - 1),
                ], {}));
            }
        }
    }

    addObjects() {
        this.group = new THREE.Group();
        this.view.scene.add(this.group);
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const itemsPerRow = this.data.colors.length;
        this.data.colors.forEach((row, i) => {
            row.forEach((col, j) => {
                positions.push(i * 2, j * 2, 0);
                const c = ChartFactory.getColor(col);
                colors.push(c.r, c.g, c.b);
            });
        });

        geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeBoundingSphere();
        const material = new THREE.PointsMaterial({ size: 10, vertexColors: THREE.VertexColors });
        this.points = new THREE.Points(geometry, material);
        this.group.add(this.points);

        this.drawDendogram(this.data.y, true);
        this.drawDendogram(this.data.x, false);
        this.onRequestRender.next();
    }

    createLine(node) {

    }

    constructor() {

    }
}
