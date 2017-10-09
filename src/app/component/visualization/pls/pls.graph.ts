import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { EventEmitter } from '@angular/core';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { PlsConfigModel, PlsDataModel } from './pls.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as _ from 'lodash';
import * as THREE from 'three';
import { Memoize } from 'typescript-memoize';
import { ShapeEnum, GraphEnum } from 'app/model/enum.model';

export class PlsGraph implements ChartObjectInterface {

    public onSelect: EventEmitter<{type: EntityTypeEnum, ids: Array<string>}> =
        new EventEmitter<{type: EntityTypeEnum, ids: Array<string>}>();
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();


    // Private Members
    public meshes: Array<THREE.Mesh>;
    private container: THREE.Object3D;
    private layout: any;
    private sizes: Array<any>;
    private shapes: Array<any>;
    private colors: Array<any>;
    private config: PlsConfigModel;

    create(label: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        return this;
    }
    update(config: GraphConfig, data: any) {
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    enable(truthy: Boolean) {
    }

    // Interface
    setContainer(container: THREE.Object3D) {
        this.container = container;
        this.meshes = [];
    }
    setConfig(config: PlsConfigModel): void {
        this.config = config;
    }
    setData(data: PlsDataModel): void {
        // this.layout = data.eigenvectorsScaled;
        this.sizes = data.pointSize;
        this.shapes = data.pointShape;
        this.colors = data.pointColor;
        this.draw();
    }
    activate(events: ChartEvents, controls: OrbitControls): void {
    }
    deactivate(events: ChartEvents, controls: OrbitControls): void {
    }
    prerender() {

    }
    destroy() {
        this.meshes.forEach(v => this.container.remove(v) );
        this.meshes.length = 0;
    }

    // @Memoize()
    private colorFactory(color): THREE.Material {
        const rv =  new THREE.MeshPhongMaterial( {color: color, specular: color, shininess: 100} );
        return rv;
    }
    private shapeFactory(shape): THREE.Geometry {
        switch (shape) {
            case ShapeEnum.CIRCLE:
                return new THREE.SphereGeometry(3);
            case ShapeEnum.SQUARE:
                return new THREE.CubeGeometry(3, 3, 3);
            case ShapeEnum.TRIANGLE:
                return new THREE.TetrahedronGeometry(3);
            case ShapeEnum.CONE:
                return new THREE.ConeGeometry(3, 3);
        }
    }
    draw() {
        if (this.layout === null) { return; }

        this.destroy();

        const layoutLength = this.layout.length;
        const sizeLength = this.sizes.length;
        const shapeLength = this.shapes.length;
        const colorLength = this.colors.length;

        for (let i = 0; i < layoutLength; i++) {
            const position = this.layout[i];
            const size = (i < sizeLength) ? this.sizes[i] : 1;
            const shape = (i < shapeLength) ? this.shapeFactory(this.shapes[i]) : this.shapeFactory(ShapeEnum.SQUARE);
            const color = (i < colorLength) ? this.colorFactory(this.colors[i]) : this.colorFactory(0xDD2C00);
            const point = new THREE.Mesh(shape, color);
            point.position.x = position[0] - 250;
            point.position.y = position[1] - 250;
            point.position.z = position[2] - 250;
            point.scale.set(size, size, size);
            this.meshes.push(point);
            this.container.add(point);
        }
    }

    // Lifecycle Methods
    constructor() {}
    // constructor() {
    //     this.sizes = [];
    //     this.shapes = [];
    //     this.colors = [];
    //     this.intersect = new BehaviorSubject<Array<any>>([]);
    // }
}
