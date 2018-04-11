import { LabelController } from './../../util/label/label.controller';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Vector3 } from 'three';
import { FontService } from './../../service/font.service';
import { GraphData } from 'app/model/graph-data.model';
import { DataField } from './../../model/data-field.model';
import { DataDecorator } from './../../model/data-map.model';
import { Subscription } from 'rxjs/Subscription';
import { WorkspaceLayoutEnum } from './../../model/enum.model';
import { VisualizationView } from './../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../workspace/chart/chart.events';
import { GraphConfig } from './../../model/graph-config.model';
import { EventEmitter } from '@angular/core';
import { GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../model/chart.object.interface';
import * as _ from 'lodash';
export class AbstractVisualization implements ChartObjectInterface {

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Common Objects
    public _data: GraphData;
    public _config: GraphConfig;
    public decorators: Array<DataDecorator>;
    public $MouseMove: Subscription;
    public $MouseDown: Subscription;
    public $MouseUp: Subscription;
    public $onShowLabels: Subscription;
    public $onHideLabels: Subscription;
    public overlay: HTMLElement;
    public tooltips: HTMLElement;
    public labels: HTMLElement;
    public events: ChartEvents;
    public view: VisualizationView;
    public isEnabled: boolean;
    public meshes: THREE.Object3D[];
    public fontService: FontService;
    protected labelController: LabelController;

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.labelController.enable = this.isEnabled;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.$MouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
            this.$MouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this.$MouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
        } else {
            this.$MouseMove.unsubscribe();
            this.$MouseDown.unsubscribe();
            this.$MouseUp.unsubscribe();
            this.tooltips.innerHTML = '';
        }
    }
    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        this.decorators = decorators;
    }
    updateData(config: GraphConfig, data: any) {
        this._config = config as GraphConfig;
        this._data = data;
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {

        this.labels = labels;
        this.labels.innerText = '';
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.decorators = [];

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild(this.tooltips);

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild(this.overlay);

        view.camera.position.fromArray([0, 0, 1000]);
        view.camera.lookAt(new Vector3(0, 0, 0));
        view.scene.add(view.camera);


        this.labelController = new LabelController(view);
        this.$onShowLabels = this.labelController.onShow.subscribe(this.onShowLabels.bind(this));
        this.$onHideLabels = this.labelController.onHide.subscribe(this.onHideLabels.bind(this));

        return this;
    }
    destroy() {
        this.$MouseDown.unsubscribe();
        this.$MouseMove.unsubscribe();
        this.$MouseUp.unsubscribe();
        this.$onHideLabels.unsubscribe();
        this.$onShowLabels.unsubscribe();
        this.labelController.destroy();
        this.enable(false);
    }
    preRender(views: VisualizationView[], layout: WorkspaceLayoutEnum, renderer: THREE.Renderer): void { }

    public onMouseDown(e: ChartEvent): void { }
    public onMouseUp(e: ChartEvent): void { }
    public onMouseMove(e: ChartEvent): void { }
    public onShowLabels(): void {
        console.log('show - super');
    }
    public onHideLabels(): void {
        console.log('hide')
        this.tooltips.innerHTML = '';
    }
    constructor(fontService: FontService) {
        this.fontService = fontService;
    }

}
