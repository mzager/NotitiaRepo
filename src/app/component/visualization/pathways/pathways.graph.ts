import { DataDecorator } from './../../../model/data-map.model';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents, ChartEvent } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum, ShapeEnum, ColorEnum } from './../../../model/enum.model';
import { GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { PathwaysDataModel, PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { Subscription } from 'rxjs/Subscription';
import * as THREE from 'three';
import { PathwaysFactory } from 'app/component/visualization/pathways/pathways.factory';
import { Vector2, Object3D } from 'three';
import * as _ from 'lodash';
export class PathwaysGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Chart Elements
    private labels: HTMLElement;
    private overlay: HTMLElement;
    private tooltips: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: PathwaysDataModel;
    private config: PathwaysConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    public lines: Array<THREE.Object3D>;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.labels.innerText = '';

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild(this.tooltips);

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild(this.overlay);
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.lines = [];
        this.view.controls.enableRotate = false;
        this.view.controls.pan(-1200, -1200);
        this.view.controls.dollyOut(8);
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
        this.config = config as PathwaysConfigModel;
        this.data = data;
        this.removeObjects();
        this.addObjects();
        this.onRequestRender.next();
    }


    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
            // this.view.controls.addEventListener('start', this.onZoomStart.bind(this));
            // this.view.controls.addEventListener('end', _.debounce(this.onZoomEnd.bind(this), 300));

        } else {
            this.sMouseMove.unsubscribe();
        }
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }


    addObjects() {
        const nodes = this.data.layout.nodes.filter(v => {
            switch (v.class) {
                case 'unspecified entity':
                    v.color = ColorEnum.BLUE;
                    return true;
                case 'macromolecule':
                    v.color = ColorEnum.RED;
                    return true;
                case 'process':
                    v.color = ColorEnum.GREEN;
                    return true;
                case 'simple chemical':
                    v.color = ColorEnum.PURPLE;
                    return true;
                case 'complex multimer':
                    v.color = ColorEnum.ORANGE;
                    return true;
                case 'complex':
                    v.color = ColorEnum.PINK;
                    return true;
            }
            return false;
        });

        const shapes: Array<{ shape: THREE.Shape, color: number, label: string }> = nodes
            .map(node => {
                const w = Math.round(parseFloat(node.bbox[0].w) * 0.4);
                const h = Math.round(parseFloat(node.bbox[0].h) * 0.4);
                const x = Math.round(parseFloat(node.bbox[0].x) * 0.4);
                const y = -Math.round(parseFloat(node.bbox[0].y) * 0.4);
                if (w === 0 || h === 0) { return null; }
                const label = (node.label) ? node.label[0].text : '';
                // if (node.hasOwnProperty('glyph')) { this.processBranch(node.glyph); }
                return { shape: PathwaysFactory.createNode(node.class, w, h, x, y), color: node.color, label: label };
            }).filter(v => v);

        this.meshes = shapes.map(shape => {
            const geo = new THREE.ShapeGeometry(shape.shape);
            const material = new THREE.MeshLambertMaterial({ color: shape.color, transparent: true, opacity: 0.8 });
            const mesh = new THREE.Mesh(geo, material);
            mesh.userData = shape.label;
            return mesh;
        });

        this.meshes.forEach(mesh => {
            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        });

        // Edges
        const edges = this.data.layout.edges
            .map(edge => {
                const start = edge.start[0];
                const end = edge.end[0];

                const s = new THREE.Vector2(
                    Math.round(parseFloat(start.x) * 0.4),
                    - Math.round(parseFloat(start.y) * 0.4)
                );
                const e = new THREE.Vector2(
                    Math.round(parseFloat(end.x) * 0.4),
                    - Math.round(parseFloat(end.y) * 0.4)
                );
                const o = PathwaysFactory.createEdge(edge.class, s, e);
                this.lines.push(o);
                this.view.scene.add(o);
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

    // private onZoomStart(): void {
    //     this.overlay.innerText = '';
    // }

    // private onZoomEnd(): void {
    //     ChartUtil.getVisibleMeshes(this.view, this.meshes);

    // }

    private onMouseMove(e: ChartEvent): void {
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);

        if (hit.length > 0) {

            if (hit[0].object.userData === undefined) {
                return;
            }
            try {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                const tip = hit[0].object.userData.replace(/_/gi, ' ').trim();
                this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#DDD;padding:5px;border-radius:' +
                    '3px;z-index:9999;position:absolute;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    tip + '</div>';
            } catch (e) { }

            return;
        }
        this.tooltips.innerHTML = '';
    }

    showLabels(e: ChartEvent) {

    }

    hideLabels() {
        this.labels.innerHTML = '';
    }

    constructor() { }

}
