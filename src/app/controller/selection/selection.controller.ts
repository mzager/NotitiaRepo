
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartEvents, ChartEvent } from './../../component/workspace/chart/chart.events';
import { VisualizationView } from './../../model/chart-view.model';
import { AbstractMouseController } from './../abstract.mouse.controller';
import { Vector3, SphereGeometry, MeshPhongMaterial, Mesh, Object3D, Vector2 } from 'three';
import { EventEmitter } from '@angular/core';
import { GraphEnum } from '../../model/enum.model';
import { scaleLinear } from 'd3-scale';
export class SelectionOptions {

}

export class SelectionController extends AbstractMouseController {

    protected _config: GraphConfig;
    protected _options: SelectionOptions;
    protected _onRequestRender: EventEmitter<GraphEnum>;
    // protected selectionMesh: Mesh;
    // protected selectionOrigin2D: Vector2;
    // protected selectionScale: any;

    public teardown(): void {
        this._config = null;
        this._onRequestRender = null;
    }
    public setup(config: GraphConfig, onRequestRender: EventEmitter<GraphEnum>, targets: Array<Object3D>): void {
        this._config = config;
        this._onRequestRender = onRequestRender;
        this.targets = targets;
    }
    public get options(): SelectionOptions { return this._options; }
    public set options(value: SelectionOptions) {
        this._options = value;
    }

    public destroy(): void {

    }
    constructor(view: VisualizationView, events: ChartEvents, debounce: number = 10) {
        super(view, events, debounce);
        this._options = {};
    }


    public onMouseUp(e: ChartEvent): void {
        this._view.scene.remove(this.data.selectionMesh);
        this._onRequestRender.emit(this._config.graph);
        this.data.selectionMesh = null;
    }
    public onMouseDown(e: ChartEvent): void {
        const intersects = this.getIntersects(this._view, e.mouse, this._targets);
        if (intersects.length > 0) {
            const event: MouseEvent = e.event as MouseEvent;
            const target: Vector3 = intersects[0].object.parent.position.clone();
            const geometry = new SphereGeometry(3, 30, 30);
            const material = new MeshPhongMaterial({ color: 0x029BE5, opacity: 0.1, transparent: true, depthWrite: false });
            this.data.selectionMesh = new Mesh(geometry, material);
            this.data.selectionMesh.position.set(target.x, target.y, target.z);
            this.data.selectionOrigin2D = new Vector2(event.clientX, event.clientY);
            this.data.selectionScale = scaleLinear();
            this.data.selectionScale.range([1, 200]);
            this.data.selectionScale.domain([0, this._view.viewport.width]);
            this._view.scene.add(this.data.selectionMesh);
            this._onRequestRender.emit(this._config.graph);
        }
    }
    public onMouseMove(e: ChartEvent): void {

        super.onMouseMove(e);

        if (this.data.selectionMesh === undefined) { return; }
        if (this.data.selectionMesh === null) { return; }
        const event: MouseEvent = e.event as MouseEvent;

        // Determine Distance
        const mousePos = new Vector2(event.clientX, event.clientY);
        const delta = mousePos.distanceTo(this.data.selectionOrigin2D);

        // Adjust Size
        const scale = this.data.selectionScale(delta);
        this.data.selectionMesh.scale.set(scale, scale, scale);

        const radius = this.data.selectionMesh.geometry.boundingSphere.radius * this.data.selectionMesh.scale.x * .5;
        const position = this.data.selectionMesh.position;

        // console.log(radius + ": " + position)
        this._targets
            .forEach(o3d => {
                // console.log(radius + ":  " + o3d.position.distanceTo(position));
                // // console.log(o3d.position.distanceTo(position) + " : " + radius);
                // const mesh = o3d as THREE.Mesh;
                // const material: THREE.MeshPhongMaterial = mesh.material as THREE.MeshPhongMaterial;
                // if (o3d.position.distanceTo(position) < radius) {
                //     material.color.set(0x000000);
                //     material.transparent = false;
                // console.log("......FOUND......");
                // }
                // } else {
                //     if (!mesh.userData.selectionLocked) {
                //         material.color.set(mesh.userData.color);
                //         material.transparent = true;
                //         material.opacity = 0.7;
                //     }
                // }
            });

        this._onRequestRender.emit(this._config.graph);
    }
}
