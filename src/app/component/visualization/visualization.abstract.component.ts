import { TooltipOptions } from './../../controller/tooltip/tooltip.controller';
import { LabelController } from './../../controller/label/label.controller';
import { Vector3 } from 'three';
import { GraphData } from 'app/model/graph-data.model';
import { DataDecorator } from './../../model/data-map.model';
import { Subscription } from 'rxjs/Subscription';
import { WorkspaceLayoutEnum } from './../../model/enum.model';
import { VisualizationView } from './../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../workspace/chart/chart.events';
import { GraphConfig } from './../../model/graph-config.model';
import { EventEmitter } from '@angular/core';
import { GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../model/chart.object.interface';
import { TooltipController } from '../../controller/tooltip/tooltip.controller';
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
    public $onShowTooltip: Subscription;
    public $onHideTooltip: Subscription;
    public html: HTMLElement;
    public tooltips: HTMLElement;
    public tooltip: string;
    public tooltipColor: string;
    public labels: HTMLElement;
    public events: ChartEvents;
    public view: VisualizationView;
    public isEnabled: boolean;
    public isVisible: boolean;
    public meshes: THREE.Object3D[];
    protected labelController: LabelController;
    protected tooltipOptions: TooltipOptions;
    protected tooltipController: TooltipController;

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.labelController.enable = this.isEnabled;
        this.tooltipController.enable = this.isEnabled;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.$MouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
            this.$MouseDown = this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this.$MouseUp = this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
        } else {
            this.$MouseMove.unsubscribe();
            this.$MouseDown.unsubscribe();
            this.$MouseUp.unsubscribe();
            this.labels.innerHTML = '';
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
    create(html: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {

        this.html = html;
        this.html.innerText = '';
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.decorators = [];


        this.labels = <HTMLDivElement>(document.createElement('div'));
        this.labels.className = 'graph-overlay';
        this.html.appendChild(this.labels);

        this.tooltipOptions = new TooltipOptions();
        this.tooltip = '';
        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.html.appendChild(this.tooltips);

        view.camera.position.set(0, 0, 1000);
        view.camera.lookAt(new Vector3(0, 0, 0));
        view.scene.add(view.camera);

        this.labelController = new LabelController(view, events);
        this.tooltipController = new TooltipController(view, events);
        this.$onShowLabels = this.labelController.onShow.subscribe(this.onShowLabels.bind(this));
        this.$onHideLabels = this.labelController.onHide.subscribe(this.onHideLabels.bind(this));
        this.$onShowTooltip = this.tooltipController.onShow.subscribe(this.onShowTooltip.bind(this));
        this.$onHideTooltip = this.tooltipController.onHide.subscribe(this.onHideTooltip.bind(this));

        return this;
    }
    destroy() {
        this.$MouseDown.unsubscribe();
        this.$MouseMove.unsubscribe();
        this.$MouseUp.unsubscribe();
        this.$onHideLabels.unsubscribe();
        this.$onShowLabels.unsubscribe();
        this.$onShowTooltip.unsubscribe();
        this.$onHideTooltip.unsubscribe();
        this.labelController.destroy();
        this.tooltipController.destroy();
        this.enable(false);
    }
    preRender(views: VisualizationView[], layout: WorkspaceLayoutEnum, renderer: THREE.Renderer): void { }

    public onMouseDown(e: ChartEvent): void { }
    public onMouseUp(e: ChartEvent): void { }
    public onMouseMove(e: ChartEvent): void {

        if (this.tooltip === '') { return; }

        let x = e.event.clientX;
        if (this._config.graph === GraphEnum.GRAPH_B) {
            x -= (this.view.viewport.width);
        }
        this.tooltips.innerHTML = TooltipController.generateHtml({
            position: new Vector3(x + 15, e.event.clientY - 20, 0),
            userData: { tooltip: this.tooltip, color: this.tooltipColor }
        }, this.tooltipOptions);
    }
    public onShowTooltip(e: { text: string, color: string, event: ChartEvent }): void {
        this.tooltip = e.text;
        this.tooltipColor = e.color;
        this.onMouseMove(e.event);
    }
    public onHideTooltip(): void {
        this.tooltip = '';
        this.tooltips.innerText = '';
    }
    public onShowLabels(): void {

    }
    public onHideLabels(): void {
        this.labels.innerHTML = '';
    }
    constructor() {
    }

}
