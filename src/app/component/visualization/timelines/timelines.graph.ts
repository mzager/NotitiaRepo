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

export class TimelinesGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{type: GraphConfig}> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: TimelinesDataModel;
    private config: TimelinesConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    public patientGroups: Array<THREE.Group>;
    public group: THREE.Group;

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
        if (this.config.dirtyFlag & DirtyEnum.OPTIONS) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.data = data;
            this.removeObjects();
            this.addObjects();
        }
    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {

        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.patientGroups = [];

        this.view.controls.enableRotate = false;
        this.group = new THREE.Group();
        this.view.scene.add(this.group);
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    addObjects(): void {
        const w = (this.view.viewport.width * 0.5);

        const scale = (this.config.timescale === 'Log') ? scaleLog() : scaleLinear();
        scale.domain([this.data.result.minMax.min,  this.data.result.minMax.max]);
        scale.range([0, w]);

        this.data.result.events.forEach( (v, i) => {

            const group = new THREE.Group();
            group.userData = v.id;
            group.position.setY( i * 3 );

            if (v.hasOwnProperty('Status')) {
                v.Status.forEach( (event, j) => {
                    const xStart = Math.floor(scale(event.start));
                    const xEnd = (v.Status.length > j + 1) ? Math.floor(scale(v.Status[j + 1].start)) : xStart + 1;
                    let width = xEnd - xStart;
                    if (width === 0) {width = 1; }
                    const mesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(width, 2),
                        new THREE.MeshBasicMaterial( {color: event.color, side: THREE.DoubleSide} ) );
                    mesh.position.setX( xStart + (width * 0.5));
                    if (width === 1) { mesh.position.setZ(0.1); }
                    mesh.userData = event.data;
                    this.meshes.push(mesh);
                    group.add(mesh);
                });
            }
            if (v.hasOwnProperty('Treatment')) {
                v.Treatment.forEach( event => {
                    let pos;
                    let mesh;
                    if (event.start !== event.end) {
                        pos  = new Vector3(
                            Math.floor( scale( event.end ) ),
                            0, 2);
                        mesh = ChartFactory.meshAllocate(event.color, ShapeEnum.CIRCLE, .3, pos, event.data );
                    } else {
                        pos = new Vector3(
                            Math.floor( scale( event.start ) ),
                            0, 2);
                        mesh = ChartFactory.meshAllocate(event.color, ShapeEnum.SQUARE, .3, pos, event.data );
                    }
                    this.meshes.push(mesh);
                    group.add(mesh);
                });
            }

            this.patientGroups.push(group);
            this.view.scene.add(group);
        });
        this.onRequestRender.emit( this.config.graph);
        this.enable(true);

    }
    removeObjects(): void {
        this.meshes.forEach(v => {
            ChartFactory.meshRelease(v as THREE.Mesh);
            this.view.scene.remove(v);

        });
        this.meshes.length = 0;
        this.patientGroups.forEach(v => {
            this.view.scene.remove(v);
        });
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

    private onMouseUp(e: ChartEvent): void {

    }

    private onMouseDown(e: ChartEvent): void {

    }
    constructor() { }
}
