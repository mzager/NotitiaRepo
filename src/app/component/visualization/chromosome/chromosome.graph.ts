import { Colors, EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import TWEEN from 'tween.js';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { FontFactory } from './../../../service/font.factory';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { ShapeEnum, ColorEnum, GraphEnum } from 'app/model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { ChromosomeConfigModel, ChromosomeDataModel } from './chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';

export class ChromosomeGraph implements ChartObjectInterface {

    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();

    // Chart Elements
    private labels: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: ChromosomeDataModel;
    private config: ChromosomeConfigModel;
    private isEnabled: boolean;

    // Objects
    public meshes: Array<THREE.Mesh>;
    private arms: any;
    private selector: THREE.Mesh;
    private selectorOrigin: { x: number, y: number, yInit: number };
    private selectorScale: any;
    private group: THREE.Group;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.arms = {};
        this.meshes = [];
        this.selector = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1, 1, 10),
            new THREE.MeshStandardMaterial({ color: 0xEEEEEE, opacity: 0.7, transparent: true }));
        this.view.controls.enableRotate = true;
        this.group = new THREE.Group();
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }

    update(config: GraphConfig, data: any) {
        this.config = config as ChromosomeConfigModel;
        this.data = data;
        this.removeObjects();
        this.addObjects();
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
        const chromoMultiplier = 15;
        const chromoOffset = 12 * chromoMultiplier;

        this.arms = {};
        for (let i = 0; i < this.data.chromo.length; i++) {
            this.arms[i + 'P'] = new THREE.Group();
            this.arms[i + 'Q'] = new THREE.Group();
            this.arms[i + 'P'].position.setX(i * chromoMultiplier - chromoOffset);
            this.arms[i + 'Q'].position.setX(i * chromoMultiplier - chromoOffset);
            this.group.add(this.arms[i + 'P']);
            this.group.add(this.arms[i + 'Q']);
        }

        if (this.config.chromosomeOption === 'Centromeres & Telemeres') {

            const barMaterial = new THREE.LineBasicMaterial({ color: 0x0091EA, linewidth: 5 });
            this.data.chromo.forEach((v, i) => {

                const pGeo = new THREE.Geometry();
                pGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                pGeo.vertices.push(new THREE.Vector3(0, v.P - v.C, 0));
                const pLine = new THREE.Line(pGeo, barMaterial);
                pLine.userData.tip = (i + 1) + 'q';
                this.arms[i + 'P'].add(pLine);

                const qGeo = new THREE.Geometry();
                qGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                qGeo.vertices.push(new THREE.Vector3(0, v.Q - v.C, 0));
                const qLine = new THREE.Line(qGeo, barMaterial);
                qLine.userData.tip = (i + 1) + 'q';
                this.arms[i + 'Q'].add(qLine);

                const shape = ChartFactory.getShape(ShapeEnum.CIRCLE);
                shape.scale(.5, .5, .5);
                const color = ChartFactory.getColorPhong(0x0091EA);

                const centromere = new THREE.Mesh(shape, color);
                centromere.position.set(0, v.C - v.C, 0);
                this.arms[i + 'P'].add(centromere);
                centromere.userData.tip = (i + 1) + ' Centromere';

                const telemereQ = new THREE.Mesh(shape, color);
                telemereQ.position.set(0, v.Q - v.C, 0);
                telemereQ.userData.tip = (i + 1) + 'q Telemere';
                this.arms[i + 'Q'].add(telemereQ);

                const telemereP = new THREE.Mesh(shape, color);
                telemereP.position.set(0, v.P - v.C, 0);
                telemereP.userData.tip = (i + 1) + 'p Telemere';
                this.arms[i + 'P'].add(telemereP);
            });
        }

        if (this.config.chromosomeOption === 'Cytobands') {
            this.data.bands.forEach((chromo, i) => {
                const centro = this.data.chromo[i].C;
                let yPos = 0;
                chromo.forEach((band, j) => {
                    const geometry: THREE.CylinderGeometry =
                        new THREE.CylinderGeometry(
                            (band.tag === 'acen' && band.arm === 'P') ? 0 : .5,
                            (band.tag === 'acen' && band.arm === 'Q') ? 0 : .5,
                            band.l);
                    const material: THREE.Material = ChartFactory.getColorMetal(band.c);
                    // new THREE.MeshStandardMaterial({ color: band.c, metalness: 0.4, roughness: 0, shading: THREE.SmoothShading });
                    const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, (yPos + (band.l / 2)) - centro, 0);
                    mesh.userData.tip = band.chr + band.arm.toLowerCase() + band.band +
                        ((band.subband) ? '.' + band.subband : '') + ' | ' + band.tag.replace('neg', '-').replace('pos', '+');
                    this.arms[i + band.arm].add(mesh);
                    yPos += band.l;
                });
            });
        }

        // Genes
        Object.keys(this.data.genes).forEach(chromo => {
            const chromoIndex: number = (chromo === 'X') ? 23 : (chromo === 'Y') ? 24 : parseInt(chromo, 10);
            const genes = this.data.genes[chromo];
            const centro = this.data.chromo[chromoIndex - 1].C;
            genes.filter((v) => v.color !== 0xFFFFFF)
                .forEach(gene => {
                    const shape = new THREE.BoxGeometry(13, 1, 13); //THREE.CylinderGeometry(3, 3, 1, 6);
                    const color = ChartFactory.getColorPhong(gene.color);
                    const mesh = new THREE.Mesh(shape, color);
                    mesh.position.x = ((chromoIndex - 1) * chromoMultiplier - chromoOffset);
                    mesh.position.y = (gene.tss - centro);
                    mesh.position.z = 0;
                    mesh.userData.id = gene.gene;
                    mesh.userData.tip = gene.gene +
                        ' | x̅ ' + (Math.round(100 * gene.mean) / 100) +
                        ' σx̅ ' + (Math.round(100 * gene.meandev) / 100);
                    this.meshes.push(mesh);
                    this.group.add(mesh);
                });
        });

        this.group.rotateX(Math.PI); // Flip View
        this.view.scene.add(this.group);
    }

    removeObjects() {
        while (this.group.children.length) {
            this.group.remove(this.group.children[0]);
        }
        this.view.scene.remove(this.group);
    }

    private onMouseMove(e: ChartEvent): void {
        if (!this.view.controls.enabled) {
            const mouseEvent: MouseEvent = e.event as MouseEvent;
            const vector = new THREE.Vector3();
            vector.set((mouseEvent.clientX / window.innerWidth) * 2 - 1,
                - (mouseEvent.clientY / window.innerHeight) * 2 + 1,
                0.5);
            vector.unproject(this.view.camera);
            const dir = vector.sub(this.view.camera.position).normalize();
            const distance = - this.view.camera.position.z / dir.z;
            const pos = this.view.camera.position.clone().add(dir.multiplyScalar(distance));
            const height = - (this.selectorOrigin.yInit - pos.y);
            const center = this.selectorOrigin.yInit + height * 0.5;
            this.selector.scale.set(3, height, 3);
            this.selector.position.setY(center);
            this.onRequestRender.next();
        } else {
            this.molabels(e);
        }
    }

    private onMouseUp(e: ChartEvent): void {
        if (!this.view.controls.enabled) {
            const box = new THREE.Box3();
            box.setFromObject(this.selector);
            const ids = this.meshes
                .filter(v => {
                    const x = v.position.clone();
                    x.setY(-x.y);
                    return box.containsPoint(x);
                })
                .map(v => v.userData.id);
            this.onSelect.next({ type: EntityTypeEnum.GENE, ids: ids });
            this.view.scene.remove(this.selector);
            this.view.controls.enabled = true;
            this.onRequestRender.next();
        }
    }
    private onMouseDown(e: ChartEvent): void {
        const intersects = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (intersects.length > 0) {
            this.view.controls.enabled = false;
            const mouseEvent: MouseEvent = e.event as MouseEvent;
            this.selectorOrigin = { x: mouseEvent.clientX, y: mouseEvent.clientY, yInit: - intersects[0].object.position.y };
            this.selectorScale = scale.scaleLinear();
            this.selectorScale.range([1, 100]);
            this.selectorScale.domain([0, this.view.viewport.height]);
            const targetPosition: THREE.Vector3 = intersects[0].object.position.clone();
            this.selector.scale.set(5, 5, 5);
            this.selector.position.set(targetPosition.x, -targetPosition.y, targetPosition.z);
            this.view.scene.add(this.selector);
        }
    }

    showLabels() {
        const meshes = ChartUtil.getVisibleMeshes(this.view).map<{ label: string, x: number, y: number }>(mesh => {
            const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
                this.view.viewport.width, this.view.viewport.height);
            return { label: mesh.userData.tip, x: coord.x + 40, y: coord.y - 10 };
        });
        const html = meshes.map(data => {
            return '<div class="chart-label" style="font-size:12px;left:' + data.x + 'px;top:' + data.y +
                'px;position:absolute;">' + data.label + '</div>';
        }).reduce((p, c) => p += c, '');
        this.labels.innerHTML = html;
    }

    hideLabels() {
        this.labels.innerHTML = '';
    }

    // // Events
    private molabels(e: ChartEvent): void {

        let hits;
        const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
        if (geneHit.length > 0) {
            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            this.labels.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                geneHit[0].object.userData.tip + '</div>';
            return;
        }

        const keys: Array<string> = Object.keys(this.arms);
        for (let i = 0; i < keys.length; i++) {
            const kids = this.arms[keys[i]].children;
            hits = ChartUtil.getIntersects(this.view, e.mouse, kids);
            if (hits.length > 0) {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                this.labels.innerHTML = '<div style="background:rgba(255,255,255,.8);padding:3px;border-radius:3px;' +
                    'z-index:9999;position:absolute;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    hits[0].object.userData.tip + '</div>';
                break;
            } else {
                this.labels.innerHTML = '';
            }
        }
    }

    constructor() { }
}
