import { Dexie } from 'dexie';
import { ChartUtil } from 'app/component/workspace/chart/chart.utils';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents, ChartEvent } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum, DirtyEnum } from './../../../model/enum.model';
import { GraphEnum, ShapeEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { TimelinesDataModel, TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleLog } from 'd3-scale';
import { Subscription } from 'rxjs/Subscription';
import { geoAlbers } from 'd3';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { Vector3, CubeGeometry } from 'three';
import { DataService } from 'app/service/data.service';

export class TimelinesGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: TimelinesDataModel;
    private config: TimelinesConfigModel;
    private isEnabled: boolean;
    public groups: Array<THREE.Group>;
    public meshes: Array<THREE.Mesh>;
    public bars: Array<THREE.Line>;
    public database: string;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
            this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            this.sMouseUp.unsubscribe();
            this.sMouseDown.unsubscribe();
            this.sMouseMove.unsubscribe();
        }
    }

    update(config: GraphConfig, data: any) {
        this.config = config as TimelinesConfigModel;
        this.data = data;
        this.removeObjects();
        this.addObjects();
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.groups = [];
        this.view.camera.position.fromArray([0, 0, 1000]);
        this.view.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.view.controls.enableRotate = false;
        return this;
    }

    destroy() {
        this.removeObjects();
        this.enable(false);
    }

    addObjects(): void {

        const patients = this.data.result.events;
        const w = Math.round(this.view.viewport.width * 0.5);
        const halfW = Math.round(w * 0.5);
        const scale = (this.config.timescale === 'Log') ? scaleLog() : scaleLinear();
        console.dir(this.data.result);
        scale.domain([this.data.result.minMax.min, this.data.result.minMax.max]);
        scale.range([-halfW, halfW]);
        patients.forEach((patient, i) => {

            // Create Group
            const group = new THREE.Group();
            group.userData = patient.id;
            group.position.setY(i * 10);
            this.groups.push(group);
            this.view.scene.add(group);

            // Create Background Line
            let events = [];
            debugger;
            if (patient.hasOwnProperty('Status')) { events = events.concat(patient.Status); }
            if (patient.hasOwnProperty('Treatment')) { events = events.concat(patient.Treatment); }
console.dir(events);
            const se = events.reduce( (p, c) => {
                p.min = Math.min(p.min, c.start);
                p.max = Math.max(p.min, c.end);
                return p;
            }, {min: Infinity, max: -Infinity});
console.dir(se);
            const line = ChartFactory.lineAllocate(0xDDDDDD, new THREE.Vector2(scale(se.min) , 0), new THREE.Vector2(scale(se.max) , 0));
            group.add(line);

            if (patient.hasOwnProperty('Treatment')) {

                patient.Treatment.forEach(event => {

                    const s = scale(event.start);

                    if (event.start !== event.end) {
                        const e = scale(event.end);
                        const geometry = new THREE.PlaneGeometry(1, 2);
                        const material = new THREE.MeshBasicMaterial({ color: event.color });
                        const rect = new THREE.Mesh(geometry, material);
                        rect.position.set(e, 1, 0);
                        rect.userData = event.data;
                        // rect.userData = {end: event.end};
                        this.meshes.push(rect);
                        group.add(rect);

                        const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
                        const arc = ChartFactory.lineAllocateCurve(event.color,
                            new THREE.Vector2(s, 2),
                            new THREE.Vector2(e, 2),
                            new THREE.Vector2(c, 4)
                        );
                        group.add(arc);
                    }

                    const geometry = new THREE.PlaneGeometry(1, 2);
                    const material = new THREE.MeshBasicMaterial({ color: event.color });
                    const rect = new THREE.Mesh(geometry, material);
                    rect.userData = event.data;
                    // rect.userData = {start: event.start};
                    rect.position.set(s, 1, 0);
                    this.meshes.push(rect);
                    group.add(rect);
                });
            }

            // Create Status Line
            if (patient.hasOwnProperty('Status')) {

                patient.Status.forEach(event => {

                    const s = scale(event.start);

                    if (event.start !== event.end) {
                        const e = scale(event.end);
                        const geometry = new THREE.PlaneGeometry(1, 2);
                        const material = new THREE.MeshBasicMaterial({ color: event.color });
                        const rect = new THREE.Mesh(geometry, material);
                        rect.position.set(e, -1, 0);
                        rect.userData = event.data;
                        // rect.userData = {end: event.end};
                        this.meshes.push(rect);
                        group.add(rect);

                        const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
                        const arc = ChartFactory.lineAllocateCurve(event.color,
                            new THREE.Vector2(s, -2),
                            new THREE.Vector2(e, -2),
                            new THREE.Vector2(c, -4)
                        );
                        group.add(arc);
                    }

                    const geometry = new THREE.PlaneGeometry(1, 2);
                    const material = new THREE.MeshBasicMaterial({ color: event.color });
                    const rect = new THREE.Mesh(geometry, material);
                    rect.userData = event.data;
                    // rect.userData = {start: event.start};
                    rect.position.set(s, -1, 0);
                    this.meshes.push(rect);
                    group.add(rect);
                });
                // patient.Status.forEach((event, j) => {
                //     const xStart = Math.floor(scale(event.start));
                //     const xEnd = (patient.Status.length > j + 1) ? Math.floor(scale(patient.Status[j + 1].start)) : xStart + 1;
                //     let width = xEnd - xStart;
                //     if (width === 0) { width = 1; }
                //     const mesh = new THREE.Mesh(
                //         new THREE.PlaneGeometry(width, 2),
                //         new THREE.MeshBasicMaterial({ color: event.color, side: THREE.DoubleSide }));
                //     mesh.position.setX(xStart + (width * 0.5));
                //     if (width === 1) { mesh.position.setZ(0.1); }
                //     mesh.userData = event.data;
                //     // mesh.userData = {start: event.start, s: scale(event.start)};
                //     this.meshes.push(mesh);
                //     group.add(mesh);
                // });
            }
        });
    }
    removeObjects(): void {
        this.groups.forEach(group => this.view.scene.remove(group));
    }

    private onMouseMove(e: ChartEvent): void {

        const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (geneHit.length > 0) {
            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            const data = geneHit[0].object.userData;
            const tip = Object.keys(data).reduce( (p, c) => {
                p += c + ': ' + data[c] + '<br />';
                return p;
            }, '');
            if (geneHit[0].point.z >= 2) {
                this.labels.innerHTML = '<div style="background:rgba(255,255,255,.8);color:#000;padding:5px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                tip + '</div>';
            } else {
                this.labels.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#DDD;padding:5px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                tip + '</div>';
            }
            return;
        }
        this.labels.innerHTML = '';
     }
    private onMouseUp(e: ChartEvent): void { }
    private onMouseDown(e: ChartEvent): void { }

    constructor() {}
}
