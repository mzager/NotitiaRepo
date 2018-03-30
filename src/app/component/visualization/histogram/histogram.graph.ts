import { HistogramDataModel, HistogramConfigModel } from './histogram.model';
import { GraphEnum } from 'app/model/enum.model';
import { EventEmitter } from '@angular/core';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import * as THREE from 'three';
export class HistogramGraph extends AbstractVisualization {

    public set data(data: HistogramDataModel) { this._data = data; }
    public get data(): HistogramDataModel { return this._data as HistogramDataModel; }
    public set config(config: HistogramConfigModel) { this._config = config; }
    public get config(): HistogramConfigModel { return this._config as HistogramConfigModel; }


    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = true;
    }


    addObjects(type: EntityTypeEnum): void {

        const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const objectIds = this.data[propertyId];

        // this.data.nodes.forEach((node, index) => {
        //     const group = ChartFactory.createDataGroup(
        //         objectIds[index], this.config.entity, new THREE.Vector3(node.x, node.y, node.z));
        //     this.meshes.push(group);
        //     this.view.scene.add(group);
        // });
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }

    removeObjects(): void {
        this.view.scene.remove(...this.meshes);
        this.meshes.length = 0;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void { }
}
