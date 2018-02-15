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
import { Memoize } from 'typescript-memoize';
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

    meshes: THREE.Object3D[];
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
        this.enable(false);
    }

    update(config: GraphConfig, data: any) {
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
            // this.group.remove(this.points);
        }
    }
    drawDendogram(result: any, horizontal: boolean, posMap: any): void {
        const dendrogram = new THREE.Group;
        this.group.add(dendrogram);

        const N = result.n_leaves;
        const root = d3.stratify().id((d, i, data) => (i + N).toString())
            .parentId((d, i, data) => {
                const parIndex = result.children.findIndex(e => e.includes(i + N));
                return (parIndex < 0) ? undefined : (parIndex + N).toString();
            })(result.children)
            .sort((a, b) => (a.height - b.height) || a.id.localeCompare(b.id));

        let height = 100;
        // const treemap = d3.tree().size([(result.n_leaves - 1) * 2, height]);

        const treemap = d3.cluster().size([(result.n_leaves - 1) * 2, height]);


        const nodes = treemap(d3.hierarchy(root, d => {
            return d.children;
        }));

        height += 4;

        // nodes.leaves().forEach(node => {
        //     // dendrogram.add(ChartFactory.meshAllocate(0x000000, ShapeEnum.SQUARE, .4,
        //     //     new Vector3(node.x, node.y - height), {}));

        //     // dendrogram.add( ChartFactory.lineAllocate(0x000000,
        //     //     new Vector2(node.x, node.y - height),
        //     //     new Vector2(posMap[node.data['data'][0]] * 2, 0),
        //     // {}));
        //     // // dendrogram.add( ChartFactory.lineAllocate(0x000000,
        //     // //     new Vector2(node.x, node.y - height),
        //     // //     new Vector2(posMap[node.data['data'][1]] * 2, 0),
        //     // {}));
        // });
        nodes.descendants().slice(1).forEach(node => {
            dendrogram.add(ChartFactory.meshAllocate(0xFF000, ShapeEnum.SQUARE, .2,
                new Vector3(node.x, node.y - height), {}));
            dendrogram.add(ChartFactory.lineAllocate(
                0x029BE5,
                new Vector2(node.x, node.y - height),
                new Vector2(node.x, node.parent.y - height)
            ));
            dendrogram.add(ChartFactory.lineAllocate(
                0x029BE5,
                new Vector2(node.x, node.parent.y - height),
                new Vector2(node.parent.x, node.parent.y - height)
            ));

        });
        debugger;



        // const hier = d3.hierarchy(root);


        // let height = 100;
        // const dimension = [(result.n_leaves - 1) * 2, height];
        // const clust = d3.cluster().size([(result.n_leaves - 1) * 2, height]);

        // if (horizontal) {
        //     dendrogram.rotateZ(-1.5708);
        //     dendrogram.position.y += ((result.n_leaves - 1) * 2);
        // }
        // height += 5;

        // clust(root);
        //         debugger;
        //         root.descendants().forEach(node => {

        //             // Root
        //             if (!node.parent) {
        //                 dendrogram.add(ChartFactory.meshAllocate(0x000000, ShapeEnum.SQUARE, .4,
        //                     new Vector3(node['x'], node['y'] - height ), {}));

        //             } else {
        //                 dendrogram.add(ChartFactory.meshAllocate(0xFF0000, ShapeEnum.SQUARE, .2,
        //                     new Vector3(node['x'], node['y'] - height ), {}));

        //                 dendrogram.add(ChartFactory.lineAllocate(
        //                     0x029BE5,
        //                     new Vector2(node['x'], node['y'] - height),
        //                     new Vector2(node['x'], node.parent['y'] - height)
        //                 ));

        //                 dendrogram.add(ChartFactory.lineAllocate(
        //                     0x029BE5,
        //                     new Vector2(node['x'], node.parent['y'] - height),
        //                     new Vector2(node.parent['x'], node.parent['y'] - height)
        //                 ));
        //             }
        //             // if (node.children === undefined) {
        //             //     dendrogram.add(ChartFactory.meshAllocate(0x00FF00, ShapeEnum.SQUARE, .2,
        //             //         new Vector3(node['x'], node['y'] - height ), {}));

        //             //     debugger;
        //             //     // new Vector2(node['x'], node['y'] - height),
        //             //     // new Vector2(node['x'], node.parent['y'] - height)
        //             // }
        // //             if (node.children === undefined) {

        // //                 // dendrogram.add(ChartFactory.meshAllocate(0xFF00FF, ShapeEnum.SQUARE, .2,
        // //                 //     new Vector3(posMap[node.data[0]] * 2, node['y'] - height ), {}));

        // // //                 // Side
        // // //                 dendrogram.add(ChartFactory.lineAllocate(
        // // //                     0x029BE5,
        // // //                     new Vector2(posMap[node.data[0]] * 2, 0),
        // // //                     new Vector2(posMap[node.data[0]] * 2, node['y'] - height)
        // // //                 ));
        // // // debugger;
        // // //                 dendrogram.add(ChartFactory.lineAllocate(
        // // //                     0x029BE5,
        // // //                     new Vector2(posMap[node.data[1]] * 2, 0),
        // // //                     new Vector2(posMap[node.data[1]] * 2, node['y'] - height)
        // // //                 ));
        // //                 // dendrogram.add(ChartFactory.lineAllocate(
        // //                 //     0xFF0000,
        // //                 //     new Vector2(posMap[node.data[0]] * 2, node['y'] - height),
        // //                 //     new Vector2(posMap[node.data[1]] * 2, node['y'] - height)
        // //                 // ));

        // //                 // // Top
        // //                 // dendrogram.add(ChartFactory.lineAllocate(
        // //                 //     0x029BE5,
        // //                 //     new Vector2(posMap[node.data[0]] * 2, node['y'] - height),
        // //                 //     new Vector2(posMap[node.data[0]] * 2 + 2, node['y'] - height),
        // //                 // ));

        // //                 // Side
        // //                 // dendrogram.add(ChartFactory.lineAllocate(
        // //                 //     0x029BE5,
        // //                 //     new Vector2(posMap[node.data[1]] * 2, node['y'] - height),
        // //                 //     new Vector2(posMap[node.data[1]] * 2, 0)
        // //                 // ));

        // //                 // Top
        // //                 // dendrogram.add(ChartFactory.lineAllocate(
        // //                 //     0x029BE5,
        // //                 //     new Vector2(node['x'], node['y'] - height)
        // //                 //     new Vector2(posMap[node.data[0]] * 2, node['y'] - height)

        // //                     // new Vector2(posMap[node.data[1]] * 2, node['y'] - height)
        // //                 // ));
        // //         } else if (node.children.length === 1) {
        // //                 // const pos = (node.data[0].toString() === node.children[0].id) ? node.data[1] : node.data[0];

        // //                 // // // Side
        // //                 // debugger;
        // //                 // dendrogram.add(ChartFactory.lineAllocate(
        // //                 //     0x029BE5,
        // //                 //     new Vector2(posMap[pos] * 2, node['y'] - height),
        // //                 //     new Vector2(posMap[pos] * 2, 0)
        // //                 // ));

        // //                 // Top
        // //                 // dendrogram.add(ChartFactory.lineAllocate(
        // //                 //     0x029BE5,
        // //                 //     new Vector2(posMap[pos] * 2, node['y'] - height * 2),
        // //                 //     new Vector2(node['x'], node['y'] - height * 2)
        // //                 // ));
        // //             }
        //         });
    }

    addObjects() {
        this.group = new THREE.Group();
        this.view.scene.add(this.group);
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const itemsPerRow = this.data.colors.length;
        const posMapX = this.data.x.result.reduce((p, c, i) => { p[c] = i; return p; }, {});
        const posMapY = this.data.y.result.reduce((p, c, i) => { p[c] = i; return p; }, {});
        this.data.colors.forEach((row, i) => {
            row.forEach((col, j) => {
                positions.push((posMapX[i]) * 2, (posMapY[j]) * 2, 0);
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

        // this.drawDendogram(this.data.y, false, posMapY);
        this.drawDendogram(this.data.x, false, posMapY);




        this.onRequestRender.next();
    }

    createLine(node) {

    }

    constructor() {

    }
}
