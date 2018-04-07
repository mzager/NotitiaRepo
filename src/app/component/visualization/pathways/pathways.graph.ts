import { PathwaysFactory } from 'app/component/visualization/pathways/pathways.factory';
import { PathwaysDataModel, PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { GraphEnum, ColorEnum } from 'app/model/enum.model';
import { EventEmitter } from '@angular/core';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import * as THREE from 'three';
export class PathwaysGraph extends AbstractVisualization {

    public set data(data: PathwaysDataModel) { this._data = data; }
    public get data(): PathwaysDataModel { return this._data as PathwaysDataModel; }
    public set config(config: PathwaysConfigModel) { this._config = config; }
    public get config(): PathwaysConfigModel { return this._config as PathwaysConfigModel; }



    public lines: Array<THREE.Object3D>;


    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        this.lines = [];
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
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

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void { }

    addNodes(nodes: Array<any>): void {
        nodes.forEach(node => {
            if (node.hasOwnProperty('glyph')) {
                this.addNodes(node.glyph);
            } else {
                const w = Math.round(parseFloat(node.bbox[0].w) * 0.4);
                const h = Math.round(parseFloat(node.bbox[0].h) * 0.4);
                const x = Math.round(parseFloat(node.bbox[0].x) * 0.4);
                const y = -Math.round(parseFloat(node.bbox[0].y) * 0.4);
                const label = (node.label) ? node.label[0].text : '';
                const geo = PathwaysFactory.createNode(node.class, w, h, x, y);
                const sg = new THREE.ShapeGeometry(geo);
                const mesh = new THREE.Mesh(sg, this.getColor(node.class));;
                mesh.userData = {
                    label: label,
                    id: node.id,
                    center: new THREE.Vector3(x, y, 0)//Math.round(x + (w * 0.5)), Math.round(y + (h * 0.5)), 0)
                };
                this.meshes.push(mesh);
                this.view.scene.add(mesh);
            }
        })
    }

    getColor(type: string): THREE.Material {
        const color = (type === 'unspecified entity') ? ColorEnum.BLUE :
            (type === 'macromolecule') ? ColorEnum.RED :
                (type === 'process') ? ColorEnum.GREEN :
                    (type === 'simple chemical') ? ColorEnum.PURPLE :
                        (type === 'complex multimer') ? ColorEnum.ORANGE :
                            (type === 'complex') ? ColorEnum.PINK :
                                (type === 'compartment') ? 0xEEEEEE :
                                    (type === 'state variable') ? ColorEnum.INDIGO :
                                        0x000000;

        const mat = ChartFactory.getColorPhong(color);
        mat.transparent = true;
        mat.opacity = 0.3;
        return mat;
    }

    addEdges(edges: Array<any>): void {
        // edges
        //     .forEach(edge => {
        //         const source = this.meshes.find(mesh => mesh.userData.id.indexOf(edge.source)).userData.center;
        //         const target = this.meshes.find(mesh => mesh.userData.id.indexOf(edge.source)).userData.center;

        //         // const start = edge.start[0];
        //         // const end = edge.end[0];

        //         // const s = new THREE.Vector2(
        //         //     Math.round(parseFloat(start.x) * 0.4),
        //         //     - Math.round(parseFloat(start.y) * 0.4)
        //         // );
        //         // const e = new THREE.Vector2(
        //         //     Math.round(parseFloat(end.x) * 0.4),
        //         //     - Math.round(parseFloat(end.y) * 0.4)
        //         // );
        //         const o = PathwaysFactory.createEdge(edge.class, source, target);
        //         this.lines.push(o);
        //         this.view.scene.add(o);
        //     });

        // const l = this.lines;
        // debugger;
    }


    addObjects(entity: EntityTypeEnum) {

        this.addNodes(this.data.layout.nodes);
        this.addEdges(this.data.layout.edges);

        // const nodes = this.data.layout.nodes.filter(v => {
        //     switch (v.class) {
        //         case 'unspecified entity':
        //             v.color = ColorEnum.BLUE;
        //             return true;
        //         case 'macromolecule':
        //             v.color = ColorEnum.RED;
        //             return true;
        //         case 'process':
        //             v.color = ColorEnum.GREEN;
        //             return true;
        //         case 'simple chemical':
        //             v.color = ColorEnum.PURPLE;
        //             return true;
        //         case 'complex multimer':
        //             v.color = ColorEnum.ORANGE;
        //             return true;
        //         case 'complex':
        //             v.color = ColorEnum.PINK;
        //             return true;
        //     }
        //     return false;
        // });

        // debugger;
        // const shapes: Array<{ shape: THREE.Shape, color: number, label: string }> = nodes
        //     .map(node => {
        // const w = Math.round(parseFloat(node.bbox[0].w) * 0.4);
        // const h = Math.round(parseFloat(node.bbox[0].h) * 0.4);
        // const x = Math.round(parseFloat(node.bbox[0].x) * 0.4);
        // const y = -Math.round(parseFloat(node.bbox[0].y) * 0.4);
        //         if (w === 0 || h === 0) { return null; }
        //         const label = (node.label) ? node.label[0].text : '';
        //         // if (node.hasOwnProperty('glyph')) { this.processBranch(node.glyph); }
        //         return { shape: PathwaysFactory.createNode(node.class, w, h, x, y), color: node.color, label: label };
        //     }).filter(v => v);

        // this.meshes = shapes.map(shape => {
        //     const geo = new THREE.ShapeGeometry(shape.shape);
        //     const material = new THREE.MeshLambertMaterial({ color: shape.color, transparent: true, opacity: 0.8 });
        //     const mesh = new THREE.Mesh(geo, material);
        //     mesh.userData = shape.label;
        //     return mesh;
        // });

        // this.meshes.forEach(mesh => {
        //     this.meshes.push(mesh);
        //     this.view.scene.add(mesh);
        // });

        // // Edges

        // ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    removeObjects() {
        this.view.scene.remove(...this.meshes);
        this.meshes.length = 0;
        this.lines.forEach(line => {
            this.view.scene.remove(line);
        });
    }
}
