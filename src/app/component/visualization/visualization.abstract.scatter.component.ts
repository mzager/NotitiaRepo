import * as scale from 'd3-scale';
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
import { EventEmitter, HostListener } from '@angular/core';
import { GraphEnum, EntityTypeEnum, DirtyEnum, ShapeEnum, VisualizationEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../model/chart.object.interface';
import * as THREE from 'three';
import { CircleGeometry, SphereGeometry, Vector2, MeshPhongMaterial } from 'three';
export class AbstractScatterVisualization extends AbstractVisualization {

    // Chart Elements
    private data: GraphData;
    public config: GraphConfig;
    private decorators: Array<DataDecorator>;

    // Objects
    private lines: Array<THREE.Line>;
    // private controls: DragSelectionControl;
    private overlay: HTMLElement;
    private tooltips: HTMLElement;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;
    private mouseMode: 'CONTROL' | 'SELECTION' = 'CONTROL';
    private points: Array<THREE.Object3D>;
    private selectionMesh: THREE.Mesh;
    private selectionOrigin2d: Vector2;
    private selectionScale: scale.ScaleLinear<number, number>;
    private shiftDown: Boolean;

    // Private Subscriptions
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild( this.tooltips );

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild( this.overlay );
        this.meshes = [];
        this.points = [];
        this.lines = [];
        // this.controls = new DragSelectionControl();
        // this.controls.create(events, view, this.meshes, this.onRequestRender, this.onSelect);
        this.view.controls.enableRotate = true;

        this.decorators = [];
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }
    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        this.decorators = decorators;
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
        this.points = this.meshes.map(v => v.children[0]);
    }

    updateData(config: GraphConfig, data: any) {
        this.config = config as GraphConfig;
        this.data = data;
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        // this.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
            this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
        } else {
            this.sMouseMove.unsubscribe();
            this.sMouseDown.unsubscribe();
            this.sMouseUp.unsubscribe();
            this.tooltips.innerHTML = '';
        }
    }

    addObjects(type: EntityTypeEnum) {
        const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const objectIds = this.data[propertyId];
        this.data.resultScaled.forEach( (point, index) => {
            const group = ChartFactory.createDataGroup(
                objectIds[index], this.config.entity, new THREE.Vector3(...point));
            this.meshes.push(group);
            this.view.scene.add(group);
        });

        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
        this.points = this.meshes.map(v => v.children[0]);
    }

    removeObjects() {
        this.meshes.forEach(v => {
            ChartFactory.meshRelease(v as THREE.Mesh);
            this.view.scene.remove(v);

        });
        this.meshes.length = 0;
        this.lines.forEach(v => this.view.scene.remove(v));
        this.lines.length = 0;
    }

    private onMouseDown(e: ChartEvent): void {
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.points);
        if (hit.length > 0) {

            this.mouseMode = 'SELECTION';
            this.view.controls.enabled = false;
            const target: THREE.Vector3 = hit[0].object.parent.position.clone();
            const event: MouseEvent = e.event as MouseEvent;
            const geometry = new THREE.SphereGeometry(3, 30, 30);
            const material = new THREE.MeshPhongMaterial({color: 0x029BE5, opacity: 0.1, transparent: true});

            // const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
            // const geometry = new THREE.CircleGeometry( 3, 64 );
            // geometry.vertices.shift();
            this.selectionMesh = new THREE.Mesh(geometry, material);
            this.selectionMesh.position.set(target.x, target.y, target.z);
            this.selectionOrigin2d = new Vector2(event.clientX, event.clientY);
            this.selectionScale = scale.scaleLinear();
            this.selectionScale.range([1, 1000]);
            this.selectionScale.domain([0, this.view.viewport.width]);
            this.view.scene.add(this.selectionMesh);
            this.onRequestRender.emit( this.config.graph );
        }
    }

    private onMouseUp(e: ChartEvent): void {

        this.mouseMode = 'CONTROL';
        this.view.controls.enabled = true;
        this.view.scene.remove(this.selectionMesh);
        this.onRequestRender.emit( this.config.graph );
    }

    private onMouseMove(e: ChartEvent): void {
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
                // .filter(v => v.type === 'Mesh')
                .forEach(o3d => {
                    const mesh = o3d.children[0] as THREE.Mesh;
                    const material: THREE.MeshPhongMaterial = mesh.material as THREE.MeshPhongMaterial;
                    if (o3d.position.distanceTo(position) < radius) {
                        material.color.set(0x000000);
                        material.transparent = false;
                    } else {
                        if (!this.shiftDown) {
                            material.color.set(mesh.userData.color);
                            material.transparent = true;
                            material.opacity = 0.7;
                        }
                    }
                });
            this.onRequestRender.emit( this.config.graph );
            return;
        }
        // Hit Test
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.points);
        if (hit.length > 0) {

            if (hit[0].object.userData === undefined) {
                return;
            }
            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                hit[0].object.userData.tooltip + '</div>';
            return;
        }
        this.tooltips.innerHTML = '';
    }


}
