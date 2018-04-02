import { MeshLine } from 'three.meshline';
import { scaleLinear, ScaleContinuousNumeric } from 'd3-scale';
import { GraphEnum } from 'app/model/enum.model';
import { EventEmitter } from '@angular/core';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import * as THREE from 'three';
import { SurvivalDataModel, SurvivalConfigModel, SurvivalDatumModel } from './survival.model';
import { Vector2, Shape, ShapeGeometry, MeshPhongMaterial, Mesh } from 'three';

export class SurvivalGraph extends AbstractVisualization {

    public set data(data: SurvivalDataModel) { this._data = data; }
    public get data(): SurvivalDataModel { return this._data as SurvivalDataModel; }
    public set config(config: SurvivalConfigModel) { this._config = config; }
    public get config(): SurvivalConfigModel { return this._config as SurvivalConfigModel; }

    public lines: Array<THREE.Line>;
    public confidences: Array<THREE.Mesh>;
    public grid: Array<THREE.Object3D>;

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.confidences = []
        this.meshes = [];
        this.lines = [];
        this.grid = [];
        // this.view.camera.position.setZ(5000);
        // this.view.camera.position.setX(-350);
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    updateData(config: GraphConfig, data: any): void {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean): void {
        super.enable(truthy);
        this.view.controls.enableRotate = false;
    }

    addObjects(type: EntityTypeEnum): void {

        debugger;
        if (this.data.result.survival === undefined) {
            return;
        }


        const sX = scaleLinear().range([-500, 500]).domain(
            this.data.result.survival.reduce((p, c) => {
                p[0] = Math.min(p[0], c.range[0][0]);
                p[1] = Math.max(p[1], c.range[0][1]);
                return p;
            }, [Infinity, -Infinity]));
        const sY = scaleLinear().range([-500, 500]).domain(
            this.data.result.survival.reduce((p, c) => {
                p[0] = Math.min(p[0], c.range[1][0]);
                p[1] = Math.max(p[1], c.range[1][1]);
                return p;
            }, [Infinity, -Infinity]));
        const hX = scaleLinear().range([-500, 500]).domain(
            this.data.result.hazard.reduce((p, c) => {
                p[0] = Math.min(p[0], c.range[0][0]);
                p[1] = Math.max(p[1], c.range[0][1]);
                return p;
            }, [Infinity, -Infinity]));
        const hY = scaleLinear().range([-500, 500]).domain(
            this.data.result.hazard.reduce((p, c) => {
                p[0] = Math.min(p[0], c.range[1][0]);
                p[1] = Math.max(p[1], c.range[1][1]);
                return p;
            }, [Infinity, -Infinity]));

        this.data.result.survival.forEach((result, i) => {
            this.drawLine(-600, 0, result, sX, sY, i);
        });
        this.data.result.hazard.forEach((result, i) => {
            this.drawLine(600, 0, result, hX, hY, i);
        });


        // Grids
        this.drawGrid(-600, 0);
        this.drawGrid(600, 0);
        this.onRequestRender.emit(this.config.graph);


        // ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    drawLine(xOffset: number, yOffset: number, cohort: SurvivalDatumModel,
        xScale: ScaleContinuousNumeric<number, number>, yScale: ScaleContinuousNumeric<number, number>,
        renderOrder): void {
        let pts: Array<Vector2>, line: THREE.Line;

        // Confidence
        const shape = new Shape();
        shape.autoClose = false;
        shape.moveTo(-500 + xOffset, -500 + yOffset);
        cohort.lower.forEach(pt => {
            shape.lineTo(xScale(pt[0]) + xOffset, yScale(pt[1]) + yOffset);
        });
        cohort.upper.reverse().forEach(pt => {
            shape.lineTo(xScale(pt[0]) + xOffset, yScale(pt[1]) + yOffset);
        });

        const geometry = new ShapeGeometry(shape);
        const material = new THREE.MeshPhongMaterial({
            color: cohort.color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.NormalBlending
        });


        const mesh = new Mesh(geometry, material);
        // mesh.renderOrder = renderOrder;
        mesh.position.setZ(renderOrder * 1)
        this.confidences.push(mesh);
        this.view.scene.add(mesh);

        // pts = cohort.upper.map(v => new Vector2(xScale(v[0]) + xOffset, yScale(v[1]) + yOffset));
        // line = ChartFactory.linesAllocate(cohort.color, pts, {});
        // this.lines.push(line);
        // this.view.scene.add(line)

        // pts = cohort.lower.map(v => new Vector2(xScale(v[0]) + xOffset, yScale(v[1]) + yOffset));
        // line = ChartFactory.linesAllocate(cohort.color, pts, {});
        // this.lines.push(line);
        // this.view.scene.add(line);


        // Line
        pts = cohort.line.map(v => new Vector2(xScale(v[0]) + xOffset, yScale(v[1]) + yOffset));
        // const geo = new THREE.Geometry().setFromPoints(pts);
        // line = new MeshLine();
        // line.setGeometry(geo);
        // const meshLine = new THREE.Mesh(line.geometry,
        //     ChartFactory.getMeshLine(cohort.color, 5));

        line = ChartFactory.linesAllocate(cohort.color, pts, {});
        this.lines.push(line);
        this.view.scene.add(line);

        // Copy
        const text = this.fontService.createFontMesh(1000, 'Survival', this.view.camera, 'center', 'medium', 30);
        text.position.setX(0 + xOffset);
        text.position.setY(-520 + yOffset);
        this.grid.push(text);
        this.view.scene.add(text);
    }

    drawGrid(xOffset: number, yOffset: number): void {

        for (let x = -500; x <= 500; x += 100) {
            const line = ChartFactory.lineAllocate(0xDDDDDD, new Vector2(x + xOffset, -500 + yOffset), new Vector2(x + xOffset, 500 + yOffset));
            this.grid.push(line);
            this.view.scene.add(line);
        }

        let percent = 0;
        for (let y = -500; y <= 500; y += 100) {
            const line = ChartFactory.lineAllocate(0xDDDDDD, new Vector2(-500 + xOffset, y + yOffset), new Vector2(500 + xOffset, y + yOffset));
            this.grid.push(line);
            this.view.scene.add(line);

            const text = this.fontService.createFontMesh(1000, percent.toString(), this.view.camera, 'center', 'medium', 0);
            text.position.setX(-506 + xOffset);
            text.position.setY(y + 6 + yOffset);


            this.grid.push(text);
            this.view.scene.add(text);

            // const text = new MeshText2D(percent.toString(),
            //     { align: textAlign.right, font: '30px Ariel', fillStyle: '#666666', antialias: true });
            // text.position.setX(-506 + xOffset);
            // text.position.setY(y + 6 + yOffset);
            // this.grid.push(text);
            // this.view.scene.add(text);
            percent += 10;
        }
    }


    removeObjects(): void {
        this.view.scene.remove(...this.confidences);
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.lines);
        this.view.scene.remove(...this.grid);
        this.confidences.length = 0;
        this.meshes.length = 0;
        this.lines.length = 0;
        this.grid.length = 0;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void { }



}
