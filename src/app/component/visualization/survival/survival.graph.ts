import { scaleLinear } from 'd3-scale';
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
import { SurvivalDataModel, SurvivalConfigModel } from './survival.model';
import { Vector2, Shape, ShapeGeometry, MeshPhongMaterial, Mesh } from 'three';
export class SurvivalGraph extends AbstractVisualization {

    public set data(data: SurvivalDataModel) { this._data = data; }
    public get data(): SurvivalDataModel { return this._data as SurvivalDataModel; }
    public set config(config: SurvivalConfigModel) { this._config = config; }
    public get config(): SurvivalConfigModel { return this._config as SurvivalConfigModel; }

    public lines: Array<THREE.Line>;
    public confidences: Array<THREE.Mesh>;

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.confidences = []
        this.meshes = [];
        this.lines = [];
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

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = false;
    }


    addObjects(type: EntityTypeEnum): void {

        if (this.data.cohorts === undefined) { return; }

        const timeRange = this.data.cohorts.reduce((p, c) => {
            p[0] = Math.min(p[0], c.timeRange[0]);
            p[1] = Math.max(p[1], c.timeRange[1]);
            return p;
        }, [Infinity, -Infinity]);
        const xScale = scaleLinear().range([-500, 500]).domain(timeRange);
        const yScale = scaleLinear().range([-500, 500]).domain([0, 1]);


        this.data.cohorts.forEach(cohort => {
            let pts: Array<Vector2>;

            // Confidence
            const shape = new Shape();
            shape.autoClose = false;
            shape.moveTo(-500, -500);
            cohort.confidence.lower.forEach(pt => {
                shape.lineTo(xScale(pt[0]), yScale(pt[1]));
            });
            cohort.confidence.upper.reverse().forEach(pt => {
                shape.lineTo(xScale(pt[0]), yScale(pt[1]));
            });
            const geometry = new ShapeGeometry(shape);
            const material = ChartFactory.getColorPhong(0xbbdefb);
            material.opacity = 0.5;
            material.transparent = true;
            const mesh = new Mesh(geometry, material);
            this.confidences.push(mesh);
            this.view.scene.add(mesh);

            // Line
            pts = cohort.result.map(v => new Vector2(xScale(v[0]), yScale(v[1])));
            const line = ChartFactory.linesAllocate(0x1a237e, pts, {});
            this.lines.push(line);
            this.view.scene.add(line);

        });


        // const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        // const objectIds = this.data[propertyId];

        // this.data.nodes.forEach((node, index) => {
        //     const group = ChartFactory.createDataGroup(
        //         objectIds[index], this.config.entity, new THREE.Vector3(node.x, node.y, node.z));
        //     this.meshes.push(group);
        //     this.view.scene.add(group);
        // });
        // ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    removeObjects(): void {
        this.view.scene.remove(...this.confidences);
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.lines);
        this.confidences.length = 0;
        this.meshes.length = 0;
        this.lines.length = 0;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void { }
}
