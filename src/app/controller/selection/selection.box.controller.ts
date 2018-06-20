import { ChartSelection } from './../../model/chart-selection.model';

import { GraphConfig } from 'app/model/graph-config.model';
import { ChartEvents, ChartEvent } from './../../component/workspace/chart/chart.events';
import { VisualizationView } from './../../model/chart-view.model';
import { AbstractMouseController } from './../abstract.mouse.controller';
import { Vector3, SphereGeometry, MeshPhongMaterial, Mesh, Object3D, Vector2, Sphere } from 'three';
import { EventEmitter } from '@angular/core';
import { GraphEnum } from '../../model/enum.model';
import { scaleLinear } from 'd3-scale';
export class SelectionOptions {

}

export class SelectionBoxController extends AbstractMouseController {

    protected _config: GraphConfig;
    protected _options: SelectionOptions;
    protected _onRequestRender: EventEmitter<GraphEnum>;
    protected _onSelect: EventEmitter<ChartSelection>;

    public teardown(): void {
        this._config = null;
        this._onRequestRender = null;
        this._onSelect = null;
    }
    public setup(config: GraphConfig, onRequestRender: EventEmitter<GraphEnum>,
        onSelect: EventEmitter<ChartSelection>, targets: Array<Object3D>): void {
        this._config = config;
        this._onSelect = onSelect;
        this._onRequestRender = onRequestRender;
        this.targets = targets;
    }
    public get options(): SelectionOptions { return this._options; }
    public set options(value: SelectionOptions) {
        this._options = value;
    }

    public destroy(): void {
        super.destroy();
        this.teardown();
    }

    public onKeyUp(e: KeyboardEvent): void {
        if (e.key === 'Meta') {
            if (!e.shiftKey) {
                this.completeSelection();
            }
        }

        if (e.key === 'Shift') {
            this._view.scene.remove(this.data.selectionMesh);
            this.data.selectionMesh = null;
            this.completeSelection();
        }
    }

    public completeSelection(): void {
        const type = this._targets[0].userData.idType;
        const ids = [];
        this._targets.filter(v => v.userData.selected)
            .forEach(o3d => {
                ids.push(o3d.userData.id);
                const mesh = o3d as Mesh;
                const material = mesh.material as THREE.MeshPhongMaterial;
                mesh.userData.locked = false;
                material.color.set(mesh.userData.color);
                material.transparent = true;
                material.opacity = 0.7;
            });
        this._onRequestRender.emit(this._config.graph);
        const selection: ChartSelection = { type: type, ids: ids };
        if (selection.ids.length > 0) {
            this._onSelect.emit(selection);
        }
    }

    public onMouseUp(e: ChartEvent): void {
        this._view.scene.remove(this.data.selectionMesh);
        this.data.selectionMesh = null;
        if (!e.event.shiftKey) {
            this.completeSelection();
        } else {
            this._targets.filter(v => v.userData.selected)
                .forEach(v => {
                    v.userData.locked = true;
                });
            this._onRequestRender.emit(this._config.graph);
        }
    }

    public onMouseDown(e: ChartEvent): void {
        const intersects = this.getIntersects(this._view, e.mouse, this._targets);
        if (intersects.length > 0) {
            const event: MouseEvent = e.event as MouseEvent;
            const target: Vector3 = intersects[0].point.clone();//.object.position.clone();
            const geometry = new SphereGeometry(3, 30, 30);
            const material = new MeshPhongMaterial({ color: 0x029BE5, opacity: 0.1, transparent: true, depthWrite: false });
            this.data.selectionMesh = new Mesh(geometry, material);
            this.data.selectionMesh.position.set(target.x, target.y, target.z);
            this.data.selectionOrigin2D = new Vector2(event.clientX, event.clientY);
            this.data.selectionScale = scaleLinear();
            this.data.selectionScale.range([1, 160]);
            this.data.selectionScale.domain([0, this._view.viewport.width]);

            const originMesh = intersects[0].object as Mesh;
            originMesh.userData.selected = true;
            const originMaterial = originMesh.material as THREE.MeshPhongMaterial;
            originMaterial.color.set(0xFF0000);
            originMaterial.transparent = false;
            this._view.scene.add(this.data.selectionMesh);
            this._onRequestRender.emit(this._config.graph);
        }
    }
    public onMouseMove(e: ChartEvent): void {

        super.onMouseMove(e);

        if (this.data.selectionMesh === undefined) { return; }
        if (this.data.selectionMesh === null) { return; }
        const event: MouseEvent = e.event as MouseEvent;

        // Determine 2D Distance
        const mousePos = new Vector2(event.clientX, event.clientY);
        const delta = mousePos.distanceTo(this.data.selectionOrigin2D);

        // Adjust Size Of Selection Mesh
        const scale = this.data.selectionScale(delta);
        const selectionMesh: Mesh = this.data.selectionMesh as Mesh;
        selectionMesh.scale.set(scale, scale, scale);

        // Build Sphere For Proximity Testing
        const sphere: Sphere = new Sphere(selectionMesh.position, scale * 3);

        // Loop through targets to see what is in range
        this._targets
            .forEach(o3d => {
                const mesh = o3d as Mesh;
                const material = mesh.material as THREE.MeshPhongMaterial;
                console.dir(o3d.position);

                if (sphere.containsPoint(o3d.position)) {
                    mesh.userData.selected = true;
                    material.color.set(0xFF0000);
                    material.transparent = false;
                } else {
                    if (!mesh.userData.locked) {
                        mesh.userData.selected = false;
                        material.color.set(mesh.userData.color);
                        material.transparent = true;
                    }
                }
            });
        this._onRequestRender.emit(this._config.graph);
    }

    constructor(view: VisualizationView, events: ChartEvents, debounce: number = 10) {
        super(view, events, debounce);
        this._options = {};
    }
}
