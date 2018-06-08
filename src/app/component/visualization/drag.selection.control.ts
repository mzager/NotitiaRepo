import { EventEmitter } from '@angular/core';
import { EntityTypeEnum, GraphEnum } from 'app/model/enum.model';
import * as THREE from 'three';
import { VisualizationView } from './../../model/chart-view.model';
export class DragSelectionControl {

    // Emitters
    onRequestRender: EventEmitter<GraphEnum>;
    onSelect: EventEmitter<{ type: EntityTypeEnum; ids: string[]; }>;

    // Objects
    private selector: THREE.Mesh;
    private view: VisualizationView;
    public meshes: Array<THREE.Object3D>;
    private _raycaster: THREE.Raycaster;

    // State
    private selectorOrigin: { x: number, y: number };
    private selectorScale: any;
    private _dragging: boolean;
    private _enabled: boolean;
    public set enabled(value: boolean) {
        // if (this._enabled === value) { return; }
        // this._enabled = value;
        // if (this._enabled) {
        //     this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
        //     this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
        //     this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        // } else {
        //     if (this.sMouseUp !== null) { return; }
        //     this.sMouseUp.unsubscribe();
        //     this.sMouseDown.unsubscribe();
        //     this.sMouseMove.unsubscribe();
        // }
    }

    public create(): void {
        this._raycaster = new THREE.Raycaster();
        // this._enabled = false;
        // this.view = view;
        // this.meshes = meshes;
        // this.events = events;
        // this.onRequestRender = onRequestRender;
        // this.onSelect = onSelect;
        // this.selector = new THREE.Mesh(
        //     new THREE.SphereGeometry(3, 30, 30),
        //     new THREE.MeshStandardMaterial({ opacity: .2, transparent: true }));
    }
    public destroy() {
        this.view = null;
        this.meshes = null;
        // this.events = null;
        this.selector = null;
        this.onRequestRender = null;
        this.onSelect = null;
    }

    public getIntersects(
        view: VisualizationView,
        pos: { x: number, y: number, xs: number, ys: number },
        objects: Array<THREE.Object3D>): Array<THREE.Intersection> {
        this._raycaster.setFromCamera(pos, view.camera);
        return this._raycaster.intersectObjects(objects, false);
    }

}
