import { HazardDataModel, HazardConfigModel, HazardDatumModel } from './hazard.model';
import { LabelController, ILabel, LabelOptions } from './../../../controller/label/label.controller';
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
import { Vector2, Shape, ShapeGeometry, MeshPhongMaterial, Mesh, PerspectiveCamera } from 'three';

export class HazardGraph extends AbstractVisualization {

    public set data(data: HazardDataModel) { this._data = data; }
    public get data(): HazardDataModel { return this._data as HazardDataModel; }
    public set config(config: HazardConfigModel) { this._config = config; }
    public get config(): HazardConfigModel { return this._config as HazardConfigModel; }

    public labelsForPercents: Array<ILabel>;
    public labelsForTimes: Array<ILabel>;
    public lines: Array<THREE.Line>;
    public confidences: Array<THREE.Mesh>;
    public grid: Array<THREE.Object3D>;

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.confidences = [];
        this.meshes = [];
        this.lines = [];
        this.grid = [];
        this.labelsForPercents = [];
        this.labelsForTimes = [];
        this.view.camera.position.setZ(5000);
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

        // Mouse Control Options
        // this.view.controls.maxZoom = 100;
        // this.view.controls.enableZoom = false;
        // this.view.controls.enableZoom = false;
        // this.view.camera.position.setZ(7000);
        // this.view.camera.position.setX(-400);

    }

    addObjects(type: EntityTypeEnum): void {


        if (this.data.result.hazard === undefined) {
            return;
        }
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

        this.data.result.hazard.forEach((result, i) => {
            this.drawLine(0, 0, result, hX, hY, i, 'Hazard');
        });

        for (let x = -500; x <= 500; x += 100) {
            this.labelsForTimes.push(
                {
                    position: new THREE.Vector3(x, -500, 0),
                    userData: { tooltip: Math.round(hX.invert(x)).toString() }
                }
            );
        }
        this.drawGrid(0, 0);

        // ChartFactory.decorateDataGroups(this.meshes, this.decorators);

        // const geo = new THREE.CubeGeometry(2200, 1000, 10, 1, 1, 1);
        // const mesh = new THREE.Mesh(geo, ChartFactory.getColorBasic(0x333333));
        // mesh.position.set(0, 0, 0);
        // const box: THREE.BoxHelper = new THREE.BoxHelper(mesh, new THREE.Color(0xFF0000));
        // this.view.scene.add(box);

        ChartFactory.configPerspectiveOrbit(this.view,
            new THREE.Box3(
                new THREE.Vector3(-500, -500, -5),
                new THREE.Vector3(500, 500, 5)));

        requestAnimationFrame(v => {
            this.onShowLabels();
        });

    }

    drawLine(xOffset: number, yOffset: number, cohort: HazardDatumModel,
        xScale: ScaleContinuousNumeric<number, number>, yScale: ScaleContinuousNumeric<number, number>,
        renderOrder, label: string): void {
        let pts: Array<Vector2>, line: THREE.Line;

        // Confidence
        const shape = new Shape();
        shape.autoClose = false;
        const initPoint = cohort.lower[0];
        shape.moveTo(xScale(initPoint[0]) + xOffset, yScale(initPoint[1]) + yOffset);
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
            opacity: 0.3,
            blending: THREE.NormalBlending
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.setZ(renderOrder * 1);
        this.confidences.push(mesh);
        this.view.scene.add(mesh);


        // pts = cohort.upper.map(v => new Vector2(xScale(v[0]) + xOffset, yScale(v[1]) + yOffset));
        // line = ChartFactory.linesAllocate(cohort.color, pts, {});
        // this.lines.push(line);
        // this.view.scene.add(line);

        // pts = cohort.lower.map(v => new Vector2(xScale(v[0]) + xOffset, yScale(v[1]) + yOffset));
        // line = ChartFactory.linesAllocate(cohort.color, pts, {});
        // this.lines.push(line);
        // this.view.scene.add(line);

        // Line
        pts = cohort.line.map(v => new Vector2(xScale(v[0]) + xOffset, yScale(v[1]) + yOffset));
        // const geo = new THREE.Geometry().setFromPoints(pts);
        // const mline = new MeshLine();
        // mline.setGeometry(geo);
        // const meshLine = new THREE.Mesh(line.geometry,
        //     ChartFactory.getMeshLine(cohort.color, 5));

        line = ChartFactory.linesAllocate(cohort.color, pts, {});
        this.lines.push(line);
        this.view.scene.add(line);

    }

    drawGrid(xOffset: number, yOffset: number): void {

        for (let x = -500; x <= 500; x += 100) {
            const line = ChartFactory.lineAllocate(0xDDDDDD,
                new Vector2(x + xOffset, -500 + yOffset),
                new Vector2(x + xOffset, 500 + yOffset));
            this.grid.push(line);
            this.view.scene.add(line);
        }

        let percent = 0;
        for (let y = -500; y <= 500; y += 100) {
            const line = ChartFactory.lineAllocate(0xDDDDDD,
                new Vector2(-500 + xOffset, y + yOffset),
                new Vector2(500 + xOffset, y + yOffset));
            this.grid.push(line);
            this.view.scene.add(line);

            if (percent > 0) {
                this.labelsForPercents.push({
                    position: new THREE.Vector3(-510 + xOffset, y + 6 + yOffset, 0),
                    userData: { tooltip: percent.toString() + '%' }
                });
            }
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


    // Label Options
    onShowLabels(): void {

        // Step 1 - Create Options
        const optionsForPercents = new LabelOptions(this.view, 'PIXEL');
        optionsForPercents.fontsize = 10;
        optionsForPercents.origin = 'RIGHT';
        optionsForPercents.align = 'RIGHT';
        optionsForPercents.fontsize = 10;

        const optionsForTimes = new LabelOptions(this.view, 'PIXEL');
        optionsForTimes.fontsize = 10;



        if (this.view.camera.position.z > 10000) {
            this.labels.innerHTML = '';
            // '<div style="position:fixed;bottom:50px;left:30%; font-size: 1.2rem;">Time</div>' +
            //     '<div style="position:fixed;left:275px;top:50%; transform: rotate(90deg);font-size: 1.2rem;">Percent</div>';
        } else if (this.view.camera.position.z < 10000) {
            optionsForPercents.fontsize = 10;
            optionsForTimes.fontsize = 10;
            this.labels.innerHTML =
                LabelController.generateHtml(this.labelsForPercents, optionsForPercents) +
                LabelController.generateHtml(this.labelsForTimes, optionsForTimes);
            // '<div style="position:fixed;bottom:50px;left:30%; font-size: 1.2rem;">Time</div>' +
            // '<div style="position:fixed;left:200px;top:50%; transform: rotate(90deg);font-size: 1.2rem;">Percent</div>';
        }

    }

}
