import { TimelinesConfigModel, TimelinesDataModel } from 'app/component/visualization/timelines/timelines.model';

import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ScaleLinear } from 'd3';
import { scaleLinear } from 'd3-scale';
import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

import { ILabel, LabelController, LabelOptions } from './../../../controller/label/label.controller';

import { VisualizationView } from './../../../model/chart-view.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { TimelinesStyle } from './timelines.model';

export class TimelinesGraph extends AbstractVisualization {
  public set data(data: TimelinesDataModel) {
    this._data = data;
  }
  public get data(): TimelinesDataModel {
    return this._data as TimelinesDataModel;
  }
  public set config(config: TimelinesConfigModel) {
    this._config = config;
  }
  public get config(): TimelinesConfigModel {
    return this._config as TimelinesConfigModel;
  }

  public patients: Array<THREE.Group>;
  public attrs: THREE.Group;
  public lines: THREE.LineSegments;
  public objs: Array<THREE.Object3D>;
  public meshes: Array<THREE.Object3D>;
  public decorators: DataDecorator[];
  public clipPlanes: Array<THREE.Object3D> = [];
  public database: string;
  public yAxis: Array<ILabel>;
  public xAxis: Array<ILabel>;
  public grid: THREE.LineSegments;
  public bgTime: HTMLElement;
  public bgPatient: HTMLElement;
  public labelYAxis: LabelOptions;
  public labelXAxis: LabelOptions;

  // Create - Initialize Mesh Arrays
  create(html: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
    super.create(html, events, view);

    this.bgTime = <HTMLDivElement>document.createElement('div');
    this.bgTime.className = 'timelines-bg-time';
    this.labels.insertAdjacentElement('beforebegin', this.bgTime);

    this.bgPatient = <HTMLDivElement>document.createElement('div');
    this.bgPatient.className = 'timelines-bg-patient';
    this.labels.insertAdjacentElement('beforebegin', this.bgPatient);

    this.yAxis = [];
    this.xAxis = [];

    this.events = events;
    this.view = view;

    this.meshes = [];
    this.objs = [];
    this.patients = [];

    this.attrs = new THREE.Group();

    this.labelXAxis = new LabelOptions(this.view, 'PIXEL');
    this.labelXAxis.absoluteY = this.view.viewport.height - 20;
    this.labelXAxis.ignoreFrustumY = true;
    this.labelXAxis.align = 'LEFT';
    this.labelXAxis.origin = 'RIGHT';
    // this.labelXAxis.css = 'width:300px;';
    // this.labelXAxis.postfix = ' Times';
    this.labelXAxis.fontsize = 0;

    // y labels
    this.labelYAxis = new LabelOptions(this.view, 'PIXEL');
    this.labelYAxis.absoluteX = this.view.viewport.width - 10;
    this.labelYAxis.ignoreFrustumX = true;
    this.labelYAxis.offsetY = -10;
    this.labelYAxis.origin = 'LEFT';
    this.labelYAxis.align = 'RIGHT';
    this.labelYAxis.fontsize = 0;
    // this.labelYAxis.css = 'width:300px;';
    return this;
  }

  destroy() {
    super.destroy();
    this.removeObjects();
  }

  updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
    super.updateDecorator(config, decorators);
    ChartFactory.decorateDataGroups(this.objs, this.decorators);
    this.tooltipController.targets = this.objs;
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
    this.view.scene.remove(...this.objs);
    this.view.scene.remove(...this.clipPlanes);
    this.view.scene.remove(...this.patients);
    this.view.scene.remove(this.attrs);
    this.view.scene.remove(this.lines);

