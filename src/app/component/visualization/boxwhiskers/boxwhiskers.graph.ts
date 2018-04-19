import { LabelController, ILabel, LabelOptions } from './../../../controller/label/label.controller';
import { MeshLine } from 'three.meshline';
import { scaleLinear } from 'd3-scale';
import { BoxWhiskersDataModel, BoxWhiskersConfigModel } from './boxwhiskers.model';
import { GraphEnum } from 'app/model/enum.model';
import { EventEmitter } from '@angular/core';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartFactory, DataDecoatorRenderer } from './../../workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import * as THREE from 'three';
import { Vector2, MeshPhongMaterial, Vector3 } from 'three';
import { MeshText2D, textAlign } from 'three-text2d';


export class BoxWhiskersGraph extends AbstractVisualization {

    public set data(data: BoxWhiskersDataModel) { this._data = data; }
    public get data(): BoxWhiskersDataModel { return this._data as BoxWhiskersDataModel; }
    public set config(config: BoxWhiskersConfigModel) { this._config = config; }
    public get config(): BoxWhiskersConfigModel { return this._config as BoxWhiskersConfigModel; }


    public labelsForX: Array<ILabel>;
    public labelsForY: Array<ILabel>;
    public labelsForQ1: Array<ILabel>;
    public labelsForQ2: Array<ILabel>;
    public labelsForQ3: Array<ILabel>;
    public labelsForQ4: Array<ILabel>;
    // public labelsForTitles: Array<ILabel>;


    public globalMeshes: Array<THREE.Object3D>;
    public lines: Array<THREE.Line | THREE.Mesh>;
    public bars: Array<THREE.Mesh>;
    public entityWidth = 6;
    public text: Array<MeshText2D>;

