import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as scale from 'd3-scale';
import * as TWEEN from 'tween.js';
import { DataDecorator } from './../../model/data-map.model';
import { ChartUtil } from './../workspace/chart/chart.utils';
import { GraphData } from './../../model/graph-data.model';
import { ChartFactory } from './../workspace/chart/chart.factory';
import { DragSelectionControl } from './drag.selection.control';
import { GraphConfig } from 'app/model/graph-config.model';
import { AbstractVisualization } from './visualization.abstract.component';
import { Subscription } from 'rxjs/Subscription';
import { WorkspaceLayoutEnum, DimensionEnum, CollectionTypeEnum } from './../../model/enum.model';
import { VisualizationView } from './../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../workspace/chart/chart.events';
import { EventEmitter, HostListener, ViewContainerRef } from '@angular/core';
import { GraphEnum, EntityTypeEnum, DirtyEnum, ShapeEnum, VisualizationEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../model/chart.object.interface';
import * as THREE from 'three';
import { CircleGeometry, SphereGeometry, Vector2, MeshPhongMaterial } from 'three';
import { EventTargetLike } from 'rxjs/observable/FromEventObservable';
import * as _ from 'lodash';
import * as d3Force from 'd3-force';

export class AbstractScatterVisualization extends AbstractVisualization {

    public set data(data: GraphData) { this._data = data; }
    public get data(): GraphData { return this._data; }
    public set config(config: GraphConfig) { this._config = config; }
    public get config(): GraphConfig { return this._config; }

    // Objects
    private lines: Array<THREE.Line>;
    private mouseMode: 'CONTROL' | 'SELECTION' = 'CONTROL';
    private points: Array<THREE.Object3D>;
    private selectionMeshes: Array<THREE.Mesh>;
    private selectionMesh: THREE.Mesh;
    private selectionOrigin2d: Vector2;
    private selectionScale: scale.ScaleLinear<number, number>;
    // private labelListener = _.debounce(this.showLabels, 300);

    // Private Subscriptions
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.selectionMeshes = [];
        this.meshes = [];
        this.points = [];
        this.lines = [];
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
        this.view.controls.removeEventListener('change', this.showLabels);
    }
    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this._config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = true;

        this.view.controls.addEventListener('change', this.showLabels.bind(this));

    }

    addObjects(type: EntityTypeEnum) {
        const propertyId = (this._config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const objectIds = this._data[propertyId];
        this._data.resultScaled.forEach((point, index) => {
            const group = ChartFactory.createDataGroup(
                objectIds[index], this._config.entity, new THREE.Vector3(...point));
            this.meshes.push(group);
            this.view.scene.add(group);
        });
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
        this.points = this.meshes.map(v => v.children[0]);
    }

    removeObjects() {
        this.view.scene.remove(...this.selectionMeshes);
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.lines);
        this.selectionMeshes.length = 0;
        this.meshes.length = 0;
        this.lines.length = 0;
    }

    showLabels(): void {
        const frustum = new THREE.Frustum();
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.view.camera.projectionMatrix, this.view.camera.matrixWorldInverse));
        const visibleMeshes = this.meshes.filter(mesh => frustum.containsPoint(mesh.position));
        const w = this.view.viewport.width * .5;
        const h = this.view.viewport.height * .5;

        const data = visibleMeshes.map(mesh => {
            const vector = mesh.position.clone().project(this.view.camera)
            vector.y = -(vector.y * h) + h;
            vector.x = (vector.x * w) + w;
            return { vector: vector, tooltip: mesh.userData.tooltip };
        }).sort((a, b) => a.vector.z - b.vector.z);

        // Take 30 closest to screen
        data.length = 40;


        const html = data.reduce((p, c) => {
            return p += '<div class="z-tooltip" style="left:' + c.vector.x + 'px;top:' + c.vector.y + 'px;">' + c.tooltip + '</div>';
        }, '')


        d3Force.forceLink()

        this.tooltips.innerHTML = html;


        // console.log(visibleMeshes.length)
        // console.log('show labels');
    }
    hideLabels(): void {
        this.tooltips.innerHTML = '';
    }
    onMouseDown(e: ChartEvent): void {
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.points);
        if (hit.length > 0) {
            this.tooltips.innerHTML = '';
            this.mouseMode = 'SELECTION';
            this.view.controls.enabled = false;
            const target: THREE.Vector3 = hit[0].object.parent.position.clone();
            const event: MouseEvent = e.event as MouseEvent;
            const geometry = new THREE.SphereGeometry(3, 30, 30);
            const material = new THREE.MeshPhongMaterial({ color: 0x029BE5, opacity: 0.1, transparent: true, depthWrite: false });
            this.selectionMesh = new THREE.Mesh(geometry, material);
            this.selectionMesh.position.set(target.x, target.y, target.z);
            this.selectionMeshes.push(this.selectionMesh);
            this.selectionOrigin2d = new Vector2(event.clientX, event.clientY);
            this.selectionScale = scale.scaleLinear();
            this.selectionScale.range([1, 200]);
            this.selectionScale.domain([0, this.view.viewport.width]);
            this.view.scene.add(this.selectionMesh);
            this.onRequestRender.emit(this._config.graph);
        }
    }

    onMouseUp(e: ChartEvent): void {
        this.mouseMode = 'CONTROL';
        this.view.controls.enabled = true;
        if (!(e.event as MouseEvent).shiftKey) {
            this.selectionMeshes.forEach(mesh => this.view.scene.remove(mesh));
            this.onRequestRender.emit(this._config.graph);
            this.meshes
                .forEach(o3d => {
                    const mesh = o3d.children[0] as THREE.Mesh;
                    mesh.userData.selectionLocked = false;
                });
        } else {
            const radius = this.selectionMesh.geometry.boundingSphere.radius * this.selectionMesh.scale.x;
            const position = this.selectionMesh.position;
            this.meshes
                .forEach(o3d => {
                    const mesh = o3d.children[0] as THREE.Mesh;
                    const material: THREE.MeshPhongMaterial = mesh.material as THREE.MeshPhongMaterial;
                    if (o3d.position.distanceTo(position) < radius) {
                        mesh.userData.selectionLocked = true;
                    }
                });
        }
    }

    onMouseMove(e: ChartEvent): void {
        // Selection
        if (this.mouseMode === 'SELECTION') {
            const event: MouseEvent = e.event as MouseEvent;
            const mousePos = new Vector2(event.clientX, event.clientY);
            const delta = mousePos.distanceTo(this.selectionOrigin2d);
            const scale = this.selectionScale(delta);
            this.selectionMesh.scale.set(scale, scale, scale);

            const radius = this.selectionMesh.geometry.boundingSphere.radius * this.selectionMesh.scale.x;
            const position = this.selectionMesh.position;
            this.meshes
                .forEach(o3d => {
                    const mesh = o3d.children[0] as THREE.Mesh;
                    const material: THREE.MeshPhongMaterial = mesh.material as THREE.MeshPhongMaterial;
                    if (o3d.position.distanceTo(position) < radius) {
                        material.color.set(0x000000);
                        material.transparent = false;
                    } else {
                        if (!mesh.userData.selectionLocked) {
                            material.color.set(mesh.userData.color);
                            material.transparent = true;
                            material.opacity = 0.7;
                        }
                    }
                });
            this.onRequestRender.emit(this._config.graph);
            return;
        }
        // Hit Test
        // const hit = ChartUtil.getIntersects(this.view, e.mouse, this.points);
        // console.log(hit.length);
        // if (hit.length > 0) {

        //     if (hit[0].object.userData === undefined) {
        //         return;
        //     }
        //     const xPos = e.mouse.xs + 10;
        //     const yPos = e.mouse.ys;
        //     this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
        //         '3px;z-index:9999;position:absolute;left:' +
        //         xPos + 'px;top:' +
        //         yPos + 'px;">' +
        //         hit[0].object.userData.tooltip + '</div>';
        //     return;
        // }
        // this.tooltips.innerHTML = '';
    }
}
