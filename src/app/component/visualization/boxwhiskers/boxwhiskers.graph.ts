import { MeshLine } from 'three.meshline';
import { scaleLinear } from 'd3-scale';
import { BoxWhiskersDataModel, BoxWhiskersConfigModel } from './boxwhiskers.model';
import { GraphEnum } from 'app/model/enum.model';
import { EventEmitter } from '@angular/core';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartFactory, DataDecoatorRenderer } from './../../workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import * as THREE from 'three';
import { Vector2, MeshPhongMaterial, Vector3 } from 'three';

export class BoxWhiskersGraph extends AbstractVisualization {

    public set data(data: BoxWhiskersDataModel) { this._data = data; }
    public get data(): BoxWhiskersDataModel { return this._data as BoxWhiskersDataModel; }
    public set config(config: BoxWhiskersConfigModel) { this._config = config; }
    public get config(): BoxWhiskersConfigModel { return this._config as BoxWhiskersConfigModel; }

    public globalMeshes: Array<THREE.Object3D>;
    public lines: Array<THREE.Line>;
    public bars: Array<THREE.Mesh>;
    public entityWidth = 6;

    public renderer: DataDecoatorRenderer = (group: THREE.Group, mesh: THREE.Sprite, decorators: Array<DataDecorator>,
        i: number, count: number): void => {
        mesh.material.opacity = 1;
        // const color = mesh.material.color.getHex();
        // this.bars.forEach(bar => {
        //     bar.material = ChartFactory.getColorPhong(color);
        // });
    }

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        this.globalMeshes = [];
        this.lines = [];
        this.bars = [];
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer, 3);
    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = true;
    }


    addObjects(type: EntityTypeEnum): void {
        this.addGlobalMeshes();
        const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'markerIds' : 'sampleIds';
        const objectIds = this.data[propertyId];
        const xOffset = (this.entityWidth * this.data.result.length) * -0.5;

        const domain = Math.ceil(Math.max(Math.abs(this.data.min), Math.abs(this.data.max)));
        const scale = scaleLinear().domain([-domain, domain]).range([-600, 600]);

        const halfWidth = this.entityWidth * 0.5;

        const medianPoints = [];
        this.data.result
            .sort((a, b) => a.median - b.median)
            .forEach((node, index) => {

                const median = scale(node.median);

                const xPos = xOffset + (this.entityWidth * index);
                const group = ChartFactory.createDataGroup(
                    objectIds[index], this.config.entity, new THREE.Vector3(xPos, median, 0));
                this.meshes.push(group);
                this.view.scene.add(group);

                // Line
                const line = ChartFactory.lineAllocate(0x029BE5, new Vector2(xPos, scale(node.min)), new Vector2(xPos, scale(node.max)));
                this.lines.push(line);
                this.view.scene.add(line);

                medianPoints.push(new Vector3(xPos, median, 0));

                // line = ChartFactory.lineAllocate(0x029BE5,
                //     new Vector2(xPos - (this.entityWidth * 0.5), median),
                //     new Vector2(xPos + (this.entityWidth * 0.5), median));
                // this.lines.push(line);
                // this.view.scene.add(line);

                const q1Height = median - scale(node.quartiles[0]);
                const q2Height = scale(node.quartiles[2]) - median;

                const q1Box = ChartFactory.planeAllocate(0x029BE5, this.entityWidth, q1Height, {});
                q1Box.position.set(xPos, median - (q1Height * .5), 0);
                q1Box.material.opacity = 0.3;
                q1Box.material.transparent = true;
                this.bars.push(q1Box);
                this.view.scene.add(q1Box);

                const q2Box = ChartFactory.planeAllocate(0x029BE5, this.entityWidth, q2Height, {});
                q2Box.position.set(xPos, median + (q2Height * .5), 0);
                q2Box.material.opacity = 0.3;
                q2Box.material.transparent = true;
                this.bars.push(q2Box);
                this.view.scene.add(q2Box);
            });

        const curve = new THREE.CatmullRomCurve3(medianPoints);
        curve['type'] = 'chordal';
        const path = new THREE.CurvePath();
        path.add(curve);
        const chromosomeLine = new MeshLine();
        chromosomeLine.setGeometry(path.createPointsGeometry(this.data.result.length * 2));
        const chromosomeMesh = new THREE.Mesh(chromosomeLine.geometry,
            ChartFactory.getMeshLine(0x90caf9, 1));
        chromosomeMesh.frustumCulled = false;
        this.lines.push(chromosomeMesh);
        this.view.scene.add(chromosomeMesh);

        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer, 3);
    }

    removeObjects(): void {
        this.view.scene.remove(...this.globalMeshes);
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.lines);
        this.view.scene.remove(...this.bars);
        this.globalMeshes.length = 0;
        this.meshes.length = 0;
        this.lines.length = 0;
        this.bars.length = 0;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void { }

    addGlobalMeshes(): void {
        const width = this.entityWidth * this.data.result.length;
        const line = ChartFactory.lineAllocate(0xdddddd, new Vector2(-width * 0.5, 0), new Vector2(width * 0.5, 0));
        this.globalMeshes.push(line);
        this.view.scene.add(line);
    }
}




