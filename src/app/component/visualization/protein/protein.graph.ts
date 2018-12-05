import { Legend } from './../../../model/legend.model';
import { LegendPanelComponent } from './../../workspace/legend-panel/legend-panel.component';
import { EventEmitter } from '@angular/core';
import * as TWEEN from '@tweenjs/tween.js';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
import { ChartEvents, ChartEvent } from 'app/component/workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import * as THREE from 'three';
import { Vector3, Raycaster } from 'three';
import { LabelController, LabelOptions } from 'app/controller/label/label.controller';
import { ChartObjectInterface } from 'app/model/chart.object.interface';
import { DataDecorator } from 'app/model/data-map.model';
import { EntityTypeEnum, GraphEnum } from 'app/model/enum.model';

import { SelectionController } from 'app/controller/selection/selection.controller';
import { VisualizationView } from 'app/model/chart-view.model';
import { GraphConfig } from 'app/model/graph-config.model';
import kmeans from 'ml-kmeans';

const fragShader = require('raw-loader!glslify-loader!app/glsl/point.frag');
const vertShader = require('raw-loader!glslify-loader!app/glsl/point.vert');
declare var $;

export class ProteinGraph extends AbstractVisualization {
  public set data(data: GraphData) {
    this._data = data;
    debugger;
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

  // Private Subscriptions
  create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
    super.create(labels, events, view);
    return this;
  }

  destroy() {
    super.destroy();
  }

  enable(truthy: boolean) {
    super.enable(truthy);
    this.view.renderer.domElement.style.setProperty('cursor', 'default');
    this.view.controls.enableRotate = true;
  }

  constructor() {
    super();
  }
}
