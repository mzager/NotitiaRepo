import { ChartUtil } from './../../workspace/chart/chart.utils';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { EdgeDataModel, EdgeConfigModel } from './edges.model';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { EventEmitter, Output, Injectable, ReflectiveInjector } from '@angular/core';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as THREE from 'three';
import * as _ from 'lodash';


export class EdgesGraph implements ChartObjectInterface {

    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: EdgeDataModel;
    private config: EdgeConfigModel;
    public meshes: Array<THREE.Mesh>;
    public lines: Array<THREE.Line> = [];
    private drawEdgesDebounce: Function;
    private toastsManager: ToastsManager;


    enable(truthy: Boolean) {
        throw new Error('Method not implemented.');
    }

    update(config: GraphConfig, data: any) {
        debugger;
        this.config = config as EdgeConfigModel;
        this.data = data;
    }

    drawEdges(views, layout, renderer) {

        if (views[0].chart === null || views[1].chart === null) { return; }

        const markers = this.data.markers;
        const samples = this.data.samples;

            const chart1Meshes = views[0].chart.meshes
                .filter(v => samples.hasOwnProperty(v.userData.id))
                .reduce((p, c) => {
                    p[c.userData.id] = ChartUtil.objectToScreen(c as THREE.Object3D, views[0], layout);
                    return p;
                }, {});

            const chart2Meshes = views[1].chart.meshes
                .filter(v => markers.hasOwnProperty(v.userData.id))
                .reduce((p, c) => {
                    p[c.userData.id] = ChartUtil.objectToScreen(c as THREE.Object3D, views[1], layout);
                    return p;
                }, {});

            const edges = this.data.edges.map(v => Object.assign({}, v,
                { sPos: chart1Meshes[v.sample.toString()], mPos: chart2Meshes[v.marker.toString()] }))
                .filter( v => {
                    return (v.sPos !== null) && (v.mPos !== null);
                });


            this.view.scene.children = this.view.scene.children.splice(0, 2);
            edges.forEach(v => {
                const line: THREE.Line = ChartFactory.lineAllocate(v.color, v.mPos, v.sPos);
                line.userData = v;
                this.view.scene.add(line);
            });
            // Look At this again..
            renderer.clear();
            views.forEach( (view, i) => {
                renderer.setViewport( view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height );
                renderer.render( view.scene, view.camera );
            });
    }

    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {
        if (this.view.scene.children.length > 5) {
            this.view.scene.children = this.view.scene.children.splice(0, 5);
        }
        this.drawEdgesDebounce(views, layout, renderer);
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.drawEdgesDebounce = _.debounce(this.drawEdges, 500);
        return this;
    }
    destroy() {
        // throw new Error('Method not implemented.');
    }

    constructor() {
    }

}
