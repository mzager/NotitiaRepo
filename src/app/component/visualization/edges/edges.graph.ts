import { ChartUtil } from './../../workspace/chart/chart.utils';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { EdgeDataModel, EdgeConfigModel } from './edges.model';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum, DirtyEnum, ShapeEnum } from 'app/model/enum.model';
import { EventEmitter, Output, Injectable, ReflectiveInjector, ViewChild } from '@angular/core';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as THREE from 'three';
import * as _ from 'lodash';

export class EdgesGraph implements ChartObjectInterface {

    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements

    private data: EdgeDataModel;
    private config: EdgeConfigModel;

    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;


    public meshes: Array<THREE.Mesh>;
    public lines: Array<THREE.Line> = [];
    private drawEdgesDebounce: Function;
    private toastsManager: ToastsManager;
    public updateEdges: Boolean = false;
    private edges: Array<any>;
    private commonKeys: any;
    private patientSampleMap: {s: string, p: string};

    enable(truthy: Boolean) {
        throw new Error('Method not implemented.');
    }

    update(config: GraphConfig, data: any) {

        this.config = config as EdgeConfigModel;
        this.data = data;
        this.drawEdgesDebounce();
    }

    drawEdges(views, layout, renderer) {

        this.view.scene.children = this.view.scene.children.splice(0, 2);

        if (!this.config.isVisible) { return; }
        if (views[0].chart === null || views[1].chart === null) { return; }

        const aId = (this.config.entityA === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const bId = (this.config.entityB === EntityTypeEnum.GENE) ? 'mid' : 'sid';

        debugger;
        const aMap = views[0].chart.meshes.reduce((p, c) => {
            const screenPosition = ChartUtil.objectToScreen(c, views[0], layout);
            if (screenPosition !== null) {
                p[c.userData[aId]] = { mesh: c, screenPosition: screenPosition };
            }
            return p; }, {});

        const bMap = views[1].chart.meshes.reduce((p, c) => {
            const screenPosition = ChartUtil.objectToScreen(c, views[1], layout);
            if (screenPosition !== null) {
                p[c.userData[bId]] = { mesh: c, screenPosition: screenPosition };
            }
            return p; }, {});

        const edges = this.data.result.map( edge => {
            if (aMap.hasOwnProperty(edge.a) && bMap.hasOwnProperty(edge.b)) {
                const aPoint = aMap[edge.a];
                const bPoint = bMap[edge.b];
                if (edge.i === null) {
                    return ChartFactory.lineAllocate(edge.c, aPoint.screenPosition, bPoint.screenPosition);
                } else {
                     const yDelta = this.view.viewport.height / 7;
                     const yOffset = this.view.viewport.height * 0.5;

                    return ChartFactory.lineAllocateCurve(edge.c, aPoint.screenPosition, bPoint.screenPosition, 
                        new THREE.Vector2( 0, (edge.i * yDelta) - yOffset ) );
                }
            }
        })
        .filter( edge => edge !== undefined)
        .forEach( edge => this.view.scene.add(edge) );

        // Center Line
        this.view.scene.add(ChartFactory.lineAllocate(0x039BE5, new THREE.Vector2(0, -1000), new THREE.Vector2(0, 1000) ));

        renderer.clear();
        views.forEach((view) => {
            renderer.setViewport(view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height);
            renderer.render(view.scene, view.camera);
        });

/*
        if (this.updateEdges) {
            this.v1Map = views[0].chart.meshes.reduce((p, c) => { p[c.userData.sid] = c; return p; }, {});
            this.v2Map = views[1].chart.meshes.reduce((p, c) => { p[c.userData.sid] = c; return p; }, {});
            const v2Keys = new Set(Object.keys(this.v2Map));
            this.commonKeys = new Set(Object.keys(this.v1Map).filter(key => v2Keys.has(key)));
            this.updateEdges = false;
        }

        this.view.scene.children = this.view.scene.children.splice(0, 3);
        this.edges = [];
        const hasColor = this.data.hasOwnProperty('pointColor');
        const hasIntersect = this.data.hasOwnProperty('pointIntersect');
        let intersects = [];
        if (hasIntersect) {
            const size = (layout === WorkspaceLayoutEnum.HORIZONTAL) ?
                views[2].viewport.height : views[2].viewport.width;
            const pxDelta = size / (this.config.pointIntersect.values.length + 1);

            intersects = this.config.pointIntersect.values.map( (v, i) => {
                return {
                    label: v,
                    point: (layout === WorkspaceLayoutEnum.HORIZONTAL) ?
                        new THREE.Vector2( 0, (pxDelta * i) - (pxDelta * 0.5)) :
                        new THREE.Vector2( (pxDelta * i) - (pxDelta * 0.5), 0)
                };
            });

            intersects = intersects.reduce( (p, c) => {
                p[c.label] = c.point;
                return p;
            }, {});
        }

        this.commonKeys.forEach((v) => {
            const pt1 = ChartUtil.objectToScreen(this.v1Map[v], views[0], layout);
            if (pt1 === null) { return; }
            const pt2 = ChartUtil.objectToScreen(this.v2Map[v], views[1], layout);
            if (pt2 === null) { return; }
            let color = (hasColor) ? this.data.pointColor[this.patientSampleMap[v]] : 0x039BE5;
            if (color === undefined) { color = 0xCCCCCC; }
            let centerPoint = null;

            if (hasIntersect) {
                try {
                    const pi = this.data.pointIntersect[this.patientSampleMap[v]];
                    centerPoint = intersects[ pi ];


                    this.view.scene.add(
                        ChartFactory.lineAllocateCurve(color, pt1, pt2, centerPoint)
                    );
                    // this.view.scene.add(
                    //     ChartFactory.meshAllocate( color, ShapeEnum.CIRCLE, 3,
                    //     new THREE.Vector3(centerPoint.x, centerPoint.y, 0), 'intersect')
                    // );

                } catch ( e ) {
                    this.view.scene.add(
                        ChartFactory.lineAllocateCurve(0xDDDDDD, pt1, pt2, new THREE.Vector2(0, 0))
                    );
                    // this.view.scene.add(
                    //     ChartFactory.meshAllocate( 0xDDDDDD, ShapeEnum.CIRCLE, 3,
                    //     new THREE.Vector3(centerPoint.x, centerPoint.y, 0), 'intersect')
                    // );
                }
            }else {
                this.view.scene.add(
                    ChartFactory.lineAllocate(color, pt1, pt2)
                );
            }
        });
        renderer.clear();
        views.forEach((view) => {
            renderer.setViewport(view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height);
            renderer.render(view.scene, view.camera);
        });
*/
    }

    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {
        if (this.view.scene.children.length > 2) {
            this.view.scene.children = this.view.scene.children.splice(0, 2);
        }
        this.drawEdgesDebounce(views, layout, renderer);
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.drawEdgesDebounce = _.debounce(this.drawEdges, 600);
        return this;
    }
    destroy() {
        // throw new Error('Method not implemented.');
    }

    constructor() {
        this.data = new EdgeDataModel();
    }

}
