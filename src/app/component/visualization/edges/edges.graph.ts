import { EventEmitter } from '@angular/core';
import { GraphEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import * as _ from 'lodash';
import * as THREE from 'three';
import { LabelController } from './../../../controller/label/label.controller';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { EdgeConfigModel, EdgeDataModel } from './edges.model';

export class EdgesGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Chart Elements
    private data: EdgeDataModel;
    private config: EdgeConfigModel;
    private view: VisualizationView;

    public meshes: Array<THREE.Mesh>;
    public decorators: DataDecorator[] = [];
    public lines: Array<THREE.Line> = [];
    private drawEdgesDebounce: Function;
    public updateEdges: Boolean = false;

    enable(truthy: Boolean) {
        // throw new Error('Method not implemented.');
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        this.decorators = decorators;
        this.drawEdgesDebounce();
    }
    updateData(config: GraphConfig, data: any) {
        this.config = config as EdgeConfigModel;
        this.data = data;
        this.drawEdgesDebounce();
    }

    drawEdges(views: Array<VisualizationView>, layout, renderer) {

        if (layout === WorkspaceLayoutEnum.SINGLE) {
            this.decorators = [];
            return;
        }
        if (this.data.result.length === 0) {
            return;
        }
        this.view.scene.children = this.view.scene.children.splice(0, 2);
        if (views[0].chart === null || views[1].chart === null) { return; }
        const visibleObjectsA = LabelController.filterObjectsInFrustum(views[0].chart.meshes, views[0]);
        const visibleObjectsB = LabelController.filterObjectsInFrustum(views[1].chart.meshes, views[1]);
        const obj2dMapA = LabelController.createMap2D(visibleObjectsA, views[0]);
        const obj2dMapB = LabelController.createMap2D(visibleObjectsB, views[1]);

        const ea = (this.config.entityA === 'Samples') ? 'sid' : (this.config.entityA === 'Patients') ? 'pid' : 'mid';
        const eb = (this.config.entityB === 'Samples') ? 'sid' : (this.config.entityB === 'Patients') ? 'pid' : 'mid';

        const colorDecorator = this.decorators.find(d => d.type === DataDecoratorTypeEnum.COLOR);
        const hasColorDecorator = (colorDecorator !== undefined);
        const colorMap = (hasColorDecorator) ? colorDecorator.values.reduce((p, c) => {
            p[c.pid] = c;
            p[c.sid] = c;
            return p;
        }, {}) : {};

        const groupDecorator = this.decorators.find(d => d.type === DataDecoratorTypeEnum.GROUP);
        const hasGroupDecorator = (groupDecorator !== undefined);
        const groupMap = (hasGroupDecorator) ? groupDecorator.values.reduce((p, c) => {
            c.value = parseInt(c.value, 10);
            p[c.pid] = c;
            p[c.sid] = c;
            return p;
        }, {}) : {};

        let groupY = [];
        if (hasGroupDecorator) {
            const vph = this.view.viewport.height;
            const vphHalf = this.view.viewport.height * 0.5;
            const binCount = Math.max(...groupDecorator.values.map(v => v.value));
            const binHeight = vph / (binCount + 1);
            groupY = Array.from({ length: binCount }, (v, k) => k + 1).map(v => (v * binHeight) - vphHalf - (binHeight * .5));
        }

        this.data.result.map(v => {
            if (!obj2dMapA.hasOwnProperty(v.a) || !obj2dMapB.hasOwnProperty(v.b)) {
                return null;
            }
            const color = (!hasColorDecorator) ? 0x81D4FA :
                colorMap.hasOwnProperty(v.a) ? colorMap[v.a].value :
                    colorMap.hasOwnProperty(v.b) ? colorMap[v.b].value :
                        0xeeeeee;

            const yPos = (!hasGroupDecorator) ? 0 :
                groupMap.hasOwnProperty(v.a) ? groupY[groupMap[v.a].value] :
                    groupMap.hasOwnProperty(v.b) ? groupY[groupMap[v.b].value] :
                        0;

            let line;
            if (hasGroupDecorator) {
                return ChartFactory.lineAllocateCurve(color, obj2dMapA[v.a], obj2dMapB[v.b],
                    new THREE.Vector2(0, yPos));
            } else {
                line = ChartFactory.lineAllocate(color, obj2dMapA[v.a], obj2dMapB[v.b]);
            }


            line.userData = v;
            return line;
        }).filter(v => v !== null).forEach(edge => this.view.scene.add(edge));


        // let edges = [];
        // const visibleEdges = this.data.result.filter(edge => (aMap.hasOwnProperty(edge.a) && bMap.hasOwnProperty(edge.b)));
        // if (visibleEdges.length < 10000) {
        // edges = visibleEdges.map(edge => {
        //     const aPoint = aMap[edge.a];
        //     const bPoint = bMap[edge.b];
        //     if (edge.i === null) {
        //         return ChartFactory.lineAllocate(edge.c, aPoint.screenPosition, bPoint.screenPosition);
        //     } else {
        //         const yDelta = this.view.viewport.height / 7;
        //         const yOffset = this.view.viewport.height * 0.5;

        //         return ChartFactory.lineAllocateCurve(edge.c, aPoint.screenPosition, bPoint.screenPosition,
        //             new THREE.Vector2(0, (edge.i * yDelta) - yOffset));
        //     }
        // }).forEach(edge => this.view.scene.add(edge));
        // console.log('good number');
        // } else {
        //     console.log('too many edges');
        // }
        // const edges = this.data.result.map( edge => {
        //     if (aMap.hasOwnProperty(edge.a) && bMap.hasOwnProperty(edge.b)) {
        //         const aPoint = aMap[edge.a];
        //         const bPoint = bMap[edge.b];
        //         if (edge.i === null) {
        //             return ChartFactory.lineAllocate(edge.c, aPoint.screenPosition, bPoint.screenPosition);
        //         } else {
        //              const yDelta = this.view.viewport.height / 7;
        //              const yOffset = this.view.viewport.height * 0.5;
        //             return ChartFactory.lineAllocateCurve(edge.c, aPoint.screenPosition, bPoint.screenPosition,
        //                 new THREE.Vector2( 0, (edge.i * yDelta) - yOffset ) );
        //         }
        //     }
        // })
        // .filter( edge => edge !== undefined)
        // .forEach( edge => this.view.scene.add(edge) );

        // Center Line
        this.view.scene.add(ChartFactory.lineAllocate(0x039BE5, new THREE.Vector2(0, -1000), new THREE.Vector2(0, 1000)));

        renderer.clear();
        views.forEach((view) => {
            renderer.setViewport(view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height);
            renderer.render(view.scene, view.camera);
        });
    }

    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {
        if (this.view.scene.children.length > 2) {
            this.view.scene.children = this.view.scene.children.splice(0, 2);
        }
        this.drawEdgesDebounce(views, layout, renderer);
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        // this.labels = labels;
        // this.events = events;
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
