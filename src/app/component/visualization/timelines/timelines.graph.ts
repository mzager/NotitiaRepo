import { ILabel, LabelController, LabelOptions } from './../../../util/label/label.controller';
import { AbstractVisualization } from './../visualization.abstract.component';
import { DataDecorator } from './../../../model/data-map.model';
import { scaleLinear, scaleLog, InterpolatorFactory, scaleSequential, scaleQuantize, scaleQuantile } from 'd3-scale';
import { interpolateRgb, interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { TimelinesStyle } from './timelines.model';
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
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import { Subscription } from 'rxjs/Subscription';
import { geoAlbers, active, ScaleLinear } from 'd3';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { Vector3, CubeGeometry, Vector2, OrthographicCamera, Float32BufferAttribute, LineSegments } from 'three';
import { DataService } from 'app/service/data.service';
// import MeshLine from 'three.meshline';

export class TimelinesGraph extends AbstractVisualization {

    public set data(data: TimelinesDataModel) { this._data = data; }
    public get data(): TimelinesDataModel { return this._data as TimelinesDataModel; }
    public set config(config: TimelinesConfigModel) { this._config = config; }
    public get config(): TimelinesConfigModel { return this._config as TimelinesConfigModel; }

    public patients: Array<THREE.Group>;
    public attrs: THREE.Group;
    public lines: THREE.LineSegments;
    public meshes: Array<THREE.Object3D>;
    public decorators: DataDecorator[];
    public clipPlanes: Array<THREE.Object3D> = [];
    public database: string;
    public yAxis: Array<ILabel>;
    public xAxis: Array<ILabel>;
    public grid: THREE.LineSegments;

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        // this.labels = labels;
        // this.labels.innerText = '';

        this.yAxis = [];
        this.xAxis = [];

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild(this.tooltips);

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild(this.overlay);

        this.events = events;
        this.view = view;

        this.meshes = [];
        this.patients = [];
        this.attrs = new THREE.Group();

        // this.view.controls.maxZoom = 1;
        this.view.controls.pan(0, 1200);
        this.view.controls.dollyOut(3);
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

    removeObjects(): void {
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.clipPlanes);
        this.view.scene.remove(...this.patients);
        this.view.scene.remove(this.attrs);
        this.view.scene.remove(this.lines);

        this.meshes.length = 0;
        this.clipPlanes.length = 0;
        this.patients.length = 0;
        this.attrs = new THREE.Group();
        this.view.scene.remove(this.grid);
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }


    addTic(event: any, bar: number, barHeight: number, rowHeight: number, group: THREE.Group, scale: ScaleLinear<number, number>): void {
        const s = scale(event.start);
        const e = scale(event.end);
        const w = Math.round(e - s);
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry((w < 1) ? 1 : w, barHeight * 0.3),
            ChartFactory.getColorPhong(event.color)
        );
        const yPos = (rowHeight - (bar * barHeight)) - 2;
        mesh.position.set(s + (w * 0.5), yPos, 0);
        mesh.userData = event;
        group.add(mesh);
        this.meshes.push(mesh);
    }

    addArc(event: any, bar: number, barHeight: number, rowHeight: number, group: THREE.Group, scale: ScaleLinear<number, number>): void {
        if (event.start !== event.end) {
            const s = scale(event.start);
            const e = scale(event.end);
            const w = Math.round(e - s);
            const c = (Math.abs(e - s) * 0.5) + Math.min(e, s);
            const yPos = (rowHeight - (bar * barHeight)) - 2;
            const mesh = ChartFactory.lineAllocateCurve(event.color,
                new THREE.Vector2(s, yPos - 2),
                new THREE.Vector2(e, yPos - 2),
                new THREE.Vector2(c, yPos + 2)
            );

            mesh.userData = event;
            group.add(mesh);
            this.meshes.push(mesh);
        } else {
            const s = scale(event.start);
            const yPos = (rowHeight - (bar * barHeight)) - 2;
            const mesh = ChartFactory.lineAllocate(event.color, new Vector2(s, yPos - 2), new Vector2(s, yPos + 2));
            mesh.userData = event;
            group.add(mesh);
            this.meshes.push(mesh);
        }
    }

    addSymbol(event: any, bar: number, barHeight: number, rowHeight: number, group: THREE.Group, scale: ScaleLinear<number, number>): void {
        const s = scale(event.start);
        const e = scale(event.end);
        const w = Math.round(e - s);
        const mesh = new THREE.Mesh(
            new THREE.CircleGeometry(1.6, 20),
            ChartFactory.getColorPhong(event.color)
        );
        const yPos = (rowHeight - (bar * barHeight)) - 2;

        mesh.position.set(s, yPos, 1);
        mesh.userData = event;
        group.add(mesh);
        this.meshes.push(mesh);

        if (event.start !== event.end) {
            const triangleGeometry = new THREE.Geometry();
            triangleGeometry.vertices.push(new THREE.Vector3(0.0, 1.8, 0.0));
            triangleGeometry.vertices.push(new THREE.Vector3(-1.8, -1.8, 0.0));
            triangleGeometry.vertices.push(new THREE.Vector3(1.8, -1.8, 0.0));
            triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
            const triangle = new THREE.Mesh(triangleGeometry, ChartFactory.getColorBasic(event.color));
            triangle.userData = event;
            triangle.position.set(scale(event.end), yPos, 0);
            group.add(triangle);
            this.meshes.push(triangle);
        }
    }

    addAttrs(rowHeight, rowCount, pidMap): void {
        const d = this.data;
        this.data.result.attrs.pids.forEach((pid, pidIndex) => {
            const rowIndex = pidMap[pid];
            const yPos = (rowHeight * rowIndex) - (rowHeight * -0.5);
            this.data.result.attrs.attrs.forEach((attr, attrIndex) => {
                const value = attr.values[pidIndex].label;
                const color = attr.values[pidIndex].color;
                const xPos = -500 - (attrIndex * rowHeight);
                const mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(rowHeight - 2, rowHeight - 2),
                    ChartFactory.getColorPhong(color)
                );
                mesh.position.set(xPos - (rowHeight * 0.5) - 1, yPos, 10);
                mesh.userData = {
                    data: {
                        type: 'attr',
                        field: attr.prop.replace(/_/gi, ' '),
                        value: (value !== null) ? value.toString() : 'NA'
                    }
                };
                this.attrs.add(mesh);
                this.meshes.push(mesh);
            });
        });
        this.view.scene.add(this.attrs);
    }

    addLines(rowHeight, rowCount): void {

        const chartHeight = rowHeight * rowCount;
        const geometry: THREE.Geometry = new THREE.Geometry();
        geometry.vertices = [];
        for (let i = -500; i <= 500; i += 50) {
            // new THREE.Vector2(i, chartHeight), new THREE.Vector2(i, 0)
            geometry.vertices.push(
                new THREE.Vector3(i, chartHeight, 0),
                new THREE.Vector3(i, 0, 0)
            );
        }
        for (let i = 0; i < rowCount + 1; i++) {
            geometry.vertices.push(
                new THREE.Vector3(-500, i * rowHeight, 0),
                new THREE.Vector3(500, i * rowHeight, 0)
            );
        }

        var material = ChartFactory.getLineColor(0xEEEEEE);
        this.grid = new THREE.LineSegments(geometry, material);
        this.grid.updateMatrix();

        this.view.scene.add(this.grid);

    }

    // #endregion
    addObjects(entity: EntityTypeEnum): void {


        // this.clipPlanes = [];

        // let plane = new THREE.PlaneGeometry(1000, 3000);
        // let mesh = new THREE.Mesh(plane, ChartFactory.getColorBasic(0xFFFFFF));
        // mesh.position.x -= 1000;
        // mesh.position.y = 0;
        // mesh.position.z = 5;
        // this.clipPlanes.push(mesh);
        // this.view.scene.add(mesh);

        // plane = new THREE.PlaneGeometry(1000, 3000);
        // mesh = new THREE.Mesh(plane, ChartFactory.getColorBasic(0xFFFFFF));
        // mesh.position.x += 1000;
        // mesh.position.y = 0;
        // mesh.position.z = 5;
        // this.clipPlanes.push(mesh);
        // this.view.scene.add(mesh);

        // Helper Variables
        const bars = this.config.bars;
        let pts: Array<any> = this.data.result.patients;
        pts = Object.keys(pts).map(v => pts[v]);

        const barHeight = 4; // bars.reduce( (p,c) => p = Math.max(p, c.row), -Infinity) + 1;
        const barLayout = bars.filter(v => v.style !== 'None').sort((a, b) => a.z - b.z).sort((a, b) => a.row - b.row);
        let track = -1;
        let lastRow = -1;
        for (let i = 0; i < barLayout.length; i++) {
            const bar = barLayout[i];
            if (bar.row !== lastRow) {
                lastRow = bar.row;
                track += 1;
            }
            bar.track = track;
        }
        const rowHeight = (track + 1) * barHeight;
        const rowCount = pts.length;

        // Grid
        this.addLines(rowHeight, rowCount);



        // Scale
        const scale = scaleLinear();
        scale.range([-500, 500]);
        if (this.config.range[0] !== 0 || this.config.range[1] !== 100) {
            const span = this.data.result.minMax.max - this.data.result.minMax.min;
            const minOffset = (this.config.range[0] / 100) * span;
            const maxOffset = (this.config.range[1] / 100) * span;
            const min = (this.config.range[0] !== 0) ?
                this.data.result.minMax.min + minOffset : this.data.result.minMax.min;
            const max = (this.config.range[1] !== 100) ?
                maxOffset : this.data.result.minMax.max;
            scale.domain([min, max]);
        } else {
            scale.domain([this.data.result.minMax.min, this.data.result.minMax.max]);
        }

        // X-Axis
        for (let i = -500; i <= 500; i += 50) {
            this.xAxis.push(
                {
                    position: new THREE.Vector3(i, 0, 0),
                    userData: { tooltip: scale.invert(i).toString() }
                }
            );
        }

        // Patients + PID MAP
        const pidMap: any = {};
        pts.forEach((patient, i) => {
            pidMap[patient[0].p] = i;
            const group = new THREE.Group();
            this.patients.push(group);
            this.view.scene.add(group);
            const yPos = i * rowHeight;
            group.position.setY(yPos);
            this.yAxis.push(
                {
                    position: new THREE.Vector3(0, yPos, 0),
                    userData: { tooltip: patient[0].p }
                }
            );
            barLayout.forEach(bl => {
                const barEvents = patient.filter(p => p.type === bl.label);
                barEvents.forEach(event => {
                    event.data.type = 'event';
                    event.data.id = patient[0].p;
                    switch (bl.style) {
                        case TimelinesStyle.NONE:
                            break;
                        case TimelinesStyle.ARCS:
                            this.addArc(event, bl.track, barHeight, rowHeight, group, scale);
                            break;
                        case TimelinesStyle.TICKS:
                            this.addTic(event, bl.track, barHeight, rowHeight, group, scale);
                            break;
                        case TimelinesStyle.SYMBOLS:
                            this.addSymbol(event, bl.track, barHeight, rowHeight, group, scale);
                            break;
                    }
                });
            });
        });



        // Attributes
        this.addAttrs(rowHeight, rowCount, pidMap);
    }

    onMouseMove(e: ChartEvent): void {
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);

        if (hit.length > 0) {

            if (hit[0].object.userData === undefined) {
                return;
            }
            try {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                const data = hit[0].object.userData.data;
                if (data.type === 'event') {
                    const tip = Object.keys(data).reduce((p, c) => {
                        if (c !== 'type') {
                            if (data[c].trim().length > 0) {
                                p += '<nobr>' + c + ': ' + data[c].toLowerCase() + '</nobr><br />';
                            }
                        }
                        return p;
                    }, '<span style="font-weight:700;font-size:1rem;color:#FFF;">' + hit[0].object.userData.subtype + '</span><br />');
                    this.tooltips.innerHTML = '<div style="width:auto;background:rgba(0,0,0,.8);font-size:.9rem;color:#DDD;' +
                        'padding:5px;border-radius:3px;z-index:9999;position:absolute;left:' +
                        xPos + 'px;top:' +
                        yPos + 'px;">' +
                        tip + '</div>';
                }
                if (data.type === 'attr') {
                    const tip = data.field + ': ' + data.value;
                    this.tooltips.innerHTML = '<div style="width:auto;background:rgba(255,255,255,.8);color:#000;' +
                        'padding:5px;border-radius:3px;z-index:9999;position:absolute;left:' +
                        xPos + 'px;top:' +
                        yPos + 'px;">' +
                        tip + '</div>';
                }
            } catch (e) {

            }

            return;
        }
        this.tooltips.innerHTML = '';
    }

    onShowLabels(): void {
        const zoom = this.view.camera.position.z;

        const labelXAxis = new LabelOptions(this.view);
        labelXAxis.absoluteY = this.view.viewport.height - 20;
        labelXAxis.ignoreFrustumY = true;
        labelXAxis.maxLabels = Infinity;
        labelXAxis.align = 'CENTER';
        labelXAxis.postfix = ' Days';

        const labelYAxis = new LabelOptions(this.view);
        labelYAxis.absoluteX = this.view.viewport.width - 20;
        labelYAxis.ignoreFrustumX = true;
        labelYAxis.maxLabels = Infinity;
        labelYAxis.offsetX = -7;
        labelYAxis.align = 'RIGHT';


        this.labels.innerHTML =
            LabelController.generateHtml(this.xAxis, labelXAxis) +
            LabelController.generateHtml(this.yAxis, labelYAxis);
        // } else {
        //     this.labels.innerHTML = '';
        // this.labels.innerHTML = LabelController.reduceHtml([
        //     { x: this.view.viewport.width * .5, y: this.view.viewport.height - 20, name: 'Time' }
        // ], 'CENTER') +
        //     LabelController.reduceHtml([
        //         { x: this.view.viewport.width - 20, y: this.view.viewport.height * 0.5, name: 'Patients' }
        //     ], 'RIGHT');

        // }

    }

}
