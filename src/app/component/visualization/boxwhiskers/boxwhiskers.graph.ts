import { BoxWhiskersConfigModel, BoxWhiskersDataModel } from './boxwhiskers.model';
import { DirtyEnum } from 'app/model/enum.model';
// import { Tween, Easing } from 'es6-tween';
import { Colors, EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { FontFactory } from './../../../service/font.factory';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { ShapeEnum, ColorEnum, GraphEnum, GenomicEnum } from 'app/model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';

export class BoxWhisterksGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{type: GraphConfig}> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    private overMaterial = new THREE.LineBasicMaterial( { color: 0x039BE5 }) ;
    private outMaterial = new THREE.LineBasicMaterial( { color: 0xDDDDDD }) ;


    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: BoxWhiskersDataModel;
    private config: BoxWhiskersConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    private arms: any;
    private chromosomes: any;
    private selector: THREE.Mesh;
    private selectorOrigin: { x: number, y: number, yInit: number };
    private selectorScale: any;
    private group: THREE.Group;
    private lineMaterial;
    private geneLines: Array<THREE.Line>;
    private chords: Array<THREE.Line>;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.geneLines = [];
        this.chords = [];
        this.view.controls.enableRotate = false;
        this.group = new THREE.Group();
        this.view.scene.add(this.group);
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0x039BE5 });
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    update(config: GraphConfig, data: any) {
        this.config = config as BoxWhiskersConfigModel;
        this.data = data;

        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.COLOR) {

            const lines = this.geneLines;
            this.meshes.forEach( v => {
                if (data.pointColor.hasOwnProperty(v.userData.gene)) {
                    const color = data.pointColor[v.userData.gene];
                    (v as THREE.Mesh).material = new THREE.MeshBasicMaterial( {color: color } );
                } else {
                    (v as THREE.Mesh).material = new THREE.MeshBasicMaterial( {color: 0xDDDDDD } );
                }
            });
            lines.forEach( v => {
                if (data.pointColor.hasOwnProperty(v.userData.gene)) {
                    const color = data.pointColor[v.userData.gene];
                    (v as THREE.Line).material = new THREE.LineBasicMaterial( { color: color });
                } else {
                    (v as THREE.Line).material = new THREE.LineBasicMaterial( { color: 0xDDDDDD });
                }
            });
            this.onRequestRender.next();
        }
    }

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
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }

    addObjects() {

        const w = (this.view.viewport.width * 0.5) - 100;
        const scale = scaleLinear();
        scale.domain([this.data.min, this.data.max]);
        scale.range([0, w]);

        this.data.result.forEach( (datum, i) => {
            const y = i * 7;
            const q1 = scale(datum.quartiles[0]);
            const q2 = scale(datum.quartiles[2]);
            const m  = scale(datum.quartiles[1]);
            const boxGeometry = new THREE.PlaneGeometry( q2 - q1, 5);
            const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x039BE5 });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.setX( m  );
            box.position.setY( y );
            this.group.add(box);

            const lineMaterialBlue = new THREE.LineBasicMaterial({ color: 0x039BE5 });
            const lineMaterialWhite = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
            let lineGeometry;
            let line;

            // median
            lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                new THREE.Vector3( scale(datum.median), y - 3, 0 ),
                new THREE.Vector3( scale(datum.median), y + 3, 0 )
            );
            line = new THREE.Line( lineGeometry, lineMaterialWhite );
            this.group.add(line);

            // min
            lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                new THREE.Vector3( scale(datum.min), y - 2, 0 ),
                new THREE.Vector3( scale(datum.min), y + 2, 0 )
            );
            line = new THREE.Line( lineGeometry, lineMaterialBlue );
            this.group.add(line);

            // max
            lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                new THREE.Vector3( scale(datum.max), y - 2, 0 ),
                new THREE.Vector3( scale(datum.max), y + 2, 0 )
            );
            line = new THREE.Line( lineGeometry, lineMaterialBlue );
            this.group.add(line);


            lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                new THREE.Vector3( scale(datum.min), y, 0 ),
                new THREE.Vector3( scale(datum.max), y, 0 )
            );
            line = new THREE.Line( lineGeometry, lineMaterialBlue );
            this.group.add(line);

        });
    }

    removeObjects() {
        while (this.group.children.length) {
            this.group.remove(this.group.children[0]);
        }
        this.meshes = [];
    }

    private onMouseMove(e: ChartEvent): void {

    }

    private onMouseUp(e: ChartEvent): void {

    }

    private onMouseDown(e: ChartEvent): void {

    }

    constructor() { }
}
