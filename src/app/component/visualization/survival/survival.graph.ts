import { ChartFactory } from './../../workspace/chart/chart.factory';
import { SurvivalConfigModel, SurvivalDataModel } from './survival.model';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { GraphConfig } from 'app/model/graph-config.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { Vector2, Shape, ShapeGeometry, MeshPhongMaterial, Mesh, DoubleSide, Line, LineBasicMaterial, BufferGeometry, Vector3, Group } from 'three';

export class SurvivalGraph implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    public meshes: Array<THREE.Mesh>;
    config: SurvivalConfigModel;
    data: SurvivalDataModel;
    private view: VisualizationView;
    private grid: Group;
    private curves: Group;
    private isEnabled: boolean;

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
    }
    update(config: GraphConfig, data: any) {
        this.config = config as SurvivalConfigModel;
        this.data = data.result;

        this.removeObjects();
        this.addObjects();
    }

    removeObjects(): void {

    }

    drawGrid(): void {
        for (let x = -500; x <= 500; x += 100) {
            const line = ChartFactory.lineAllocate(0xDDDDDD, new Vector2(x, -500), new Vector2(x, 500));
            this.grid.add(line);
        }
        for (let y = -500; y <= 500; y += 100) {
            const line = ChartFactory.lineAllocate(0xDDDDDD, new Vector2(-500, y), new Vector2(500, y));
            this.grid.add(line);
        }
    }

    addObjects(): void {

        if (this.data.cohorts === undefined) {
            return;
        }
        debugger

        const cohort = this.data.cohorts[0];
        
        const xScale = scaleLinear().range([-500, 500]).domain(cohort.timeRange);
        const yScale = scaleLinear().range([-500, 500]).domain([0, 1]);
        let pts: Array<Vector2>;

        const shape = new Shape();
        shape.autoClose = false;
        shape.moveTo( -500, -500 );
        cohort.confidence.lower.forEach(pt => { 
            shape.lineTo(xScale(pt[0]), yScale(pt[1]))
        });
        cohort.confidence.upper.reverse().forEach(pt => { 
            shape.lineTo(xScale(pt[0]), yScale(pt[1]))
        });


        const geometry = new ShapeGeometry(shape);
        const material = new MeshPhongMaterial( { color: 0xbbdefb } );
        material.opacity = 0.5;
        material.transparent = true;
        const mesh = new Mesh( geometry, material);
        this.curves.add( mesh );
				

        // pts = cohort.confidence.upper.map(v => new Vector2(xScale(v[0]), yScale(v[1])));
        // this.curves.add(ChartFactory.linesAllocate(0x2196f3, pts, {}));

        pts = cohort.result.map(v => new Vector2(xScale(v[0]), yScale(v[1])));
        this.curves.add(ChartFactory.linesAllocate(0x1a237e, pts, {}));

        // pts = cohort.confidence.lower.map(v => new Vector2(xScale(v[0]), yScale(v[1])));
        // this.curves.add(ChartFactory.linesAllocate(0x2196f3, pts, {}));

        // shape.autoClose = true;
        // const geometry = new ShapeBufferGeometry( shape );
		// const mesh = new Mesh( geometry, new MeshPhongMaterial( { color: 0xFF0000, side: DoubleSide } ) );

    }
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.view = view;
        this.view.controls.enableRotate = false;
        this.grid = new Group();
        this.drawGrid();
        this.view.scene.add(this.grid);
        this.curves = new Group();
        this.view.scene.add(this.curves);
        return this;
    }
    destroy() {
        this.view.scene.remove(this.grid);
        this.view.scene.remove(this.curves);
    }

    constructor() { }
}
;
