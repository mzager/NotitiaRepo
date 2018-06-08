import { EventEmitter } from '@angular/core';
import { DirtyEnum, GraphEnum } from 'app/model/enum.model';
import { Subscription } from 'rxjs/Subscription';
import * as THREE from 'three';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { DataDecorator } from './../../../model/data-map.model';
// import { Tween, Easing } from 'es6-tween';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { ParallelCoordsConfigModel, ParallelCoordsDataModel } from './parallelcoords.model';

export class ParallelCoordsGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
    private events: ChartEvents;
    private view: VisualizationView;
    private data: ParallelCoordsDataModel;
    private config: ParallelCoordsConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    public decorators: DataDecorator[];
    private group: THREE.Group;
    private lineMaterial;
    private geneLines: Array<THREE.Line>;
    private chords: Array<THREE.Line>;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        // this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.geneLines = [];
        this.chords = [];
        this.view.controls.enableRotate = true;
        this.group = new THREE.Group();
        this.view.scene.add(this.group);
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x039BE5 });
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }
    updateDecorator() {
        throw new Error('Method not implemented.');
    }
    updateData(config: GraphConfig, data: any) {
        this.config = config as ParallelCoordsConfigModel;
        this.data = data;
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.COLOR) {

            const lines = this.geneLines;
            this.meshes.forEach(v => {
                if (data.pointColor.hasOwnProperty(v.userData.gene)) {
                    const color = data.pointColor[v.userData.gene];
                    (v as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: color });
                } else {
                    (v as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: 0xDDDDDD });
                }
            });
            lines.forEach(v => {
                if (data.pointColor.hasOwnProperty(v.userData.gene)) {
                    const color = data.pointColor[v.userData.gene];
                    (v as THREE.Line).material = new THREE.LineBasicMaterial({ color: color });
                } else {
                    (v as THREE.Line).material = new THREE.LineBasicMaterial({ color: 0xDDDDDD });
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
    preRender() {

    }


    addObjects() {
        const genes = this.data.genes;
        const links = this.data.links;

        genes.forEach(gene => {
            // const mesh = ChartFactory.meshAllocate(0xC0DDC0, ShapeEnum.SQUARE, .5, new THREE.Vector3(gene.x, gene.y, 0), gene);
            // (mesh.geometry as Rect)

            const geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(gene.sPos.x, gene.sPos.y, 0));
            geometry.vertices.push(new THREE.Vector3(gene.ePos.x, gene.ePos.y, 0));

            const geo = new THREE.BoxGeometry(1, 1, 1);
            const mat = new THREE.MeshBasicMaterial({ color: 0x039BE5 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.userData = gene;
            mesh.position.x = gene.sPos.x;
            mesh.position.y = gene.sPos.y;

            const geneLine = new THREE.Line(geometry, this.lineMaterial);
            geneLine.userData = gene;
            this.meshes.push(mesh);
            this.geneLines.push(geneLine);
            this.group.add(geneLine);
            this.group.add(mesh);
        });

        links.forEach((link) => {

            // Adjust Height According To Size - So the tall ones project out both from the ring and also from the center
            // const curve = new THREE.CatmullRomCurve3( [
            //     new THREE.Vector3( link.sPos.x, link.sPos.y, 0 ),
            //     new THREE.Vector3( 0, 30, 100 ),
            //     new THREE.Vector3( link.tPos.x, link.tPos.y, 0 ),
            // ] );
            // curve.type = 'catmullrom';
            // curve.tension = 0.9; //link.tension; // * 0.1; //0.9;

            // const curve = new THREE.CubicBezierCurve3(
            //     new THREE.Vector3( link.sPos.x, link.sPos.y, 0 ),
            //     new THREE.Vector3( 0, 0, 0 ),
            //     new THREE.Vector3( 0, 0, 0 ),
            //     new THREE.Vector3( link.tPos.x, link.tPos.y, 0 )
            // );

            // const curve = new THREE.LineCurve3(
            //     new THREE.Vector3( link.sPos.x, link.sPos.y, 0 ),
            //     new THREE.Vector3( link.tPos.x, link.tPos.y, 0 )
            // );

            let curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(link.sPos.x, link.sPos.y, 0),
                new THREE.Vector3(0, 0, 100),
                new THREE.Vector3(link.tPos.x, link.tPos.y, 0),
            );

            const geometry = new THREE.Geometry();
            link.overGeometry = geometry.vertices = curve.getPoints(50);

            curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(link.sPos.x, link.sPos.y, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(link.tPos.x, link.tPos.y, 0),
            );
            link.outGeometry = geometry.vertices = curve.getPoints(50);


            const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xDDDDDD }));
            line.userData = link;

            this.chords.push(line);
            this.group.add(line);
        });

    }

    removeObjects() {
        while (this.group.children.length) {
            this.group.remove(this.group.children[0]);
        }
        this.meshes = [];
    }



    private onMouseMove(): void {
    }

    private onMouseUp(): void {

    }

    private onMouseDown(): void {

    }

    showLabels() {

    }

    hideLabels() {
        // this.labels.innerHTML = '';
    }


    constructor() { }
}
