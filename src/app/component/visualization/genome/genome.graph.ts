import { LabelController } from './../../../util/label/label.controller';
import { ChromosomeDataModel } from './../chromosome/chromosome.model';
import { AbstractVisualization } from './../visualization.abstract.component';
import { DataDecorator } from './../../../model/data-map.model';
// import { Tween, Easing } from 'es6-tween';
import { Colors, EntityTypeEnum, WorkspaceLayoutEnum, DirtyEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { ShapeEnum, ColorEnum, GraphEnum, GenomicEnum } from 'app/model/enum.model';
import { ChartFactory, DataDecoatorRenderer } from './../../workspace/chart/chart.factory';
import { GenomeConfigModel, GenomeDataModel } from './genome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import * as TWEEN from 'tween.js';
import { ChromosomeConfigModel } from 'app/component/visualization/chromosome/chromosome.model';
import { DataTable } from 'app/model/data-field.model';
import { Group, Vector3, Object3D } from 'three';

export class GenomeGraph extends AbstractVisualization {

    public set data(data: GenomeDataModel) { this._data = data; }
    public get data(): GenomeDataModel { return this._data as GenomeDataModel; }
    public set config(config: GenomeConfigModel) { this._config = config; }
    public get config(): GenomeConfigModel { return this._config as GenomeConfigModel; }

    public meshes: THREE.Object3D[] = [];
    private points: Array<THREE.Object3D>;
    public tads: Array<THREE.Object3D> = [];
    public chromosomes: Array<THREE.Object3D> = [];
    public meres: Array<THREE.Object3D> = [];
    public bands: Array<THREE.Object3D> = [];

    public renderer: DataDecoatorRenderer = (group: THREE.Group, mesh: THREE.Sprite, decorators: Array<DataDecorator>,
        i: number, count: number): void => {
        mesh.position.setX(-2);
        const lineMat = new THREE.LineBasicMaterial({ color: mesh.material.color.getHex() });
        const lineGeom = new THREE.Geometry();
        lineGeom.vertices.push(
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 0, 0)
        );
        const line = new THREE.Line(lineGeom, lineMat);
        group.add(line);
    }

    chromosomeToNumber(chromosome: string, x: boolean = true): number {
        let rv = parseInt(chromosome, 10);
        if (isNaN(rv)) { rv = (chromosome.toLowerCase() === 'x') ? 23 : 24; }
        return (x) ? rv * 20 : rv;
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer);
        this.onShowLabels();
    }
    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects();
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        return this;
    }
    destroy() {
        super.destroy();
        this.removeChromosomes();
        this.removeTads();
        this.removeGenes();
    }
    enable(truthy: boolean) {
        super.enable(truthy);
    }

    preRender(views: VisualizationView[], layout: WorkspaceLayoutEnum, renderer: THREE.Renderer): void {
        super.preRender(views, layout, renderer);
    }
    addObjects() {
        if (this.chromosomes.length === 0) { this.addChromosomes(); }
        if (this.config.showTads) { this.addTads(); }
        this.addGenes();
    }
    removeObjects() {
        if (!this.config.showTads) { this.removeTads(); }
        this.removeGenes();
    }
    addChromosomes() {
        const data = this.data;
        data.chromo.forEach(chromosome => {
            const xPos = this.chromosomeToNumber(chromosome.chr);

            // Centromere
            const centro: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5, new THREE.Vector3(xPos, 0, 0), {});
            centro.userData.tooltip = chromosome.chr; //'Centromere ' + chromosome.chr;
            this.meres.push(centro);
            this.view.scene.add(centro);

            // Tele Q
            const teleQ: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(xPos, chromosome.Q - chromosome.C, 0), {});
            teleQ.userData.chr = chromosome.chr;
            teleQ.userData.type = GenomicEnum.Q_TELOMERE;
            teleQ.userData.tooltip = 'Q' + chromosome.chr; //Telemere
            this.meres.push(teleQ);
            this.view.scene.add(teleQ);

            // Tele P
            const teleP: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(xPos, chromosome.P - chromosome.C, 0), {});
            teleP.userData.chr = chromosome.chr;
            teleP.userData.type = GenomicEnum.P_TELOMERE;
            teleP.userData.tooltip = 'P' + chromosome.chr; //Telemere
            this.meres.push(teleP);
            this.view.scene.add(teleP);
        });

        data.bands.forEach((band, i) => {
            let yPos = 0;
            const xPos = (i + 1) * 20;
            band.forEach((cyto) => {
                const centro = data.chromo[i].C;
                const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.5, cyto.l);
                const material: THREE.Material = ChartFactory.getColorPhong(cyto.c);
                const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
                mesh.userData.type = GenomicEnum.CYTOBAND;
                mesh.position.set(xPos, (yPos + (cyto.l / 2)) - centro, 0);
                mesh.userData.tooltip = cyto.chr + cyto.arm.toLowerCase() +
                    ((cyto.subband) ? '.' + cyto.subband : '') + ' | ' + cyto.tag.replace('neg', '-').replace('pos', '+');
                yPos += cyto.l;
                this.bands.push(mesh);
                this.view.scene.add(mesh);
            });
        });
    }
    addTads() {
        const data = this.data;
        data.tads.forEach(tad => {
            const chr = this.chromosomeToNumber(tad.chr, false);
            const xPos = chr * 20;
            const centro = data.chromo[chr - 1].C;
            const line = ChartFactory.lineAllocateCurve(
                0x9c27b0,
                new THREE.Vector2(xPos, tad.s - centro),
                new THREE.Vector2(xPos, tad.e - centro),
                new THREE.Vector2(
                    xPos + (20 * 0.2),
                    (Math.abs(tad.e - tad.s) * 0.5) + tad.s - centro
                )
            );
            this.tads.push(line);
            this.view.scene.add(line);
        });
    }
    addGenes() {
        const data = this.data;
        Object.keys(data.genes).forEach(chromosome => {
            const chr = this.chromosomeToNumber(chromosome, false);
            const xPos = chr * 20;
            const centro = data.chromo[chr - 1].C;
            data.genes[chromosome].forEach(gene => {
                const group = ChartFactory.createDataGroup(gene.gene, EntityTypeEnum.GENE,
                    new Vector3(xPos, gene.tss - centro, 0));
                this.meshes.push(group);
                this.view.scene.add(group);
            });
        });
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer);
        this.points = this.meshes.map(v => v.children[0]);
    }
    removeChromosomes() {
        this.view.scene.remove(... this.chromosomes);
        this.view.scene.remove(... this.meres);
        this.view.scene.remove(... this.bands);
        this.chromosomes.length = 0;
        this.meres.length = 0;
        this.bands.length = 0;
    }
    removeTads() {
        this.view.scene.remove(...this.tads);
        this.tads.length = 0;
    }
    removeGenes() {
        this.view.scene.remove(...this.meshes);
        this.meshes.length = 0;
    }

    onShowLabels(): void {
        const zoom = this.view.camera.position.z;
        if (zoom > 600) {
            this.tooltips.innerHTML = this.labelController.generateLabels(this.meres, this.view, 'PIXEL');
        } else if (zoom > 500) {
            this.tooltips.innerHTML = this.labelController.generateLabels(this.bands, this.view, 'PIXEL');
        } else {
            this.tooltips.innerHTML = this.labelController.generateLabels(this.meshes, this.view, 'FORCE', { align: 'RIGHT' });
        }
    }

}
