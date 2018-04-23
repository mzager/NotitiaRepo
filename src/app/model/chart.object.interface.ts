import { EventEmitter } from '@angular/core';
import { DataDecorator } from './data-map.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { VisualizationView } from './chart-view.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartEvents } from './../component/workspace/chart/chart.events';
import { GraphConfig } from './graph-config.model';
import * as THREE from 'three';

export interface ChartObjectInterface {
    meshes: Array<THREE.Object3D>;
    decorators: Array<DataDecorator>;
    onRequestRender: EventEmitter<GraphEnum>;
    onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>;
    onConfigEmit: EventEmitter<{ type: GraphConfig }>;
    enable(truthy: Boolean);
    updateDecorator(config: GraphConfig, decorators: Array<DataDecorator>);
    updateData(config: GraphConfig, data: any);
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface;
    destroy();
    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.Renderer): void;
}
