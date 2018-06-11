import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { LabelController, LabelOptions } from '../../controller/label/label.controller';
import { ChartObjectInterface } from '../../model/chart.object.interface';
import { DataDecorator } from '../../model/data-map.model';
import { EntityTypeEnum } from '../../model/enum.model';
import { ChartEvents } from '../workspace/chart/chart.events';
import { SelectionController } from './../../controller/selection/selection.controller';
import { ChartSelection } from './../../model/chart-selection.model';
import { VisualizationView } from './../../model/chart-view.model';
import { GraphConfig } from './../../model/graph-config.model';
import { AbstractVisualization } from './visualization.abstract.component';
declare var $;

export class AbstractScatterVisualization extends AbstractVisualization {

    public set data(data: GraphData) { this._data = data; }
    public get data(): GraphData { return this._data; }
    public set config(config: GraphConfig) { this._config = config; }
    public get config(): GraphConfig { return this._config; }

    // Objects
    private lines: Array<THREE.Line>;
    private points: Array<THREE.Object3D>;
    protected selectionController: SelectionController;


    // Private Subscriptions
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
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
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
        this.onShowLabels();
        this.points = this.meshes.map(v => v.children[0]);
        this.tooltipController.targets = this.points;
        this.tooltipController.onShow.subscribe(this.onShow);
        this.selectionController.targets = this.points;
    }

    private onShow(e: any): void {

    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this._config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.renderer.domElement.style.setProperty('cursor', 'move');
        this.view.controls.enableRotate = true;
    }

    addObjects(type: EntityTypeEnum) {
        const propertyId = (this._config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const objectIds = this._data[propertyId];
        this._data.resultScaled.forEach((point, index) => {
            const group = ChartFactory.createDataGroup(
                objectIds[index], this._config.entity, new Vector3(...point));
            this.meshes.push(group);
            this.view.scene.add(group);
        });
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
        this.points = this.meshes.map(v => v.children[0]);
        this.tooltipController.targets = this.points;

        ChartFactory.configPerspectiveOrbit(this.view,
            new THREE.Box3(
                new Vector3(-250, -250, -250),
                new THREE.Vector3(250, 250, 250)));
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
        this.labels.innerHTML = LabelController.generateHtml(this.meshes, labelOptions);
    }


    onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Meta') {
            if (this.isEnabled) {
                this.view.renderer.domElement.style.setProperty('cursor', 'crosshair');
                this.view.controls.enabled = false;
                this.tooltipController.enable = false;
                this.selectionController.setup(this.config, this.onRequestRender, this.onSelect, this.points);
                this.selectionController.enable = true;
            }
        }
    }
    onKeyUp(e: KeyboardEvent): void {
        if (e.key === 'Meta') {
            if (this.isEnabled) {
                this.view.renderer.domElement.style.setProperty('cursor', 'move');
                this.view.controls.enabled = true;
                this.tooltipController.enable = true;
                this.selectionController.enable = false;
                this.selectionController.teardown();
            }
        }
    }
}
