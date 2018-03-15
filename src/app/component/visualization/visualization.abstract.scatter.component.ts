import { DataDecorator } from './../../model/data-map.model';
import { ChartUtil } from './../workspace/chart/chart.utils';
import { GraphData } from './../../model/graph-data.model';
import { ChartFactory } from './../workspace/chart/chart.factory';
import { DragSelectionControl } from './drag.selection.control';
import { GraphConfig } from 'app/model/graph-config.model';
import { AbstractVisualization } from './visualization.abstract.component';
import { Subscription } from 'rxjs/Subscription';
import { WorkspaceLayoutEnum, DimensionEnum, CollectionTypeEnum } from './../../model/enum.model';
import { VisualizationView } from './../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../workspace/chart/chart.events';
import { EventEmitter } from '@angular/core';
import { GraphEnum, EntityTypeEnum, DirtyEnum, ShapeEnum, VisualizationEnum } from 'app/model/enum.model';
import { ChartObjectInterface } from './../../model/chart.object.interface';
import * as THREE from 'three';
import { CircleGeometry } from 'three';
export class AbstractScatterVisualization extends AbstractVisualization {

    // Chart Elements
    private data: GraphData;
    public config: GraphConfig;
    private decorators: Array<DataDecorator>;

    // Objects
    private lines: Array<THREE.Line>;
    private controls: DragSelectionControl;
    private overlay: HTMLElement;
    private tooltips: HTMLElement;

    // Private Subscriptions
    private sMouseMove: Subscription;
    private sMouseDown: Subscription;
    private sMouseUp: Subscription;

    // Private Subscriptions
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild( this.tooltips );

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild( this.overlay );
        this.meshes = [];
        this.lines = [];
        this.controls = new DragSelectionControl();
        this.controls.create(events, view, this.meshes, this.onRequestRender, this.onSelect);
        this.view.controls.enableRotate = true;

        this.decorators = [];
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }
    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        if (config.entity === EntityTypeEnum.PATIENT) {

        }
    }
    updateData(config: GraphConfig, data: any) {
        this.config = config as GraphConfig;
        this.data = data;
        this.removeObjects();
        this.addObjects(this.config.entity);
        /*
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects(this.config.entity);
        }

        if (this.config.dirtyFlag & DirtyEnum.COLOR) {
            const idProperty = (config.entity === EntityTypeEnum.GENE) ? 'mid' :
                (this.config.pointColor.ctype & CollectionTypeEnum.MOLECULAR) ? 'sid' : 'pid';
            const objMap = data.pointColor;
            this.meshes.forEach(mesh => {
                const color = objMap[mesh.userData[idProperty]];
                (mesh as THREE.Mesh).material = ChartFactory.getColorPhong(color);
                mesh.userData.color = color;
            });
        }

        if (this.config.dirtyFlag & DirtyEnum.SIZE) {
            const idProperty = (config.entity === EntityTypeEnum.GENE) ? 'mid' :
                (this.config.pointColor.ctype & CollectionTypeEnum.MOLECULAR) ? 'sid' : 'pid';
            const objMap = data.pointSize;
            this.meshes.forEach(mesh => {
                const size = objMap[mesh.userData[idProperty]] as number;
                mesh.scale.set(size, size, size);
            });
        }

        if (this.config.dirtyFlag & DirtyEnum.SHAPE) {
            const idProperty = (config.entity === EntityTypeEnum.GENE) ? 'mid' :
                (this.config.pointColor.ctype & CollectionTypeEnum.MOLECULAR) ? 'sid' : 'pid';

            this.meshes.forEach(mesh => {
                const objMap = data.pointShape;
                let shape = objMap[mesh.userData[idProperty]] as number;
                console.log(shape);
                if (shape === undefined) { shape = 1; }
                const cf = ChartFactory;
                (mesh as THREE.Mesh).geometry = ChartFactory.getShape(shape);
            });
        }
        */
    }

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        this.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            this.sMouseMove.unsubscribe();
            this.tooltips.innerHTML = '';
        }
    }

    addObjects(type: EntityTypeEnum) {
        const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const objectIds = this.data[propertyId];
        this.data.resultScaled.forEach( (point, index) => {
            const group = ChartFactory.getMesh(
                objectIds[index], this.config.entity, this.decorators,
                new THREE.Vector3(...point),
                this.view.camera.position);
            this.meshes.push(group);
            this.view.scene.add(group);
        });

        // const weightLength = this.data['resultScaled'].length;
        // const layoutLength = this.data['resultScaled'].length;
        // for (let i = 0; i < layoutLength; i++) {
        //     const position = this.data['resultScaled'][i];
        //     const color = 0x039be5;
        //     const shape = ShapeEnum.CIRCLE;
        //     const size = 1;
        //     const userData = (type === EntityTypeEnum.GENE) ?
        //         {
        //             color: color,
        //             mid: this.data['mid'][i]
        //         } : {
        //             color: color,
        //             pid: this.data['pid'][i],
        //             sid: this.data['sid'][i]
        //         };
        //     const mesh = ChartFactory.meshAllocate(
        //         color,
        //         shape,
        //         size,
        //         new THREE.Vector3(
        //             position[0],
        //             position[1],
        //             position[2]
        //         ), userData);
        //     // mesh.material = ChartFactory.getOutlineMaterial();
        //     this.meshes.push(mesh);
        //     this.view.scene.add(mesh);
        // }
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


    private onMouseMove(e: ChartEvent): void {
        const hit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);

        if (hit.length > 0) {

            if (hit[0].object.userData === undefined) {
                return;
            }
            const xPos = e.mouse.xs + 10;
            const yPos = e.mouse.ys;
            this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
                '3px;z-index:9999;position:absolute;left:' +
                xPos + 'px;top:' +
                yPos + 'px;">' +
                hit[0].object.userData.sid + '</div>';
            return;
        }
        this.tooltips.innerHTML = '';
    }


}
