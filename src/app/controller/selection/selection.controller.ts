import { ChartSelection } from './../../model/chart-selection.model';

import { GraphConfig } from 'app/model/graph-config.model';
import {
  ChartEvents,
  ChartEvent
} from './../../component/workspace/chart/chart.events';
import { VisualizationView } from './../../model/chart-view.model';
import { AbstractMouseController } from './../abstract.mouse.controller';
import {
  Vector3,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Object3D,
  Vector2,
  Sphere,
  LineBasicMaterial
} from 'three';
import { EventEmitter } from '@angular/core';
import { GraphEnum } from '../../model/enum.model';
import { scaleLinear } from 'd3-scale';
export class SelectionOptions {}

export class SelectionController extends AbstractMouseController {
  protected _config: GraphConfig;
  protected _options: SelectionOptions;
  protected _onRequestRender: EventEmitter<GraphEnum>;
  protected _onSelect: EventEmitter<ChartSelection>;

  protected _selectionMesh: Mesh;

  public teardown(): void {
    this._config = null;
    this._onRequestRender = null;
    this._onSelect = null;
  }
  public setup(
    config: GraphConfig,
    onRequestRender: EventEmitter<GraphEnum>,
    onSelect: EventEmitter<ChartSelection>,
    targets: Array<Object3D>
  ): void {
    this._config = config;
    this._onSelect = onSelect;
    this._onRequestRender = onRequestRender;
    this.targets = targets;
  }
  public get options(): SelectionOptions {
    return this._options;
  }
  public set options(value: SelectionOptions) {
    this._options = value;
  }

  public destroy(): void {
    super.destroy();
    this.teardown();
  }

  public onKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Meta') {
      if (!e.shiftKey) {
        this.completeSelection();
      }
    }

    if (e.key === 'Shift') {
      this._view.scene.remove(this.data.selectionMesh);
      this.data.selectionMesh = null;
      this.completeSelection();
    }
  }

  public completeSelection(): void {
    const type = this._targets[0].parent.userData.idType;
    const ids = [];
    this._targets.filter(v => v.userData.selected).forEach(o3d => {
      ids.push(o3d.parent.userData.id);
      const mesh = o3d as Mesh;
      const material = mesh.material as THREE.MeshPhongMaterial;
      mesh.userData.locked = false;
      material.color.set(mesh.userData.color);
      material.transparent = true;
      material.opacity = 0.7;
    });
    this._onRequestRender.emit(this._config.graph);
    const selection: ChartSelection = { type: type, ids: ids };
    if (selection.ids.length > 0) {
      this._onSelect.emit(selection);
    }
  }

  public onMouseUp(e: ChartEvent): void {
    if (this._selectionMesh !== null) {
      this._selectionMesh.parent.remove(this._selectionMesh);
    }
  }

  public onMouseDown(e: ChartEvent): void {
    const intersects = this.getIntersects(this._view, e.mouse, this._targets);
    if (intersects.length > 0) {
      intersects[0].object['material'].color.setRGB(255, 0, 0);
      this._onRequestRender.emit(this._config.graph);
    }
  }
  public onMouseMove(e: ChartEvent): void {
    console.log('...');
    super.onMouseMove(e);
    const intersects = this.getIntersects(this._view, e.mouse, this._targets);
    if (intersects.length > 0) {
      intersects[0].object['material'].color.setRGB(255, 0, 0);
      this._onRequestRender.emit(this._config.graph);
    }
  }

  constructor(
    view: VisualizationView,
    events: ChartEvents,
    debounce: number = 10
  ) {
    super(view, events, debounce);
    this._options = {};
  }
}
