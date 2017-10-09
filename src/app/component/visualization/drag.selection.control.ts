import { EventEmitter } from '@angular/core';
import { VisualizationView } from './../../model/chart-view.model';
import { EntityTypeEnum, GraphEnum } from 'app/model/enum.model';
import { ChartUtil } from './../workspace/chart/chart.utils';
import { ChartEvent, ChartEvents } from './../workspace/chart/chart.events';
import { Subscription } from 'rxjs/Subscription';
import * as THREE from 'three';
import * as scale from 'd3-scale';
export class DragSelectionControl {

    // UI Events
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    // Emitters
    onRequestRender: EventEmitter<GraphEnum>;
    onSelect: EventEmitter<{ type: EntityTypeEnum; ids: string[]; }>;

    // Objects
    private selector: THREE.Mesh;
    private view: VisualizationView;
    private events: ChartEvents;
    public meshes: Array<THREE.Object3D>;

    // State
    private selectorOrigin: { x: number, y: number };
    private selectorScale: any;
    private _dragging: boolean;
    private _enabled: boolean;
    public set enabled(value: boolean) {
        if (this._enabled === value) { return; }
        this._enabled = value;
        if (this._enabled) {
            this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
            this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            if (this.sMouseUp !== null) { return; }
            this.sMouseUp.unsubscribe();
            this.sMouseDown.unsubscribe();
            this.sMouseMove.unsubscribe();
        }
    }

    public create(events: ChartEvents, view: VisualizationView, meshes: Array<THREE.Object3D>,
        onRequestRender: EventEmitter<GraphEnum>, onSelect: EventEmitter<{ type: EntityTypeEnum; ids: string[]; }> ): void {
        this._enabled = false;
        this.view = view;
        this.meshes = meshes;
        this.events = events;
        this.onRequestRender = onRequestRender;
        this.onSelect = onSelect;
        this.selector = new THREE.Mesh(
            new THREE.SphereGeometry(3, 30, 30),
            new THREE.MeshStandardMaterial({ opacity: .2, transparent: true }));
    }
    public destroy() {
        this.view = null;
        this.meshes = null;
        this.events = null;
        this.selector = null;
        this.onRequestRender = null;
        this.onSelect = null;
    }

    private onMouseMove(e: ChartEvent): void {
        if (this._enabled && this._dragging) {
            const mouseEvent: MouseEvent = e.event as MouseEvent;
            const deltaX = Math.abs(this.selectorOrigin.x - mouseEvent.clientX);
            const deltaY = Math.abs(this.selectorOrigin.y - mouseEvent.clientY);
            const delta = Math.max(deltaX, deltaY);
            const scale = this.selectorScale(delta);
            this.selector.scale.set(scale, scale, scale);
            this.onRequestRender.next();
            const radius = this.selector.geometry.boundingSphere.radius * this.selector.scale.x;
            const position = this.selector.position;
            const meshes = this.view.scene.children
                .filter(v => v.type === 'Mesh')
                .forEach(o3d => {
                    const mesh = o3d as THREE.Mesh;
                    const material: THREE.MeshStandardMaterial = mesh.material as THREE.MeshStandardMaterial;
                    if (mesh.position.distanceTo(position) < radius) {
                        material.color.set(0xFF0000);
                    } else {
                        material.color.set(0x00FF00);
                    }
                });
        }
    }
    private onMouseUp(e: ChartEvent): void {
        if (this._enabled && this._dragging) {
            this._dragging = false;
            const radius = this.selector.geometry.boundingSphere.radius * this.selector.scale.x;
            const position = this.selector.position;
            const samples = this.view.scene.children
                .filter(v => v.type === 'Mesh');

            samples.forEach(v => {
                const mesh = v as THREE.Mesh;
                const material: THREE.MeshStandardMaterial = mesh.material as THREE.MeshStandardMaterial;
                material.color.set(mesh.userData.color);
            });

            const selected = samples
                .filter(v => v.position.distanceTo(position) < radius );

            const ids = selected
                .map( v => v.userData.id);

            this.view.scene.remove(this.selector);
            this.view.controls.enabled = true;
            this.onSelect.next({type: EntityTypeEnum.SAMPLE, ids: ids});
            this.onRequestRender.next();
        }
    }

    private onMouseDown(e: ChartEvent): void {

        const intersects = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);

        if (intersects.length > 0) {
            this._dragging = true;
            this.view.controls.enabled = false;
            this.selectorScale = scale.scaleLinear();
            this.selectorScale.range([1, 100]);
            this.selectorScale.domain([0, this.view.viewport.width]);
            const mouseEvent: MouseEvent = e.event as MouseEvent;
            this.selectorOrigin = { x: mouseEvent.clientX, y: mouseEvent.clientY };
            this.view.controls.enabled = false;
            const targetPosition: THREE.Vector3 = intersects[0].object.position.clone();
            this.selector.scale.set(5, 5, 5);
            this.selector.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            this.view.scene.add(this.selector);
        }
    }

}
