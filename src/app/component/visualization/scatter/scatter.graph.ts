import { ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { Vector3 } from 'three';
import {
  LabelController,
  LabelOptions
} from 'app/controller/label/label.controller';
import { ChartObjectInterface } from 'app/model/chart.object.interface';
import { DataDecorator } from 'app/model/data-map.model';
import { EntityTypeEnum } from 'app/model/enum.model';

import { SelectionController } from 'app/controller/selection/selection.controller';
import { ChartSelection } from 'app/model/chart-selection.model';
import { VisualizationView } from 'app/model/chart-view.model';
import { GraphConfig } from 'app/model/graph-config.model';

declare var $;

export class ScatterGraph extends AbstractVisualization {
  public set data(data: GraphData) {
    this._data = data;
  }
  public get data(): GraphData {
    return this._data;
  }
  public set config(config: GraphConfig) {
    this._config = config;
  }
  public get config(): GraphConfig {
    return this._config;
  }

  // Objects
  private lines: Array<THREE.Line>;
  private points: Array<THREE.Object3D>;
  protected selectionController: SelectionController;

  // Private Subscriptions
  create(
    labels: HTMLElement,
    events: ChartEvents,
    view: VisualizationView
  ): ChartObjectInterface {
    super.create(labels, events, view);
    this.selectionController = new SelectionController(view, events);

    this.meshes = [];
    this.points = [];
    this.lines = [];
    return this;
  }

  destroy() {
    super.destroy();
    this.selectionController.destroy();
    this.removeObjects();
  }

  updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
    super.updateDecorator(config, decorators);
    // ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    // this.onShowLabels();
    // this.points = this.meshes.map(v => v.children[0]);
    // this.tooltipController.targets = this.points;
    // this.tooltipController.onShow.subscribe(this.onShow);
    // this.selectionController.targets = this.points;
  }

  private onShow(e: any): void {}

  updateData(config: GraphConfig, data: any) {
    super.updateData(config, data);
    this.removeObjects();
    this.addObjects(this._config.entity);
  }

  enable(truthy: boolean) {
    super.enable(truthy);
    this.view.renderer.domElement.style.setProperty('cursor', 'default');
    this.view.controls.enableRotate = true;
  }

  addObjects(type: EntityTypeEnum) {
    const propertyId =
      this._config.entity === EntityTypeEnum.GENE ? 'mid' : 'sid';
    const objectIds = this._data[propertyId];
    const geo = new THREE.Geometry();
    const mat = new THREE.PointsMaterial({ color: 0xff0000 });
    const pts = new THREE.Points(geo, mat);
    this._data.resultScaled.forEach((point, index) => {
      const centerPoint = new Vector3(...point);
      geo.vertices.push(centerPoint);
    });
    this.view.scene.add(pts);

    ChartFactory.configPerspectiveOrbit(
      this.view,
      new THREE.Box3(
        new Vector3(-250, -250, -250),
        new THREE.Vector3(250, 250, 250)
      )
    );
  }

  removeObjects() {
    this.view.scene.remove(...this.meshes);
    this.view.scene.remove(...this.lines);
    this.meshes.length = 0;
    this.lines.length = 0;
  }

  onShowLabels(): void {
    const labelOptions = new LabelOptions(this.view, 'FORCE');
    labelOptions.offsetX3d = 1;
    labelOptions.maxLabels = 100;
    this.labels.innerHTML = LabelController.generateHtml(
      this.meshes,
      labelOptions
    );
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Meta') {
      if (this.isEnabled) {
        this.view.renderer.domElement.style.setProperty('cursor', 'crosshair');
        this.view.controls.enabled = false;
        this.tooltipController.enable = false;
        this.selectionController.setup(
          this.config,
          this.onRequestRender,
          this.onSelect,
          this.points
        );
        this.selectionController.enable = true;
      }
    }
  }
  onKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Meta') {
      if (this.isEnabled) {
        this.view.renderer.domElement.style.setProperty('cursor', 'default');
        this.view.controls.enabled = true;
        this.tooltipController.enable = true;
        this.selectionController.enable = false;
        this.selectionController.teardown();
      }
    }
  }
}
