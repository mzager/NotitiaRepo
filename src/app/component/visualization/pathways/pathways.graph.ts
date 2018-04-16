import { ILabel, LabelOptions, LabelController } from './../../../controller/label/label.controller';
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
    public lbls: Array<ILabel>;
    public lblOptions: LabelOptions;
    public dataGroups: Array<THREE.Group>;

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        this.lines = [];
        this.dataGroups = [];
        this.lbls = [];
        this.lblOptions = new LabelOptions(view, 'PIXEL');
        this.lblOptions.offsetY3d = -8;
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.dataGroups, this.decorators);
    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = false;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void {
        super.onMouseMove(e);
    }

    addNodes(nodes: Array<any>): void {

        nodes.forEach(node => {
            if (node.hasOwnProperty('port')) {
                node.port.forEach(port => {
                    const geo = PathwaysFactory.createNode(node.class, 8, 8, port.x, port.y);
                    const sg = new THREE.ShapeGeometry(geo);
                    const mesh = new THREE.Mesh(sg, ChartFactory.getColorPhong(0xFF0000));
                    mesh.position.set(port.x, port.y, 0);
                    this.meshes.push(mesh);
                    this.view.scene.add(mesh);
                });
            }
            if (node.hasOwnProperty('glyph')) {
                this.addNodes(node.glyph);
            } else {
                if (node.class === 'process' || node.class === 'compartment') {
                    node.bbox.w *= 1;
                    node.bbox.h *= 1;
                    node.bbox.x += node.bbox.w * .5;
                    node.bbox.y += node.bbox.h * .5;
                }
                if (node.class !== 'compartment') {

                    const w = Math.round(node.bbox.w);
                    const h = Math.round(node.bbox.h);
                    const x = Math.round(node.bbox.x);
                    const y = Math.round(node.bbox.y);
                    const label = (node.label) ? node.label.text : '';
                    const geo = PathwaysFactory.createNode(node.class, w, h, x, y);
                    const sg = new THREE.ShapeGeometry(geo);
                    const color = this.getColor(node.class);
                    const mesh = new THREE.Mesh(sg, ChartFactory.getColorPhong(color));
                    mesh.position.set(x, y, 0);
                    this.lbls.push({
                        position: new THREE.Vector3(x, y, 0),
                        userData: { tooltip: label }
                    })
                    mesh.userData = {
                        node: node,
                        tooltip: label,
                        color: color,
                        id: node.id,
                        center: new THREE.Vector3(x, y, 0)//Math.round(x + (w * 0.5)), Math.round(y + (h * 0.5)), 0)
                    };

                    if (node.hasOwnProperty('hgnc')) {
                        const numGenes = node.hgnc.length;
                        const offset = ((node.hgnc.length * .5) * 5);
                        node.hgnc.forEach((gene, i) => {
                            const group = ChartFactory.createDataGroup(gene.toUpperCase(), EntityTypeEnum.GENE, new THREE.Vector3(x + (i * 5) - offset, y, .2))
                            this.view.scene.add(group);
                            this.dataGroups.push(group);
                        });
                    }

                    this.meshes.push(mesh);
                    this.view.scene.add(mesh);
                }
            }
        });
        ChartFactory.decorateDataGroups(this.dataGroups, this.decorators);
        this.tooltipController.targets = this.meshes;
    }

    getColor(type: string): number {
        const color = (type === 'unspecified entity') ? ColorEnum.BLUE :
            (type === 'macromolecule') ? ColorEnum.RED :
                (type === 'process') ? ColorEnum.GREEN :
                    (type === 'simple chemical') ? ColorEnum.PURPLE :
                        (type === 'complex multimer') ? ColorEnum.ORANGE :
                            (type === 'complex') ? ColorEnum.PINK :
                                (type === 'compartment') ? 0xEEEEEE :
                                    (type === 'state variable') ? ColorEnum.INDIGO :
                                        0x000000;
        return color;
    }

    addEdges(edges: Array<any>): void {
        edges.forEach(edge => {
            const o = PathwaysFactory.createEdge(edge);
            this.lines.push(o);
            this.view.scene.add(o);
        });
    }

    addObjects(entity: EntityTypeEnum) {
        this.addEdges(this.data.layout.sbgn.map.arc);
        this.addNodes(this.data.layout.sbgn.map.glyph);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    removeObjects() {
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.dataGroups)
        this.view.scene.remove(...this.lines);
        this.meshes.length = 0;
        this.dataGroups.length = 0;
        this.lines.length = 0;

    }
    onShowLabels(): void {
        const zoom = this.view.camera.position.z;
        if (zoom < 500) {
            this.labels.innerHTML = LabelController.generateHtml(this.lbls, this.lblOptions);
        }
        else {
            this.labels.innerHTML = '';
        }
    }
}
