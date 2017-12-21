import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents, ChartEvent } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum, ShapeEnum } from './../../../model/enum.model';
import { GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { PathwaysDataModel, PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { Subscription } from 'rxjs/Subscription';
import * as THREE from 'three';
import { PathwaysFactory } from 'app/component/visualization/pathways/pathways.factory';
import { Vector2 } from 'three';

export class PathwaysGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: PathwaysDataModel;
    private config: PathwaysConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    public lines: Array<THREE.Line>;

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
        this.view.controls.enableRotate = false;
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    update(config: GraphConfig, data: any) {
        this.config = config as PathwaysConfigModel;
        this.data = data;

        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }

        this.onRequestRender.next();
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

    processBranch( glyph ) {
        const node = glyph[0];
        const w = Math.round(parseFloat(node.bbox[0].w) * 0.4);
        const h = Math.round(parseFloat(node.bbox[0].h) * 0.4);
        const x = Math.round(parseFloat(node.bbox[0].x) * 0.4);
        const y = Math.round(parseFloat(node.bbox[0].y) * 0.4);
        if (w > 0 && h > 0) {
            if (node.hasOwnProperty('glyph')) { this.processBranch(node.glyph); }
            // const shape =  PathwaysFactory.createNode(node.class, w, h, x, y + h);
            // const geo = new THREE.ShapeGeometry(shape);
            // const material = new THREE.MeshLambertMaterial({color: 0x039BE5, transparent: true, opacity: 0.2});
            // const mesh = new THREE.Mesh(geo, material);
            // this.view.scene.add(mesh);
        }
    }

    addObjects() {

        console.dir(this.data.layout);
        const edges = this.data.layout.edges
            .map( edge => {
                const start = edge.start[0];
                const end = edge.end[0];
                const s = new THREE.Vector2(
                    Math.round(parseFloat(start.x) * 0.4),
                    Math.round(parseFloat(start.y) * 0.4)
                );
                const e = new THREE.Vector2(
                    Math.round(parseFloat(end.x) * 0.4),
                    Math.round(parseFloat(end.y) * 0.4)
                );
                const line = ChartFactory.lineAllocate(0x039BE5, s, e, {});
                this.lines.push(line);
                this.view.scene.add(line);
            });

        const shapes: Array<THREE.Shape> = this.data.layout.nodes
            .map( node => {
                const w = Math.round(parseFloat(node.bbox[0].w) * 0.4);
                const h = Math.round(parseFloat(node.bbox[0].h) * 0.4);
                const x = Math.round(parseFloat(node.bbox[0].x) * 0.4);
                const y = Math.round(parseFloat(node.bbox[0].y) * 0.4);
                if (w === 0 || h === 0) { return null; }
                if (node.hasOwnProperty('glyph')) { this.processBranch(node.glyph); }
                return PathwaysFactory.createNode(node.class, w, h, x, y + h);
            }).filter( v => v);

        this.meshes = shapes.map(shape => {
            const geo = new THREE.ShapeGeometry(shape);
            const material = new THREE.MeshLambertMaterial({color: 0x039BE5, transparent: true, opacity: 0.1});
            return new THREE.Mesh(geo, material);
        });

        this.meshes.forEach(mesh => {
            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        });

    }

    removeObjects() {
        this.enable(false);
        this.lines.forEach(line => {
            this.view.scene.remove(line);
        });
        this.meshes.forEach(mesh => {
            this.view.scene.remove(mesh);
        });
    }



    private onMouseMove(e: ChartEvent): void {
        //  this.showLabels(e);
    }

    showLabels(e: ChartEvent) {

    }

    hideLabels() {
        this.labels.innerHTML = '';
    }

    constructor() { }

}
