import { scaleLinear, scaleLog, InterpolatorFactory, scaleSequential, scaleQuantize, scaleQuantile } from 'd3-scale';
import { interpolateRgb, interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';
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
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import { Subscription } from 'rxjs/Subscription';
import { geoAlbers, active, ScaleLinear } from 'd3';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { Vector3, CubeGeometry, Vector2, OrthographicCamera } from 'three';
import { DataService } from 'app/service/data.service';
// import MeshLine from 'three.meshline';

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

    public patients: Array<THREE.Group>;
    public attrs: THREE.Group;
    public lines: THREE.Group;
    public meshes: Array<THREE.Object3D>;
    public database: string;

    private overlay: HTMLElement;
    private tooltips: HTMLElement;

    // Private Subscriptions
    private sMouseMove: Subscription;

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            if (this.sMouseMove !== undefined) {
                this.sMouseMove.unsubscribe();
            }
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
        this.labels.innerText = '';

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild(this.tooltips);

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild(this.overlay);

        this.events = events;
        this.view = view;

        this.meshes = [];
        this.patients = [];
        this.attrs = new THREE.Group();
        this.lines = new THREE.Group();
        
        this.view.controls.enableRotate = false;
        this.view.controls.reset();
        this.view.controls.maxZoom = 1;
        this.view.controls.pan(0, 1200);
        this.view.controls.dollyOut(3);
        return this;
    }

    destroy() {
        this.removeObjects();
        this.enable(false);
    }

    addTic(event: any, bar: number, barHeight: number, rowHeight: number, group: THREE.Group, scale: ScaleLinear<number, number>): void {
        const s = scale(event.start);
        const e = scale(event.end);
        const w = Math.round(e - s);
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry( (w < 1) ? 1 : w, barHeight * 0.3 ),
            ChartFactory.getColorPhong(event.color)
        );
        const yPos = (rowHeight - (bar * barHeight)) - 2;
        mesh.position.set(s + (w * 0.5), yPos , 0);
        mesh.userData = event;
        group.add(mesh);
        this.meshes.push(mesh);
    }

    addArc(event: any, bar: number, barHeight: number, rowHeight: number, group: THREE.Group, scale: ScaleLinear<number, number>): void {
        if (event.start !== event.end) {
            const s = scale(event.start);
            const e = scale(event.end);
            const w = Math.round(e - s);
            const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
            const yPos = (rowHeight - (bar * barHeight)) - 2;
            const mesh = ChartFactory.lineAllocateCurve(event.color,
                new THREE.Vector2(s, yPos - 2 ),
                new THREE.Vector2(e, yPos - 2 ),
                new THREE.Vector2(c, yPos + 2)
            );
            // mesh.material =  new MeshLineMaterial({
            //     color: new THREE.Color(0x90caf9),
            //     lineWidth: 2,
            // });
            mesh.userData = event;
            group.add(mesh);
            this.meshes.push(mesh);
        } else {
            const s = scale(event.start);
            const yPos = (rowHeight - (bar * barHeight)) - 2;
            const mesh = ChartFactory.lineAllocate(event.color, new Vector2(s, yPos - 2), new Vector2(s, yPos + 2))
            mesh.userData = event;
            group.add(mesh);
            this.meshes.push(mesh);
            // this.addTic(event, bar, barHeight, barHeight, group, scale);
        }
    }

    addSymbol(event: any, bar: number, barHeight: number, rowHeight: number, group: THREE.Group, scale: ScaleLinear<number, number>): void {
        const s = scale(event.start);
        const e = scale(event.end);
        const w = Math.round(e - s);
        const mesh = new THREE.Mesh(
            new THREE.CircleGeometry(1.6, 20),
            ChartFactory.getColorPhong(event.color)
        );
        const yPos = (rowHeight - (bar * barHeight)) - 2;

        mesh.position.set(s, yPos, 1);
        mesh.userData = event;
        group.add(mesh);
        this.meshes.push(mesh);

        if (event.start !== event.end) {
            const triangleGeometry = new THREE.Geometry();
            triangleGeometry.vertices.push(new THREE.Vector3( 0.0,  1.8,  0.0));
            triangleGeometry.vertices.push(new THREE.Vector3(-1.8, -1.8, 0.0));
            triangleGeometry.vertices.push(new THREE.Vector3( 1.8, -1.8, 0.0));
            triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
            const triangle = new THREE.Mesh(triangleGeometry, ChartFactory.getColorBasic(event.color));
            triangle.userData = event;
            triangle.position.set(scale(event.end), yPos, 0);
            group.add(triangle);
            this.meshes.push(triangle);
        }
    }
    addAttrs(rowHeight, rowCount, pidMap): void {
        const d = this.data;
        this.data.result.attrs.pids.forEach( (pid, pidIndex) => {
            const rowIndex = pidMap[pid];
            const yPos = (rowHeight * rowIndex) - (rowHeight * -0.5);
            this.data.result.attrs.attrs.forEach( (attr, attrIndex) => {
                const value = attr.values[pidIndex].label;
                const color = attr.values[pidIndex].color;
                const xPos = -500 - (attrIndex * rowHeight);
                const mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry( rowHeight - 2, rowHeight - 2 ),
                    ChartFactory.getColorPhong(color)
                );
                mesh.position.set(xPos - (rowHeight * 0.5) - 1, yPos , 0);
                mesh.userData = { data : {
                    type: 'attr',
                    field: attr.prop.replace(/_/gi, ' '),
                    value: (value !== null) ? value.toString() : 'NA' } };
                this.attrs.add(mesh);
                this.meshes.push(mesh);
            });
        });
        this.view.scene.add(this.attrs);
    }

    addLines(rowHeight, rowCount): void {
        const chartHeight = rowHeight * rowCount;
        for (let i = -500; i <= 500; i += 50) {
            const line = ChartFactory.lineAllocate(0xDDDDDD, new THREE.Vector2(i, chartHeight), new THREE.Vector2(i, 0));
            this.lines.add(line);
        }
        for (let i = 0; i < rowCount + 1; i++) {
            const line = ChartFactory.lineAllocate(0xDDDDDD, new THREE.Vector2(-500, i * rowHeight), new THREE.Vector2(500, i * rowHeight));
            this.lines.add(line);
        }
        this.view.scene.add(this.lines);
    }

    // #endregion
    addObjects(): void {

        // Helper Variables
        const bars = this.config.bars;
        let pts: Array<any> = this.data.result.patients;
        pts = Object.keys(pts).map(v => pts[v]);

        const barHeight = 4; //bars.reduce( (p,c) => p = Math.max(p, c.row), -Infinity) + 1;
        const barLayout = bars.filter(v => v.style  !== 'None').sort( (a, b) => a.z - b.z).sort( (a, b) => a.row - b.row);
        let track = -1;
        let lastRow = -1;
        for (let i = 0; i < barLayout.length; i++) {
            const bar = barLayout[i];
            if (bar.row !== lastRow) {
                lastRow = bar.row;
                track += 1;
            }
            bar.track = track;
        }
        const rowHeight = (track + 1) * barHeight;
        const rowCount = pts.length;

        // Grid
        this.addLines(rowHeight, rowCount);

        // Scale
        const scale = scaleLinear();
        // - (this.data.result.minMax.max * .7)
        scale.domain([this.data.result.minMax.min, this.data.result.minMax.max]);
        scale.range([-500, 500]);

        // Patients + PID MAP
        const pidMap: any = {};
        pts.forEach( (patient, i) => {
            pidMap[patient[0].p] = i;
            const group = new THREE.Group();
            this.patients.push(group);
            this.view.scene.add(group);
            group.position.setY(i * rowHeight);
            barLayout.forEach( bl => {
                const barEvents = patient.filter( p => p.type === bl.label);
                barEvents.forEach(event => {
                    event.data.type = 'event';
                    switch (bl.style) {
                        case TimelinesStyle.NONE:
                            break;
                        case TimelinesStyle.ARCS:
                            this.addArc(event, bl.track, barHeight, rowHeight, group, scale);
                            break;
                        case TimelinesStyle.TICKS:
                            this.addTic(event, bl.track, barHeight, rowHeight, group, scale);
                            break;
                        case TimelinesStyle.SYMBOLS:
                            this.addSymbol(event, bl.track, barHeight, rowHeight, group, scale);
                            break;
                    }
                });
            });
        });

        // Attributes
        this.addAttrs(rowHeight, rowCount, pidMap);

        // Reset Controls
        this.view.controls.reset();
        requestAnimationFrame( () => {
            console.log(rowHeight * rowCount);
            this.view.controls.pan(0, (rowHeight * rowCount) );
            this.view.controls.dollyOut(3);
            this.view.controls.update();
        });
    }

    removeObjects(): void {
        this.patients.forEach(patient => this.view.scene.remove(patient));
        this.view.scene.remove(this.attrs);
        this.view.scene.remove(this.lines);
        this.meshes = [];
        this.patients = [];
        this.attrs = new THREE.Group();
        this.lines = new THREE.Group();
    }

    private onMouseMove(e: ChartEvent): void {
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);

        if (hit.length > 0) {

            if (hit[0].object.userData === undefined) {
                return;
            }
            try {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                const data = hit[0].object.userData.data;
                if (data.type === 'event') {
                    const tip = Object.keys(data).reduce((p, c) => {
                        if (c !== 'type') {
                            if (data[c].trim().length > 0) {
                                p += '<nobr>' + c + ': ' + data[c].toLowerCase() + '</nobr><br />';
                            }
                        }
                        return p;
                    }, '<span style="font-weight:700;font-size:1rem;color:#FFF;">' + hit[0].object.userData.subtype + '</span><br />');
                    this.tooltips.innerHTML = '<div style="width:auto;background:rgba(0,0,0,.8);font-size:.9rem;color:#DDD;padding:5px;border-radius:' +
                        '3px;z-index:9999;position:absolute;left:' +
                        xPos + 'px;top:' +
                        yPos + 'px;">' +
                        tip + '</div>';
                }
                if (data.type === 'attr') {
                    const tip = data.field + ': ' + data.value;
                    this.tooltips.innerHTML = '<div style="width:auto;background:rgba(255,255,255,.8);color:#000;' +
                    'padding:5px;border-radius:3px;z-index:9999;position:absolute;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    tip + '</div>';
                }
            } catch (e) {
                console.log(e);
            }

            return;
        }
        this.tooltips.innerHTML = '';
    }
   
    constructor() { }
}
