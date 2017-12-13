import { Subscription } from 'rxjs/Subscription';
import { WorkspaceLayoutEnum } from './../../model/enum.model';
import { VisualizationView } from './../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../workspace/chart/chart.events';
import { GraphConfig } from './../../model/graph-config.model';
import { EventEmitter } from '@angular/core';
import { GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../model/chart.object.interface';
export class AbstractVisualization implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{type: GraphConfig}> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Common Objects
    labels: HTMLElement;
    events: ChartEvents;
    view: VisualizationView;
    isEnabled: boolean;
    meshes: THREE.Object3D[];

    enable(truthy: Boolean) {
        throw new Error('Method not implemented.');
    }
    update(config: GraphConfig, data: any) {
        throw new Error('Method not implemented.');
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        return this;
    }
    destroy() {
        throw new Error('Method not implemented.');
    }
    preRender(views: VisualizationView[], layout: WorkspaceLayoutEnum, renderer: THREE.Renderer): void {}

}
