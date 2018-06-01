import { PathwayNodeEnum } from './pathways.factory';
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
    public lblNetwork: Array<ILabel>;
    public lblNetworkOptions: LabelOptions;
    public lblGenes: Array<ILabel>;
    public lblGenesOptions: LabelOptions;
    public dataGroups: Array<THREE.Group>;

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        this.lines = [];
        this.dataGroups = [];
        this.lblGenes = [];
        this.lblNetwork = [];
        this.lblNetworkOptions = new LabelOptions(view, 'PIXEL');
        this.lblNetworkOptions.offsetY3d = -12;
        this.lblNetworkOptions.background = 'rgba(255,255,255,.8)';
        this.lblGenesOptions = new LabelOptions(view, 'PIXEL');
        this.lblGenesOptions.offsetY3d = 8;
        // this.lblGenesOptions.background = 'rgba(255,255,255,.8)';
        this.lblGenesOptions.rotate = -45;
        this.lblGenesOptions.origin = 'LEFT';
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.dataGroups, this.decorators, null, 6);
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
                    const geo = PathwaysFactory.createNode('port', 8, 8, 0, 0);
                    const sg = new THREE.ShapeGeometry(geo);
                    const mesh = new THREE.Mesh(sg, ChartFactory.getColorBasic(this.getColor('port')));
                    mesh.position.set(port.x, port.y, 0);
                    mesh.userData = {
                        tooltip: ''
                    };
                    this.meshes.push(mesh);
                    this.view.scene.add(mesh);
                });
            }
            if (node.hasOwnProperty('glyph')) {
                this.addNodes(node.glyph);
            } else {
                if (node.class === 'process') {
                    node.bbox.x += Math.floor(node.bbox.w * 0.5);
                    node.bbox.y += Math.floor(node.bbox.h * 0.5);
                }
                // if (node.class === 'process' || node.class === 'compartment') {
                //     node.bbox.w *= 1;
                //     node.bbox.h *= 1;
                //     node.bbox.x += node.bbox.w * .5;
                //     node.bbox.y += node.bbox.h * .5;
                // }
                if (node.class !== 'xcompartment') {

                    const w = Math.round(node.bbox.w);
                    const h = Math.round(node.bbox.h);
                    const x = Math.round(node.bbox.x);
                    const y = Math.round(node.bbox.y);
                    const label = (node.label) ? node.label.text : '';

                    const geo = PathwaysFactory.createNode(node.class, w, h, x, y);
                    const sg = new THREE.ShapeGeometry(geo);
                    const color = this.getColor(node.class);
                    const mat = ChartFactory.getColorBasic(color);
                    mat.opacity = .3;
                    mat.transparent = true;
                    const mesh = new THREE.Mesh(sg, mat);
                    mesh.position.set(x, y, 0);
                    this.lblNetwork.push({
                        position: new THREE.Vector3(x, y, 0),
                        userData: { tooltip: label }
                    });
                    mesh.userData = {
                        node: node,
                        tooltip: label,
                        color: color,
                        id: node.id,
                        center: new THREE.Vector3(x, y, 0
                        )
                        // Math.round(x + (w * 0.5)), Math.round(y + (h * 0.5)), 0)
                    };
                    if (node.hasOwnProperty('hgnc')) {
                        const numGenes = node.hgnc.length;
                        const offset = ((node.hgnc.length * .5) * 7);

                        node.hgnc.forEach((gene, i) => {
                            // const yOff = ((i % 2) * 7) - 3.5;
                            const pos = new THREE.Vector3(x + (i * 7) - offset, y, .2);
                            this.lblGenes.push({
                                position: pos,
                                userData: { tooltip: gene.toUpperCase() }
                            });
                            const group = ChartFactory.createDataGroup(gene.toUpperCase(), EntityTypeEnum.GENE, pos);
                            this.view.scene.add(group);
                            this.dataGroups.push(group);
                        });
                    }

                    this.meshes.push(mesh);
                    this.view.scene.add(mesh);
                }
            }
        });
        this.tooltipController.targets = this.meshes.concat(this.dataGroups);
    }

    getColor(type: string): number {
        switch (type) {
            case PathwayNodeEnum.SIMPLE_CHEMICAL:
                return ColorEnum.BLUE;
            case PathwayNodeEnum.MACROMOLECULE:
                return ColorEnum.GREEN;
            case PathwayNodeEnum.PROCESS:
                return ColorEnum.PURPLE_DARK;
            case PathwayNodeEnum.PORT:
                return ColorEnum.PURPLE;
            case PathwayNodeEnum.UNIT_OF_INFORMATION:
                return ColorEnum.BLUE_LIGHT;
            case PathwayNodeEnum.NOT:
                return ColorEnum.RED;
            case PathwayNodeEnum.AND:
                return ColorEnum.GREEN;
            case PathwayNodeEnum.OR:
                return ColorEnum.ORANGE;
            case PathwayNodeEnum.STATE_VARIABLE:
                return ColorEnum.PINK;
            default:
                return 0xDDDDDD;
        }
    }

    addEdges(edges: Array<any>): void {
        edges.forEach(edge => {
            const o = PathwaysFactory.createEdge(edge);
            this.lines.push(o);
            this.view.scene.add(o);
        });
    }

    addObjects(entity: EntityTypeEnum) {
        this.labels.innerHTML = '';
        this.lblGenes = [];
        this.lblNetwork = [];
        this.addEdges(this.data.layout.sbgn.map.arc);
        this.addNodes(this.data.layout.sbgn.map.glyph);
        ChartFactory.decorateDataGroups(this.dataGroups, this.decorators, null, 6);
        ChartFactory.configPerspectiveOrbit(this.view,
            new THREE.Box3(
                new THREE.Vector3(-1500, -1500, -5),
                new THREE.Vector3(1500, 1500, 5)));

    }

    removeObjects() {
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.dataGroups);
        this.view.scene.remove(...this.lines);
        this.lblNetwork.length = 0;
        this.meshes.length = 0;
        this.dataGroups.length = 0;
        this.lines.length = 0;

    }
    onShowLabels(): void {
        const zoom = this.view.camera.position.z;
        if (zoom < 1900) {
            this.labels.innerHTML =
                LabelController.generateHtml(this.lblNetwork, this.lblNetworkOptions) +
                LabelController.generateHtml(this.lblGenes, this.lblGenesOptions);
        } else {
            this.labels.innerHTML = '';
        }
    }
}
