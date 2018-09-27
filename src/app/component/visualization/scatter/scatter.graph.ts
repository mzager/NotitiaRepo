import * as TWEEN from '@tweenjs/tween.js';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
import {
  ChartEvents,
  ChartEvent
} from 'app/component/workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import * as THREE from 'three';
import { Vector3, Raycaster } from 'three';
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
import kmeans from 'ml-kmeans';

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
  private pts: THREE.Points;
  protected selectionController: SelectionController;
  private material: THREE.ShaderMaterial;
  private geometry: THREE.BufferGeometry;
  private animationFrame = 0;
  private raycaster = new THREE.Raycaster();
  private colors;

  // Private Subscriptions
  create(
    labels: HTMLElement,
    events: ChartEvents,
    view: VisualizationView
  ): ChartObjectInterface {
    super.create(labels, events, view);
    this.events.chartMouseDown.subscribe(this.onMouseDown);
    this.events.chartMouseUp.subscribe(this.onMouseUp);
    this.events.chartKeyUp.subscribe(this.onKeyUp);
    this.meshes = [];
    this.points = [];
    this.lines = [];
    return this;
  }
  onKeyUp(e: KeyboardEvent): void {
    if (e.keyCode === 49) {
      const clusters = kmeans(this._data.result, 17);
      const colorIndex = [
        [0.96, 0.26, 0.21],
        [0.91, 0.12, 0.39],
        [0.61, 0.15, 0.69],
        [0.4, 0.23, 0.72],
        [0.25, 0.32, 0.71],
        [0.13, 0.59, 0.95],
        [0.01, 0.66, 0.96],
        [0.0, 0.74, 0.83],
        [0.0, 0.59, 0.53],
        [0.3, 0.69, 0.31],
        [0.55, 0.76, 0.29],
        [0.8, 0.86, 0.22],
        [1.0, 0.92, 0.23],
        [1.0, 0.76, 0.03],
        [1.0, 0.6, 0.0],
        [1.0, 0.34, 0.13],
        [0.47, 0.33, 0.28],
        [0.62, 0.62, 0.62],
        [0.38, 0.49, 0.55]
      ];
      const clusterColorIndex = clusters.clusters.map(v => colorIndex[v]);
      const l = this._data.result.length;
      for (let i = 0; i < l; i++) {
        const colorValues = clusterColorIndex[i];
        this.colors[i * 3] = colorValues[0];
        this.colors[i * 3 + 1] = colorValues[1];
        this.colors[i * 3 + 2] = colorValues[2];
      }
      this.geometry.addAttribute(
        'customColor',
        new THREE.BufferAttribute(this.colors, 3)
      );
      ChartScene.instance.render();
    }
  }
  onMouseUp(e: ChartEvent): void {}
  onMouseDown(e: ChartEvent): void {
    // this.raycaster.setFromCamera(e.mouse, this.view.camera);
    // const intersects = this.raycaster.intersectObject(this.pts);
    // if (intersects.length) {
    //   const intersect = intersects[0];
    //   const highlight = [
    //     this.colors[intersect.index],
    //     this.colors[intersect.index + 1],
    //     this.colors[intersect.index + 2]
    //   ];
    //   this.material.uniforms.selectedColor.value = highlight;
    // }
  }

  destroy() {
    super.destroy();
    this.removeObjects();
  }

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

    const data = this._data.resultScaled;
    const dataLength = data.length;

    const positions = new Float32Array(dataLength * 3);
    let datum;
    const positionsFrom = new Float32Array(dataLength * 3);
    this.colors = new Float32Array(dataLength * 3);
    const sizes = new Float32Array(dataLength);
    const color = new THREE.Color();
    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    for (let i = 0; i < dataLength; i++) {
      datum = data[i];
      positions[i * 3] = datum[0];
      positions[i * 3 + 1] = datum[1];
      positions[i * 3 + 2] = datum[2];
      positionsFrom[i * 3] = getRandomInt(0, 900) - 450;
      positionsFrom[i * 3 + 1] = getRandomInt(0, 900) - 450;
      positionsFrom[i * 3 + 2] = getRandomInt(0, 900) - 450;
      this.colors[i * 3] = 0;
      this.colors[i * 3 + 1] = 0;
      this.colors[i * 3 + 2] = 1;
      sizes[i] = 10.0;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute(
      'positionFrom',
      new THREE.BufferAttribute(positionsFrom, 3)
    );

    this.geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.addAttribute(
      'customColor',
      new THREE.BufferAttribute(this.colors, 3)
    );
    this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        // color: { value: new THREE.Color(0xff0000) },
        animationPos: { value: this.animationFrame },
        selectedColor: {
          value: new THREE.BufferAttribute(new Float32Array([0.0, 0.0, 0.0]), 3)
        }
        // texture: { value: new THREE.TextureLoader().load("textures/sprites/disc.png") }
      },
      transparent: true,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      alphaTest: 0.7
    });

    this.pts = new THREE.Points(this.geometry, this.material);
    this.meshes.push(this.pts);
    this.view.scene.add(this.pts);

    const tween = new TWEEN.Tween(this.material.uniforms.animationPos);
    tween.to({ value: 1 }, 5000);
    tween.delay(900);
    tween.onUpdate(() => {
      // this.pts.rotateX(this.material.uniforms.animationPos.value * 0.1);
      // this.pts.rotateY(this.material.uniforms.animationPos.value * 0.1);
      // this.pts.rotateZ(this.material.uniforms.animationPos.value * 0.1);
      ChartScene.instance.render();
    });
    tween.easing(TWEEN.Easing.Quadratic.Out);
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
}
