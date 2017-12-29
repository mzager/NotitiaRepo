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
import { Vector3, CubeGeometry, Vector2 } from 'three';
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
    private activePid: '';

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
    // #region
    addBottomLoops(group: THREE.Group, events: Array<any>, scale: any): void {
        events.forEach(event => {
            const s = scale(event.start);
            if (event.start !== event.end) {
                const e = scale(event.end);
                // const geometry = new THREE.PlaneGeometry(1, 2);
                // const material = new THREE.MeshBasicMaterial({ color: event.color });
                // const rect = new THREE.Mesh(geometry, material);
                const rect = ChartFactory.lineAllocate(event.color,
                    new Vector2(e, 0),
                    new Vector2(e, 10),
                    event);
                // rect.position.set(e, -1, 0);
                // rect.userData = event;
                // rect.userData = {end: event.end};
                // this.meshes.push(rect);
                group.add(rect);

                const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
                const arc = ChartFactory.lineAllocateCurve(event.color,
                    new THREE.Vector2(s, -2),
                    new THREE.Vector2(e, -2),
                    new THREE.Vector2(c, -3)
                );
                group.add(arc);
            }
            const geometry = new THREE.PlaneGeometry(1, 2);
            const material = new THREE.MeshBasicMaterial({ color: event.color });
            const rect = new THREE.Mesh(geometry, material);
            rect.userData = event;
            // rect.userData = {start: event.start};
            rect.position.set(s, -1, 0);
            this.meshes.push(rect);
            group.add(rect);
        });
    }
    addTopLoops(group: THREE.Group, events: Array<any>, scale: any): void {
        events.forEach(event => {
            const s = scale(event.start);
            if (event.start !== event.end) {
                const e = scale(event.end);
                const rect = ChartFactory.lineAllocate(event.color,
                    new Vector2(e, 0),
                    new Vector2(e, 10),
                    event);
                group.add(rect);
                const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
                const arc = ChartFactory.lineAllocateCurve(event.color,
                    new THREE.Vector2(s, 10),
                    new THREE.Vector2(e, 10),
                    new THREE.Vector2(c, 13)
                );
                group.add(arc);
            }
            const rect = ChartFactory.lineAllocate(event.color,
                new Vector2(s, 0),
                new Vector2(s, 10),
                event);
            group.add(rect);
        });
    }
    addBars(group: THREE.Group, events: Array<any>, scale: any, y: number): void {
        const l = events.length;
        for (let i = 0; i < l; i++) {
            const s = scale(events[i].start);
            const j = i + 1;
            const e = scale(j < l ? events[j].start : events[i].end);
            let width = Math.abs(e - s);
            if (width === 0) { width = 1; }
            const rect = new THREE.Mesh(
                new THREE.PlaneGeometry(width, 2),
                new THREE.MeshBasicMaterial({ color: events[i].color, side: THREE.DoubleSide }));
            rect.position.set(s + (width * 0.5), y, 0);
            rect.userData = events[i];
            this.meshes.push(rect);
            group.add(rect);
        }
    }
    addDurationLine(group: THREE.Group, events: Array<any>, scale: any): void {
        const se = events.reduce((p, c) => {
            p.min = Math.min(p.min, c.start);
            p.max = Math.max(p.max, c.end);
            return p;
        }, { min: Infinity, max: -Infinity });

        const line = ChartFactory.lineAllocate(0x029BE5, new THREE.Vector2(scale(se.min), 0), new THREE.Vector2(scale(se.max), 0));
        group.add(line);
    }

    // #endregion
    addEventBar(): void {

    }

    addObjects(): void {
        this.meshes = [];
        // Line Color
        const w = Math.round(this.view.viewport.width * 0.5);
        const halfW = Math.round(w * 0.5);
        const scale = (this.config.timescale === 'Log') ? scaleLog() : scaleLinear();
        if (this.config.entity === EntityTypeEnum.EVENT) {
            const subtypes: Array<any> = this.data.result.events;
            Object.keys(subtypes).forEach((subtype, i) => {
                const group = new THREE.Group();
                group.userData = subtypes;
                group.position.setY(i * 20);
                this.groups.push(group);
                this.view.scene.add(group);

                // Line Scale
                const line = ChartFactory.lineAllocate(0x029BE5, new THREE.Vector2(-halfW + 20, 0), new THREE.Vector2(halfW - 20, 0));
                group.add(line);

                scale.domain([this.data.result.minMax[subtype].min, this.data.result.minMax[subtype].max]);
                scale.range([-halfW + 20, halfW - 20]);
                this.addTopLoops(group, subtypes[subtype], scale);
            });
        }

        if (this.config.entity === EntityTypeEnum.PATIENT) {
            const patients: Array<any> = this.data.result.events;
            scale.domain([this.data.result.minMax.min, this.data.result.minMax.max]);
            scale.range([-halfW, halfW]);
            patients.forEach((patient, i) => {

                // Create Group To Hold Each Patient
                const group = new THREE.Group();
                group.userData = patient.id;
                group.position.setY(i * 7);
                this.groups.push(group);
                this.view.scene.add(group);

                // this.addDurationLine(group, patient.Status.concat(patient.Treatment), scale);
                //this.addTopLoops(group, patient.Status, scale);
                // this.addTopLoops(group, patient.Treatment, scale);
                // this.addBars(group, patient.Treatment, scale, 0);
                // this.addBars(group, patient.Status, scale, 2);

                // debugger;

            });
        }
    }


    removeObjects(): void {
        this.groups.forEach(group => this.view.scene.remove(group));
    }

    private onMouseMove(e: ChartEvent): void {

        const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (geneHit.length > 0) {

            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            const data = geneHit[0].object.userData.data;
            const tip = Object.keys(data).reduce((p, c) => {
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
            if (this.config.entity === EntityTypeEnum.EVENT) {

                // const pid = geneHit[0].object.userData.p;
                // if (pid === this.activePid) { return; }
                // this.activePid = pid;
                // let pEvents = this.meshes.filter(v => v.userData.p === pid);
                // const pEventsByY = _.groupBy(pEvents, (v) => v.parent.position.y);
                // const pEventsBySubtype = Object.keys(pEventsByY).reduce( (p, c) => { p.push(pEventsByY[c]); return p; }, []);
                // for (var i=0, j=pEventsBySubtype.length-1; i<j; i++) {
                //     pEventsBySubtype[i].forEach( (s, p) => {
                //         pEventsBySubtype[i + 1].forEach( e => {
                //             const line = ChartFactory.lineAllocate( 0xFF0000,
                //                 new THREE.Vector2(s.position.x, i * 20),
                //                 new THREE.Vector2(e.position.x, (i + 1) * 20));
                //             this.view.scene.add(line);
                //             this.onRequestRender.emit( this.config.graph );
                //         });
                //     });

                // }
            }
            return;
        }
        this.labels.innerHTML = '';
    }
    private onMouseUp(e: ChartEvent): void { }
    private onMouseDown(e: ChartEvent): void { }

    constructor() { }

}