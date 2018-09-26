import * as TWEEN from '@tweenjs/tween.js';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
import { ChartEvents } from 'app/component/workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import * as THREE from 'three';
import { Vector3 } from 'three';
import {
  LabelController,
  LabelOptions
} from 'app/controller/label/label.controller';
import { ChartObjectInterface } from 'app/model/chart.object.interface';
import { DataDecorator } from 'app/model/data-map.model';
import { EntityTypeEnum } from 'app/model/enum.model';

import { SelectionController } from 'app/controller/selection/selection.controller';
import { VisualizationView } from 'app/model/chart-view.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { animate } from '@angular/animations';

const fragShader = require('raw-loader!glslify-loader!app/glsl/point.frag');
const vertShader = require('raw-loader!glslify-loader!app/glsl/point.vert');
declare var $;

export class ScatterGraph extends AbstractVisualization {
  public set data(data: GraphData) {
    this._data = data;
  }
  public get data(): GraphData {
    return this._data;
  }
  public set config(config: GraphConfig) {
    this._config = config;
  }
  public get config(): GraphConfig {
    return this._config;
  }

  // Objects
  private lines: Array<THREE.Line>;
  private points: Array<THREE.Object3D>;
  protected selectionController: SelectionController;
  private material: THREE.ShaderMaterial;
  private animationFrame = 0;
  private firstTime = true;

  // Private Subscriptions
  create(
    labels: HTMLElement,
    events: ChartEvents,
    view: VisualizationView
  ): ChartObjectInterface {
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
    // ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    // this.onShowLabels();
    // this.points = this.meshes.map(v => v.children[0]);
    // this.tooltipController.targets = this.points;
    // this.tooltipController.onShow.subscribe(this.onShow);
    // this.selectionController.targets = this.points;
  }

  private onShow(e: any): void {}

  updateData(config: GraphConfig, data: any) {
    super.updateData(config, data);
    this.removeObjects();
    this.addObjects(this._config.entity);
  }

  enable(truthy: boolean) {
    super.enable(truthy);
    this.view.renderer.domElement.style.setProperty('cursor', 'default');
    this.view.controls.enableRotate = true;
  }

  addObjects(type: EntityTypeEnum) {
    const propertyId =
      this._config.entity === EntityTypeEnum.GENE ? 'mid' : 'sid';
    const objectIds = this._data[propertyId];

    if (!this.firstTime) {
      debugger;
    }

    const data = this._data.resultScaled;
    const dataLength = data.length;
    const positionsFrom = new Float32Array(dataLength * 3);
    const positions = new Float32Array(dataLength * 3);
    const colors = new Float32Array(dataLength * 3);
    const sizes = new Float32Array(dataLength);
    let datum;
    const color = new THREE.Color();

    for (let i = 0; i < dataLength; i++) {
      datum = data[i];
      // positions.splice(i * 3, 0, ...datum);
      positions[i * 3] = datum[0];
      positions[i * 3 + 1] = datum[1];
      positions[i * 3 + 2] = datum[2];
      color.setHex((Math.random() * 0xffffff) << 0);
      const colorValues = color.toArray().map(v => v * 1.0);
      colors[i * 3] = colorValues[0];
      colors[i * 3 + 1] = colorValues[1];
      colors[i * 3 + 2] = colorValues[2];
      sizes[i] = 10.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      'positionFrom',
      new THREE.BufferAttribute(positionsFrom, 3)
    );
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xff0000) },
        animationPos: { value: this.animationFrame }
        // texture: { value: new THREE.TextureLoader().load("textures/sprites/disc.png") }
      },
      transparent: true,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      alphaTest: 0.7
    });

    const pts = new THREE.Points(geometry, this.material);
    this.meshes.push(pts);
    this.view.scene.add(pts);

    const tween = new TWEEN.Tween(this.material.uniforms.animationPos);
    tween.to({ value: 1 }, 4000);
    tween.delay(300);
    tween.onUpdate(() => {
      pts.rotateX(this.material.uniforms.animationPos.value * 0.1);
      pts.rotateY(this.material.uniforms.animationPos.value * 0.1);
      ChartScene.instance.render();
    });
    tween.easing(TWEEN.Easing.Quadratic.In);

    // tween.easing(TWEEN.Easing.Quadratic.InOut);
    tween.start();

    ChartFactory.configPerspectiveOrbit(
      this.view,
      new THREE.Box3(
        new Vector3(-250, -250, -250),
        new THREE.Vector3(250, 250, 250)
      )
    );
  }

  removeObjects() {
    this.view.scene.remove(...this.meshes);
    this.view.scene.remove(...this.lines);
    this.meshes.length = 0;
    this.lines.length = 0;
  }

  onShowLabels(): void {
    // const labelOptions = new LabelOptions(this.view, 'FORCE');
    // labelOptions.offsetX3d = 1;
    // labelOptions.maxLabels = 100;
    // this.labels.innerHTML = LabelController.generateHtml(
    //   this.meshes,
    //   labelOptions
    // );
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Meta') {
      if (this.isEnabled) {
        this.view.renderer.domElement.style.setProperty('cursor', 'crosshair');
        this.view.controls.enabled = false;
        this.tooltipController.enable = false;
        this.selectionController.setup(
          this.config,
          this.onRequestRender,
          this.onSelect,
          this.points
        );
        this.selectionController.enable = true;
      }
    }
  }
  onKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Meta') {
      if (this.isEnabled) {
        this.view.renderer.domElement.style.setProperty('cursor', 'default');
        this.view.controls.enabled = true;
        this.tooltipController.enable = true;
        this.selectionController.enable = false;
        this.selectionController.teardown();
      }
    }
  }
}