    public renderer: DataDecoatorRenderer = (group: THREE.Group, mesh: THREE.Sprite, decorators: Array<DataDecorator>,
        i: number, count: number): void => {

        const color = mesh.material.color.getHex();
        mesh.material.color.setHex(0xFFFFFF);
        mesh.material.opacity = 1;
        mesh.scale.set(2, 2, 2);
        const x = group.userData.index;
        const m = ChartFactory.getColorPhong(color);
        m.opacity = 0.8;
        m.transparent = true;
        this.bars[x * 2].material = m;
        this.bars[(x * 2) + 1].material = m;
        this.lines[x].material = ChartFactory.getLineColor(color);
    }

    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        this.globalMeshes = [];
        this.lines = [];
        this.bars = [];
        this.text = [];
        this.labelsForX = [];
        this.labelsForY = [];
        this.labelsForQ1 = [];
        this.labelsForQ2 = [];
        this.labelsForQ3 = [];
        this.labelsForQ4 = [];
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer, 3);
    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = false;
        // this.labelLayout.enable = truthy;
    }


    addObjects(type: EntityTypeEnum): void {
        this.addGlobalMeshes();
        const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'markerIds' : 'sampleIds';
        const objectIds = this.data[propertyId];
        const xOffset = (this.entityWidth * this.data.result.length) * -0.5;

        const domain = Math.ceil(Math.max(Math.abs(this.data.min), Math.abs(this.data.max)));
        const scale = scaleLinear().domain([-domain, domain]).range([-600, 600]);

        const halfWidth = this.entityWidth * 0.5;

        const medianPoints = [];
        this.data.result
            .sort((a, b) => a.median - b.median)
            .forEach((node, index) => {

                const median = scale(node.median);

                const xPos = xOffset + (this.entityWidth * index);
                const group = ChartFactory.createDataGroup(
                    objectIds[index], this.config.entity, new THREE.Vector3(xPos, median, 0.02));
                // group.userData.tooltip = 'bbb';
                this.meshes.push(group);
                this.view.scene.add(group);

                this.labelsForX.push({
                    position: new THREE.Vector3(xPos, median, 0.02),
                    userData: { 'tooltip': node.median.toString() }
                });

                // Line
                const line = ChartFactory.lineAllocate(0xFF0000, new Vector2(xPos, scale(node.min)), new Vector2(xPos, scale(node.max)));
                this.lines.push(line);
                this.view.scene.add(line);
                medianPoints.push(new Vector3(xPos, median, 0));

                const q1Height = median - scale(node.quartiles[0]);
                const q2Height = scale(node.quartiles[2]) - median;

                this.labelsForQ1.push({
                    position: new THREE.Vector3(q1Height, median, 0.02),
                    userData: { 'tooltip': node.quartiles[0].toString() }
                });

                const q1Box = ChartFactory.planeAllocate(0x029BE5, this.entityWidth, q1Height, {});
                q1Box.position.set(xPos, median - (q1Height * .5), 0);
                (q1Box.material as MeshPhongMaterial).opacity = 0.8;
                (q1Box.material as MeshPhongMaterial).transparent = true;
                this.bars.push(q1Box);
                this.view.scene.add(q1Box);

                const q2Box = ChartFactory.planeAllocate(0x029BE5, this.entityWidth, q2Height, {});
                q2Box.position.set(xPos, median + (q2Height * .5), 0);
                (q2Box.material as MeshPhongMaterial).opacity = 0.8;
                (q2Box.material as MeshPhongMaterial).transparent = true;
                this.bars.push(q2Box);
                this.view.scene.add(q2Box);

                group.userData.index = index;
            });

        const curve = new THREE.CatmullRomCurve3(medianPoints);
        curve['type'] = 'chordal';
        const path = new THREE.CurvePath();
        path.add(curve);

        const geo = new THREE.Geometry().setFromPoints(curve.getPoints(this.data.result.length));
        const chromosomeLine = new MeshLine();
        chromosomeLine.setGeometry(geo);
        const chromosomeMesh = new THREE.Mesh(chromosomeLine.geometry,
            ChartFactory.getMeshLine(0xFF0000, 5));

        (chromosomeMesh.material as MeshPhongMaterial).opacity = .5;
        (chromosomeMesh.material as MeshPhongMaterial).transparent = true;
        chromosomeMesh.frustumCulled = false;
        chromosomeMesh.position.setZ(0.01);
        this.lines.push(chromosomeMesh);
        this.view.scene.add(chromosomeMesh);

        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer, 3);
        this.tooltipController.targets = this.meshes;

    }

    removeObjects(): void {
        this.view.scene.remove(...this.globalMeshes);
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.lines);
        this.view.scene.remove(...this.text);
        this.view.scene.remove(...this.bars);
        this.globalMeshes.length = 0;
        this.meshes.length = 0;
        this.lines.length = 0;
        this.text.length = 0;
        this.bars.length = 0;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void {
        // Makes tooltips change
        super.onMouseMove(e);
    }
    onShowLabels(): void {
        // console.log(this.view.camera.position.z);

        // Step 1 - Create Options
        const optionsForX = new LabelOptions(this.view, 'PIXEL');
        optionsForX.fontsize = 15;
        optionsForX.origin = 'RIGHT';
        optionsForX.align = 'RIGHT';

        const optionsForQ1 = new LabelOptions(this.view, 'PIXEL');
        optionsForQ1.fontsize = 15;
        optionsForQ1.rotate = 90;

        // const optionsForTitles = new LabelOptions(this.view, 'PIXEL');
        // optionsForTitles.fontsize = 15;
        // optionsForTitles.ignoreFrustumY = true;
        // optionsForTitles.absoluteY = 60;

        this.labels.innerHTML =
            LabelController.generateHtml(this.meshes, optionsForX) +
            LabelController.generateHtml(this.labelsForQ1, optionsForQ1);
        // LabelController.generateHtml(this.labelsForTitles, optionsForTitles);
    }

    addGlobalMeshes(): void {
        const width = this.entityWidth * this.data.result.length;
        const left = (-width * 0.5) - 5;
        const right = (width * 0.5) + 5;
        const line = ChartFactory.lineAllocate(0x4a148c, new Vector2(left, 0), new Vector2(right, 0));
        line.position.setZ(1);
        this.globalMeshes.push(line);
        this.view.scene.add(line);
    }
}
