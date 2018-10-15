import { ChartSelection } from './chart-selection.model';
import { EventEmitter } from '@angular/core';
import { GraphEnum } from 'app/model/enum.model';
import * as THREE from 'three';
import { ChartEvents } from './../component/workspace/chart/chart.events';
import { VisualizationView } from './chart-view.model';
import { DataDecorator } from './data-map.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './enum.model';
import { GraphConfig } from './graph-config.model';

export interface ChartObjectInterface {
  meshes: Array<THREE.Object3D>;
  decorators: Array<DataDecorator>;
  onRequestRender: EventEmitter<GraphEnum>;
  onSelect: EventEmitter<ChartSelection>;
  onConfigEmit: EventEmitter<{ type: GraphConfig }>;
  getTargets(): Array<{
    point: THREE.Vector3;
    id: string;
    idType: EntityTypeEnum;
  }>;
  enable(truthy: Boolean);
  updateDecorator(config: GraphConfig, decorators: Array<DataDecorator>);
  updateData(config: GraphConfig, data: any);
  create(
    labels: HTMLElement,
    events: ChartEvents,
    view: VisualizationView
  ): ChartObjectInterface;
  destroy();
  preRender(
    views: Array<VisualizationView>,
    layout: WorkspaceLayoutEnum,
    renderer: THREE.Renderer
  ): void;
}