    this.meshes.length = 0;
    this.objs.length = 0;
    this.clipPlanes.length = 0;
    this.patients.length = 0;
    this.attrs = new THREE.Group();
    this.view.scene.remove(this.grid);
  }

  onMouseDown(e: ChartEvent): void {}
  onMouseUp(e: ChartEvent): void {}

  addTic(
    event: any,
    bar: number,
    barHeight: number,
    rowHeight: number,
    group: THREE.Group,
    scale: ScaleLinear<number, number>,
    yOffset: number
  ): void {
    const s = scale(event.start);
    const e = scale(event.end);
    const w = Math.round(e - s);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w < 1 ? 1 : w, barHeight * 0.3),
      ChartFactory.getColorPhong(event.color)
    );
    const yPos = rowHeight - bar * barHeight - 2 - yOffset;
    mesh.position.set(s + w * 0.5, yPos, 0);
    mesh.userData = {
      tooltip: this.formatEventTooltip(event),
      color: event.color
    };
    group.add(mesh);
    this.objs.push(mesh);
  }

  addArc(
    event: any,
    bar: number,
    barHeight: number,
    rowHeight: number,
    group: THREE.Group,
    scale: ScaleLinear<number, number>,
    yOffset: number
  ): void {
    if (event.start !== event.end) {
      const s = scale(event.start);
      const e = scale(event.end);
      const w = Math.round(e - s);
      const c = Math.abs(e - s) * 0.5 + Math.min(e, s);
      const yPos = rowHeight - bar * barHeight - 2 - yOffset;
      const mesh = ChartFactory.lineAllocateCurve(
        event.color,
        new THREE.Vector2(s, yPos - 2),
        new THREE.Vector2(e, yPos - 2),
        new THREE.Vector2(c, yPos + 2)
      );

      mesh.userData = {
        tooltip: this.formatEventTooltip(event),
        color: event.color
      };
      group.add(mesh);
      this.objs.push(mesh);
    } else {
      const s = scale(event.start);
      const yPos = rowHeight - bar * barHeight - 2 - yOffset;
      const mesh = ChartFactory.lineAllocate(event.color, new Vector2(s, yPos - 2), new Vector2(s, yPos + 2));
      mesh.userData = {
        tooltip: this.formatEventTooltip(event),
        color: event.color
      };
      group.add(mesh);
      this.objs.push(mesh);
    }
  }

  addSymbol(
    event: any,
    bar: number,
    barHeight: number,
    rowHeight: number,
    group: THREE.Group,
    scale: ScaleLinear<number, number>,
    yOffset: number
  ): void {
    const s = scale(event.start);
    const e = scale(event.end);
    const w = Math.round(e - s);
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(1.6, 20), ChartFactory.getColorPhong(event.color));
    const yPos = rowHeight - bar * barHeight - 2 - yOffset;

    mesh.position.set(s, yPos, 1);
    mesh.userData = {
      tooltip: this.formatEventTooltip(event),
      color: event.color
    };
    group.add(mesh);
    this.objs.push(mesh);

    if (event.start !== event.end) {
      const triangleGeometry = new THREE.Geometry();
      triangleGeometry.vertices.push(new THREE.Vector3(0.0, 1.8, 0.0));
      triangleGeometry.vertices.push(new THREE.Vector3(-1.8, -1.8, 0.0));
      triangleGeometry.vertices.push(new THREE.Vector3(1.8, -1.8, 0.0));
      triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
      const triangle = new THREE.Mesh(triangleGeometry, ChartFactory.getColorPhong(event.color));
      triangle.userData = {
        tooltip: this.formatEventTooltip(event),
        color: event.color
      };
      triangle.position.set(scale(event.end), yPos, 0);
      group.add(triangle);
      this.objs.push(triangle);
    }
  }

  addAttrs(rowHeight, rowCount, pidMap): void {
    const d = this.data;
    const chartHeight = rowHeight * rowCount;
    const chartHeightHalf = chartHeight * 0.5;

    this.data.result.attrs.pids.forEach((pid, pidIndex) => {
      const rowIndex = pidMap[pid];
      const yPos = rowHeight * rowIndex - chartHeightHalf;
      this.data.result.attrs.attrs.forEach((attr, attrIndex) => {
        const value = attr.values[pidIndex].label;
        const col = attr.values[pidIndex].color;
        const xPos = -500 - attrIndex * rowHeight;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(rowHeight - 2, rowHeight - 2),
          ChartFactory.getColorPhong(col)
        );
        mesh.position.set(xPos - rowHeight * 0.5 - 1, yPos, 10);
        mesh.userData = {
          tooltip: this.formatAttrTooltip(attr),
          color: col,
          data: {
            type: 'attr',
            field: attr.prop.replace(/_/gi, ' '),
            value: value !== null ? value.toString() : 'NA'
          }
        };
        this.attrs.add(mesh);
        this.objs.push(mesh);
      });
    });
    this.view.scene.add(this.attrs);
  }

  addLines(rowHeight: number, rowCount: number, chartHeight: number, chartHeightHalf: number): void {
    const geometry: THREE.Geometry = new THREE.Geometry();
    geometry.vertices = [];
    for (let i = -500; i <= 500; i += 50) {
      // new THREE.Vector2(i, chartHeight), new THREE.Vector2(i, 0)
      geometry.vertices.push(new THREE.Vector3(i, chartHeightHalf, 0), new THREE.Vector3(i, -chartHeightHalf, 0));
    }
    for (let i = 0; i < rowCount + 1; i++) {
      geometry.vertices.push(
        new THREE.Vector3(-500, i * rowHeight - chartHeightHalf, 0),
        new THREE.Vector3(500, i * rowHeight - chartHeightHalf, 0)
      );
    }
    const material = ChartFactory.getLineColor(0xeeeeee);
    this.grid = new THREE.LineSegments(geometry, material);
    this.grid.updateMatrix();
    this.view.scene.add(this.grid);
  }

  // #endregion
  addObjects(entity: EntityTypeEnum): void {
    // Helper Variables
    const bars = this.config.bars;
    let pts: Array<any> = this.data.result.patients;
    pts = Object.keys(pts).map(v => pts[v]);

    const barHeight = 4; // bars.reduce( (p,c) => p = Math.max(p, c.row), -Infinity) + 1;
    const barLayout = bars
      .filter(v => v.style !== 'None')
      .sort((a, b) => a.z - b.z)
      .sort((a, b) => a.row - b.row);
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
    const chartHeight = rowHeight * rowCount;
    const chartHeightHalf = chartHeight * 0.5;

    // Grid
    this.addLines(rowHeight, rowCount, chartHeight, chartHeightHalf);

    // Scale
    const scale = scaleLinear();
    scale.range([-500, 500]);
    if (this.config.range[0] !== 0 || this.config.range[1] !== 100) {
      const span = this.data.result.minMax.max - this.data.result.minMax.min;
      const minOffset = (this.config.range[0] / 100) * span;
      const maxOffset = (this.config.range[1] / 100) * span;
      const min = this.config.range[0] !== 0 ? this.data.result.minMax.min + minOffset : this.data.result.minMax.min;
      const max = this.config.range[1] !== 100 ? maxOffset : this.data.result.minMax.max;
      scale.domain([min, max]);
    } else {
      scale.domain([this.data.result.minMax.min, this.data.result.minMax.max]);
    }

    // X-Axis
    for (let i = -500; i <= 500; i += 50) {
      this.xAxis.push({
        position: new THREE.Vector3(i, 0, 0),
        userData: { tooltip: Math.round(scale.invert(i)).toString() }
      });
    }
    debugger;
    // Patients + PID MAP
    const pidMap: any = {};
    pts.forEach((patient, i) => {
      pidMap[patient[0].p] = i;
      const group = new THREE.Group();
      this.patients.push(group);
      this.objs.push(group);
      group.userData.pid = patient[0].p;
      this.view.scene.add(group);
      const yPos = i * rowHeight;
      group.position.setY(yPos);

      const mesh = new THREE.Mesh(new THREE.CircleGeometry(1.6, 20), ChartFactory.getColorPhong(0x000000));

      mesh.position.set(-500, yPos - chartHeightHalf, 1);
      mesh.userData = {
        id: patient[0].p,
        pid: patient[0].p
      };
      this.meshes.push(mesh);
      // group.add(mesh);

      this.yAxis.push({
        position: new THREE.Vector3(0, yPos - chartHeightHalf, 0),
        userData: { tooltip: patient[0].p }
      });
      barLayout.forEach(bl => {
        const barEvents = patient.filter(p => p.type === bl.label);
        barEvents.forEach(event => {
          event.data.type = 'event';
          event.data.id = patient[0].p;
          switch (bl.style) {
            case TimelinesStyle.NONE:
              break;
            case TimelinesStyle.ARCS:
              this.addArc(event, bl.track, barHeight, rowHeight, group, scale, chartHeightHalf);
              break;
            case TimelinesStyle.TICKS:
              this.addTic(event, bl.track, barHeight, rowHeight, group, scale, chartHeightHalf);
              break;
            case TimelinesStyle.SYMBOLS:
              this.addSymbol(event, bl.track, barHeight, rowHeight, group, scale, chartHeightHalf);
              break;
          }
        });
      });
    });

    // Attributes
    this.addAttrs(rowHeight, rowCount, pidMap);
    this.tooltipController.targets = this.objs;
    const height = rowHeight * rowCount;

    // const geo = new THREE.CubeGeometry(1000, height, 10, 1, 1, 1);
    // const mesh = new THREE.Mesh(geo, ChartFactory.getColorBasic(0x333333));
    // mesh.position.set(0, 0, 0);
    // const box: THREE.BoxHelper = new THREE.BoxHelper(mesh, new THREE.Color(0xFF0000));
    // this.view.scene.add(box);

    ChartFactory.configPerspectiveOrbit(
      this.view,
      new THREE.Box3(new Vector3(-550, -height, -5), new THREE.Vector3(550, height, 5))
    );

    requestAnimationFrame(v => {
      this.onShowLabels();
    });
  }

  formatEventTooltip(event: any): string {
    const data = event.data;
    return (
      '<div>' +
      Object.keys(data).reduce((p, c) => {
        if (c !== 'type') {
          if (data[c].trim().length > 0) {
            p += '<nobr>' + c + ': ' + data[c].toLowerCase() + '</nobr><br />';
          }
        }
        return p;
      }, '') +
      '</div>'
    );
  }
  formatAttrTooltip(attr: any): string {
    return attr.field + ': ' + attr.value;
  }

  onMouseMove(e: ChartEvent): void {
    super.onMouseMove(e);
  }

  onShowLabels(): void {
    const zoom = this.view.camera.position.z;

    // label when rows are too small
    if (this.view.camera.position.z > 1400) {
      this.labels.innerHTML =
        '<div style="position:fixed;bottom:10px;left:50%; font-size: 15px;">Time</div>' +
        '<div style="position:fixed;right:10px;top:50%; transform: rotate(90deg); font-size: 15px;">Patients</div>';
    } else if (this.view.camera.position.z > 1100) {
      this.labelXAxis.fontsize = 8;
      this.labelYAxis.fontsize = 8;
      this.labels.innerHTML =
        LabelController.generateHtml(this.xAxis, this.labelXAxis) +
        LabelController.generateHtml(this.yAxis, this.labelYAxis);
    } else if (this.view.camera.position.z > 650) {
      this.labelXAxis.fontsize = 10;
      this.labelYAxis.fontsize = 10;
      this.labels.innerHTML =
        LabelController.generateHtml(this.xAxis, this.labelXAxis) +
        LabelController.generateHtml(this.yAxis, this.labelYAxis);
    } else if (this.view.camera.position.z > 50) {
      this.labelXAxis.fontsize = 10;
      this.labelYAxis.fontsize = 10;
      this.labels.innerHTML =
        LabelController.generateHtml(this.xAxis, this.labelXAxis) +
        LabelController.generateHtml(this.yAxis, this.labelYAxis);
    }
  }
}