//     // Emitters
//     public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
//     public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
//     public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
//         new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

//     private overMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
//     private outMaterial = new THREE.LineBasicMaterial({ color: 0xDDDDDD });


//     // Chart Elements
//     private labels: HTMLElement;
//     private events: ChartEvents;
//     private view: VisualizationView;
//     private data: BoxWhiskersDataModel;
//     private config: BoxWhiskersConfigModel;
//     private isEnabled: boolean;

//     // Objects
//     public decorators: DataDecorator[];
//     public meshes: Array<THREE.Mesh>;
//     private arms: any;
//     private chromosomes: any;
//     private selector: THREE.Mesh;
//     private selectorOrigin: { x: number, y: number, yInit: number };
//     private selectorScale: any;
//     private group: THREE.Group;
//     private lineMaterial;
//     private geneLines: Array<THREE.Line>;
//     private chords: Array<THREE.Line>;

//     // Private Subscriptions
//     private sMouseMove: Subscription;
//     private sMouseDown: Subscription;
//     private sMouseUp: Subscription;

//     create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
//         this.labels = labels;
//         this.events = events;
//         this.view = view;
//         this.isEnabled = false;
//         this.meshes = [];
//         this.geneLines = [];
//         this.chords = [];
//         this.view.controls.enableRotate = true;

//         this.group = new THREE.Group();
//         this.view.scene.add(this.group);
//         this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
//         return this;
//     }

//     destroy() {
//         this.enable(false);
//         this.removeObjects();
//     }

//     // Focus On This
//     updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
//         throw new Error('Method not implemented.');
//     }
//     updateData(config: GraphConfig, data: any) {

//         // Save Config + Data Locally
//         this.config = config as BoxWhiskersConfigModel;
//         this.data = data;

//         if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
//             this.removeObjects();
//             this.addObjects();
//         }
//         if (this.config.dirtyFlag & DirtyEnum.COLOR) {

//             const lines = this.geneLines;
//             this.meshes.forEach(v => {
//                 if (data.pointColor.hasOwnProperty(v.userData.gene)) {
//                     const color = data.pointColor[v.userData.gene];
//                     (v as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: color });
//                 } else {
//                     (v as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: 0xDDDDDD });
//                 }
//             });
//             lines.forEach(v => {
//                 if (data.pointColor.hasOwnProperty(v.userData.gene)) {
//                     const color = data.pointColor[v.userData.gene];
//                     (v as THREE.Line).material = new THREE.LineBasicMaterial({ color: color });
//                 } else {
//                     (v as THREE.Line).material = new THREE.LineBasicMaterial({ color: 0xDDDDDD });
//                 }
//             });
//             this.onRequestRender.next();
//         }
//     }

