import { DragSelectionControl } from './../drag.selection.control';
import { AbstractVisualization } from './../visualization.abstract.component';
import { EventEmitter, Output } from '@angular/core';

import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { GraphConfig } from 'app/model/graph-config.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvents, ChartEvent } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { FontFactory } from './../../../service/font.factory';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { DimensionEnum, EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { LdaConfigModel, LdaDataModel } from './lda.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import { Memoize } from 'typescript-memoize';
import { ShapeEnum, GraphEnum } from 'app/model/enum.model';

export class LdaGraph  extends AbstractVisualization {

        // Chart Elements
        private data: LdaDataModel;
        private config: LdaConfigModel;

        // Objects
        private lines: Array<THREE.Line>;
        private controls: DragSelectionControl;

        // Private Subscriptions
        create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
            super.create(labels, events, view);
            this.meshes = [];
            this.lines = [];
            this.controls = new DragSelectionControl();
            this.controls.create(events, view, this.meshes, this.onRequestRender, this.onSelect);
            return this;
        }

        destroy() {
            this.enable(false);
            this.removeObjects();
        }

        update(config: GraphConfig, data: any) {
            this.config = config as LdaConfigModel;
            this.data = data;
            this.removeObjects();
            this.addObjects();
        }

        enable(truthy: boolean) {
            if (this.isEnabled === truthy) { return; }
            this.isEnabled = truthy;
            this.view.controls.enabled = this.isEnabled;
            this.controls.enabled = this.isEnabled;
        }

        addObjects() {
            const weightLength = this.data.resultScaled.length;
            const layoutLength = this.data.resultScaled.length;
            const sizeLength = this.data.pointSize.length;
            const shapeLength = this.data.pointShape.length;
            const colorLength = this.data.pointColor.length;

            for (let i = 0; i < layoutLength; i++) {
                const position = this.data.resultScaled[i];
                const mesh = ChartFactory.meshAllocate(
                    (i < colorLength) ? this.data.pointColor[i] : 0xDD2C00,
                    (i < shapeLength) ? this.data.pointShape[i] : ShapeEnum.SQUARE,
                    (i < sizeLength) ? this.data.pointSize[i] * 2 : 1,
                    new THREE.Vector3(
                        position[0],
                        (this.config.dimension === DimensionEnum.ONE_D) ? 0 : position[1],
                        (this.config.dimension !== DimensionEnum.THREE_D) ? 0 : position[2]
                    ), {
                        color: this.data.pointColor[i],
                        id: this.data.sampleIds[i]
                    });
                this.meshes.push(mesh);
                this.view.scene.add(mesh);
            }
        }

        removeObjects() {
            this.meshes.forEach(v => {
                ChartFactory.meshRelease(v as THREE.Mesh);
                this.view.scene.remove(v);
            });
            this.meshes.length = 0;
            this.lines.forEach(v => this.view.scene.remove(v));
            this.lines.length = 0;
        }

}
