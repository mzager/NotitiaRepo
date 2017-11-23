import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents, ChartEvent } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum, DirtyEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { TimelinesDataModel, TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { Subscription } from 'rxjs/Subscription';

export class TimelinesGraph implements ChartObjectInterface {

    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onSelect: EventEmitter<{ type: EntityTypeEnum; ids: string[]; }>;


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
        this.data = data;
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
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
        // this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
        return this;
    }

    destroy() {

    }

    addObjects(): void {

        const w = (this.view.viewport.width * 0.5) - 100;
        const scale = scaleLinear();
        scale.domain([this.data.result.minMax.min,  this.data.result.minMax.max]);
        scale.range([0, w]);

        const geometry = new THREE.PlaneGeometry( 1, 1 );
        // const material = new THREE.MeshBasicMaterial( {color: 0x039BE5, side: THREE.DoubleSide} );

        this.data.result.events.forEach( (v, i) => {
            const group = new THREE.Group();
            group.userData = v.id;
            group.position.setY( i * 2 );

            v.Status.forEach( event => {
                const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: event.color, side: THREE.DoubleSide} ) );
                group.add(plane);
                plane.position.setX( scale(event.start.getTime()) );
            });

            if (v.hasOwnProperty('Treatment')) {
                v.Treatment.forEach( event => {
                    const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: event.color, side: THREE.DoubleSide} ) );
                    group.add(plane);
                    plane.position.setX( scale(event.start.getTime()) );
                });
            }

            this.patientGroups.push(group);
            this.view.scene.add(group);
        });
        this.onRequestRender.emit( this.config.graph);

    }
    removeObjects(): void {

    }

    private onMouseMove(e: ChartEvent): void {

    }

    private onMouseUp(e: ChartEvent): void {

    }

    private onMouseDown(e: ChartEvent): void {

    }
    constructor() { }
}