//     // Ignore
//     enable(truthy: boolean) {
//         if (this.isEnabled === truthy) { return; }
//         this.isEnabled = truthy;
//         this.view.controls.enabled = this.isEnabled;
//         if (truthy) {
//             this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
//             this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
//             this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
//         } else {
//             this.sMouseUp.unsubscribe();
//             this.sMouseDown.unsubscribe();
//             this.sMouseMove.unsubscribe();
//         }
//     }
//     preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

//     }

//     // Focus On This
//     addObjects() {

//         const w = (this.view.viewport.width * 0.5) - 100;
//         const scale = scaleLinear();
//         scale.domain([this.data.min, this.data.max]);
//         scale.range([0, w]);

//         this.data.result.forEach((datum, i) => {

//             const y = i * 7;
//             const q1 = scale(datum.quartiles[0]);
//             const q2 = scale(datum.quartiles[2]);
//             const m = scale(datum.quartiles[1]);


//             // if (this.config.scatter){

//             // }else{
//             // Mesh = Geometry (shape) + Material (color)
//             // Mesh Is Like A Div + Get's added to the scene or parent "div"
//             const boxGeometry = new THREE.PlaneGeometry(q2 - q1, 5);
//             const boxMaterial = ChartFactory.getColorBasic(0x039BE5);
//             const box = new THREE.Mesh(boxGeometry, boxMaterial);
//             box.position.setX(m);
//             box.position.setY(y);


//             const circle = ChartFactory.meshAllocate(0xFF000, ShapeEnum.CIRCLE, 2, new THREE.Vector3(m, y, 0), {});
//             this.group.add(circle);

//             // Group is like a parent div - add all child objects to it
//             this.group.add(box);

//             const lineMaterialBlue = new THREE.LineBasicMaterial({ color: 0x039BE5 });
//             const lineMaterialWhite = new THREE.LineBasicMaterial({ color: 0xFFFFFF });

//             let lineGeometry;
//             let line;

//             // median
//             lineGeometry = new THREE.Geometry();
//             lineGeometry.vertices.push(
//                 new THREE.Vector3(scale(datum.median), y - 3, 1),
//                 new THREE.Vector3(scale(datum.median), y + 3, 1)
//             );
//             line = new THREE.Line(lineGeometry, lineMaterialWhite);
//             this.group.add(line);

//             // min
//             lineGeometry = new THREE.Geometry();
//             lineGeometry.vertices.push(
//                 new THREE.Vector3(scale(datum.min), y - 2, 0),
//                 new THREE.Vector3(scale(datum.min), y + 2, 0)
//             );
//             line = new THREE.Line(lineGeometry, lineMaterialBlue);
//             this.group.add(line);

//             // max
//             lineGeometry = new THREE.Geometry();
//             lineGeometry.vertices.push(
//                 new THREE.Vector3(scale(datum.max), y - 2, 0),
//                 new THREE.Vector3(scale(datum.max), y + 2, 0)
//             );
//             line = new THREE.Line(lineGeometry, lineMaterialBlue);
//             this.group.add(line);

//             // Horiz
//             lineGeometry = new THREE.Geometry();
//             lineGeometry.vertices.push(
//                 new THREE.Vector3(scale(datum.min), y, 0),
//                 new THREE.Vector3(scale(datum.max), y, 0)
//             );
//             line = new THREE.Line(lineGeometry, lineMaterialBlue);
//             this.group.add(line);

//         });
//     }

//     removeObjects() {
//         while (this.group.children.length) {
//             this.group.remove(this.group.children[0]);
//         }
//         this.meshes = [];
//     }

//     private onMouseMove(e: ChartEvent): void {

//     }

//     private onMouseUp(e: ChartEvent): void {

//     }

//     private onMouseDown(e: ChartEvent): void {

//     }

//     constructor() { }
// }
