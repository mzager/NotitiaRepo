import { OrbitControls } from 'three-orbitcontrols-ts';
import { TimelinesStyle } from './timelines.model';
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
import { geoAlbers, active } from 'd3';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { Vector3, CubeGeometry, Vector2, OrthographicCamera } from 'three';
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
    public meshes: Array<THREE.Object3D>;
    public bars: Array<THREE.Line>;
    public database: string;
    private activePid: '';

    private title: HTMLElement;
    private overlay: HTMLElement;
    private tooltips: HTMLElement;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;




    enable(truthy: boolean) {
        // if (this.isEnabled === truthy) { return; }
        // this.isEnabled = truthy;
        // this.view.controls.enabled = this.isEnabled;
        // this.view.controls.addEventListener('start', this.zoomStart.bind(this));
        // this.view.controls.addEventListener('end', _.debounce(this.zoomEnd.bind(this), 300));

        // if (truthy) {
        //     this.sMouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
        //     this.sMouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
        //     this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        // } else {
        //     this.sMouseUp.unsubscribe();
        //     this.sMouseDown.unsubscribe();
        //     this.sMouseMove.unsubscribe();
        // }
    }

    update(config: GraphConfig, data: any) {
        this.config = config as TimelinesConfigModel;
        // this.data = data;
        // this.removeObjects();
        // this.addObjects();
        this.title.innerText = (config.entity === EntityTypeEnum.PATIENT) ? 'Patient Timelines' : 'Event Timeline';
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.labels.innerText = '';
        this.title = <HTMLDivElement>(document.createElement('div'));
        this.title.className = 'graph-title';
        this.labels.appendChild(this.title);

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild(this.tooltips);

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild(this.overlay);

        // this.events = events;
        // this.view = view;
        // this.isEnabled = false;
        // this.meshes = [];
        // this.groups = [];
        // this.view.controls.enableRotate = false;
        return this;
    }

    destroy() {
        this.removeObjects();
        this.enable(false);
    }
    // #region
    addTics(group: THREE.Group, events: Array<any>, scale: any, height: number = 10): void {
        // events.forEach(event => {
        //     const s = scale(event.start);
        //     const line = ChartFactory.lineAllocate(event.color,
        //         new Vector2(s, 0),
        //         new Vector2(s, height),
        //         event);
        //     this.meshes.push(line);
        //     group.add(line);
        // });
    }
    addSymbols(group: THREE.Group, events: Array<any>, scale: any, height: number): void {
      
        // events.forEach(event => {
        //     const squareGeometry: THREE.Geometry = new THREE.Geometry();
        //     squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, 0.0));
        //     squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, 0.0));
        //     squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
        //     squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        //     squareGeometry.faces.push(new THREE.Face3(0, 1, 2));
        //     squareGeometry.faces.push(new THREE.Face3(0, 2, 3));
        //     const square = new THREE.Mesh( squareGeometry, ChartFactory.getColorBasic(event.color));
        //     square.userData = event;
        //     square.position.set(scale(event.start), 0, 0);
        //     group.add(square);
        //     this.meshes.push(square);

        //     if (event.start !== event.end) {
        //         const triangleGeometry = new THREE.Geometry();
        //         triangleGeometry.vertices.push(new THREE.Vector3( 0.0,  1.0, 0.0));
        //         triangleGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        //         triangleGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, 0.0));
        //         triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
        //         const triangle = new THREE.Mesh(triangleGeometry, ChartFactory.getColorBasic(event.color));
        //         triangle.userData = event;
        //         triangle.position.set(scale(event.end), 0, 0);
        //         group.add(triangle);
        //         this.meshes.push(triangle);
        //     }

        // });
    }

    addArcs(group: THREE.Group, events: Array<any>, scale: any, height: number = 10): void {
        // events.forEach(event => {
        //     const s = scale(event.start);
        //     if (event.start !== event.end) {
        //         const e = scale(event.end);
        //         const line = ChartFactory.lineAllocate(event.color,
        //             new Vector2(e, 0),
        //             new Vector2(e, height),
        //             event);
        //         this.meshes.push(line);
        //         group.add(line);
        //         const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
        //         const arc = ChartFactory.lineAllocateCurve(event.color,
        //             new THREE.Vector2(s, 0),
        //             new THREE.Vector2(e, 0),
        //             new THREE.Vector2(c, height)
        //         );
        //         group.add(arc);
        //     }
        //     const rect = ChartFactory.lineAllocate(event.color,
        //         new Vector2(s, 0),
        //         new Vector2(s, height),
        //         event);
        //     this.meshes.push(rect);
        //     group.add(rect);
        // });
    }
    addContinuousBars(group: THREE.Group, events: Array<any>, scale: any, y: number, height: number = 1): void {
        // const l = events.length;
        // for (let i = 0; i < l; i++) {
        //     const s = scale(events[i].start);
        //     const j = i + 1;
        //     const e = scale(j < l ? events[j].start : events[i].end);
        //     let width = Math.abs(e - s);
        //     if (width === 0) { width = 1; }
        //     const rect = new THREE.Mesh(
        //         new THREE.PlaneGeometry(width, height),
        //         new THREE.MeshBasicMaterial({ color: events[i].color, side: THREE.DoubleSide }));
        //     rect.position.set(s + (width * 0.5), y, -1);
        //     rect.userData = events[i];
        //     this.meshes.push(rect);
        //     group.add(rect);
        // }
    }
    addDurationLine(group: THREE.Group, events: Array<any>, scale: any): void {
        // const se = events.reduce((p, c) => {
        //     p.min = Math.min(p.min, c.start);
        //     p.max = Math.max(p.max, c.end);
        //     return p;
        // }, { min: Infinity, max: -Infinity });

        // const line = ChartFactory.lineAllocate(0x029BE5, new THREE.Vector2(scale(se.min), 0), new THREE.Vector2(scale(se.max), 0));
        // this.meshes.push(line);
        // group.add(line);
    }

    // #endregion
    addObjects(): void {
        // this.meshes = [];
        // this.groups = [];
        // // Line Color
        // const w = Math.round(this.view.viewport.width * 0.5);
        // const halfW = Math.round(w * 0.5);
        // const scale = (this.config.timescale === 'Log') ? scaleLog() : scaleLinear();

        // // Event Type
        // if (this.config.entity === EntityTypeEnum.EVENT) {
        //     const subtypes: Array<any> = this.data.result.events;
        //     Object.keys(subtypes).forEach((subtype, i) => {
        //         const group = new THREE.Group();
        //         group.userData = {type: subtypes[subtype][0].type, subtype: subtype};
        //         group.position.setY(i * 20);
        //         this.groups.push(group);
        //         this.view.scene.add(group);

        //         // Line Scale
        //         const line = ChartFactory.lineAllocate(0x029BE5, new THREE.Vector2(-halfW + 20, 0), new THREE.Vector2(halfW - 20, 0));
        //         group.add(line);

        //         scale.domain([this.data.result.minMax[subtype].min, this.data.result.minMax[subtype].max]);
        //         scale.range([-halfW + 20, halfW - 20]);

        //         if (subtypes[subtype].length > 0) {
        //             const type = subtypes[subtype][0].type;
        //             const style = (type === 'Status') ? this.config.statusStyle : this.config.treatmentStyle;
        //             switch (style) {
        //                 case TimelinesStyle.TICKS:
        //                     this.addTics(group, subtypes[subtype], scale);
        //                     break;
        //                 case TimelinesStyle.ARCS:
        //                     this.addArcs(group, subtypes[subtype], scale);
        //                     break;
        //                 case TimelinesStyle.CONTINUOUS:
        //                     this.addContinuousBars(group, subtypes[subtype], scale, (type === 'Status') ? 0 : 2);
        //                     break;
        //                 case TimelinesStyle.SYMBOLS:
        //                     this.addSymbols(group, subtypes[subtype], scale, 3);
        //                     break;
        //             }
        //         }
        //     });
        // }

        // if (this.config.entity === EntityTypeEnum.PATIENT) {
        //     const patients: Array<any> = this.data.result.events;
        //     scale.domain([this.data.result.minMax.min, this.data.result.minMax.max]);
        //     scale.range([-halfW, halfW]);

        //     patients.forEach((patient, i) => {

        //         //Create Group To Hold Each Patient
        //         const group = new THREE.Group();
        //         group.userData = patient.id;
        //         group.position.setY(i * 5);
        //         this.groups.push(group);
        //         this.view.scene.add(group);

        //         let events = [];
        //         if (patient.hasOwnProperty('Status')) { events = events.concat(patient.Status); }
        //         if (patient.hasOwnProperty('Treatment')) { events = events.concat(patient.Treatment); }
        //         this.addDurationLine(group, events, scale);

        //         if (patient.hasOwnProperty('Status')) {
        //             switch (this.config.statusStyle) {
        //                 case TimelinesStyle.TICKS:
        //                     this.addTics(group, patient.Status, scale, 3);
        //                     break;
        //                 case TimelinesStyle.ARCS:
        //                     this.addArcs(group, patient.Status, scale, 3);
        //                     break;
        //                 case TimelinesStyle.CONTINUOUS:
        //                     this.addContinuousBars(group, patient.Status, scale, 0);
        //                     break;
        //                 case TimelinesStyle.SYMBOLS:
        //                     this.addSymbols(group, patient.Status, scale, 3);
        //                     break;
        //             }
        //         }

        //         if (patient.hasOwnProperty('Treatment')) {
        //             switch (this.config.treatmentStyle) {
        //                 case TimelinesStyle.TICKS:
        //                     this.addTics(group, patient.Treatment, scale, 4);
        //                     break;
        //                 case TimelinesStyle.ARCS:
        //                     this.addArcs(group, patient.Treatment, scale, 4);
        //                     break;
        //                 case TimelinesStyle.CONTINUOUS:
        //                     this.addContinuousBars(group, patient.Treatment, scale, 1);
        //                     break;
        //                 case TimelinesStyle.SYMBOLS:
        //                     this.addSymbols(group, patient.Treatment, scale, 4);
        //                     break;
        //             }
        //         }
        //     });
        // }
        // this.zoomEnd();
    }
    removeObjects(): void {
        //this.groups.forEach(group => this.view.scene.remove(group));
    }

    zoomStart(): void {
        //this.overlay.innerText = '';
    }

    zoomEnd(): void {
        // this.overlay.innerText = '';
        // if (this.config.entity === EntityTypeEnum.EVENT) {
        //     const m = this.meshes;
        //     const g = this.groups;
        //     const lbls = g.map(v => {
        //         return {
        //             type: v.userData.type,
        //             subtype: v.userData.subtype,
        //             pos: ChartUtil.projectToScreen(this.config.graph, v, this.view.camera,
        //                 this.view.viewport.width, this.view.viewport.height)
        //         };
        //     }).reduce((p, c) => {
        //         p += '<span style="color:#9e9e9e;position:absolute;left:50px;top:' + c.pos.y + 'px;">';
        //         p += c.subtype + ' ' + c.type + '</span>';
        //         return p;
        //     }, '');
        //     this.overlay.innerHTML = lbls;
        // }
    }

    private onMouseMove(e: ChartEvent): void {
        // const hit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);

        // if (hit.length > 0) {

        //     if (hit[0].object.userData === undefined) {
        //         return;
        //     }
        //     try {
        //         const xPos = e.mouse.xs + 10;
        //         const yPos = e.mouse.ys;
        //         const data = hit[0].object.userData.data;
        //         const tip = Object.keys(data).reduce((p, c) => {
        //             if (data[c].trim().length > 0) {
        //                 p += c + ': ' + data[c].toLowerCase() + '<br />';
        //             }
        //             return p;
        //         }, '');
        //         this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#DDD;padding:5px;border-radius:' +
        //             '3px;z-index:9999;position:absolute;left:' +
        //             xPos + 'px;top:' +
        //             yPos + 'px;">' +
        //             tip + '</div>';
        //     } catch (e) { }

        //     return;
        // }
        // this.tooltips.innerHTML = '';
    }
    private onMouseUp(e: ChartEvent): void { }
    private onMouseDown(e: ChartEvent): void { }

    constructor() { }

}
