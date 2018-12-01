import { Legend } from './../../../model/legend.model';
import { LegendPanelComponent } from './../../workspace/legend-panel/legend-panel.component';
import { EventEmitter } from '@angular/core';
import * as TWEEN from '@tweenjs/tween.js';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
import { ChartEvents, ChartEvent } from 'app/component/workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import * as THREE from 'three';
import { Vector3, Raycaster } from 'three';
import { LabelController, LabelOptions } from 'app/controller/label/label.controller';
import { ChartObjectInterface } from 'app/model/chart.object.interface';
import { DataDecorator } from 'app/model/data-map.model';
import { EntityTypeEnum, GraphEnum } from 'app/model/enum.model';

import { SelectionController } from 'app/controller/selection/selection.controller';
import { VisualizationView } from 'app/model/chart-view.model';
import { GraphConfig } from 'app/model/graph-config.model';
import kmeans from 'ml-kmeans';

const fragShader = require('raw-loader!glslify-loader!app/glsl/point.frag');
const vertShader = require('raw-loader!glslify-loader!app/glsl/point.vert');
declare var $;

export class ScatterGraph extends AbstractVisualization {
  // NO NO - For Demo Only
  public static setTime = new EventEmitter<{ time: number; graph: string }>();
  public static setColorField = new EventEmitter<{ field: any; data: Array<number> }>();
  public static setColorHighlight = new EventEmitter<THREE.BufferAttribute>();
  public static colorData: any = null;

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
  private lastKey = 0;
  private legends: Array<Legend> = [
    Legend.create('Data Points', ['Samples'], ['./assets/shapes/shape-circle-solid-legend.png'], 'SHAPE', 'DISCRETE'),
    Legend.create('Color', [], [], 'COLOR', 'DISCRETE')
  ];

  private colorIndex = [
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
  private colorIndex2 = [
    [0.91, 0.71, 0.98],
    [0.0, 0.56, 0.07],
    [0.67, 0.33, 0.87],
    [0.0, 0.79, 0.4],
    [0.77, 0.24, 0.75],
    [0.45, 0.66, 0.0],
    [0.51, 0.34, 0.87],
    [0.61, 0.84, 0.34],
    [0.2, 0.27, 0.75],
    [0.92, 0.76, 0.22],
    [0.18, 0.53, 1.0],
    [0.91, 0.51, 0.0],
    [0.01, 0.41, 0.8],
    [1.0, 0.69, 0.22],
    [0.55, 0.55, 1.0],
    [0.53, 0.55, 0.0],
    [0.82, 0.51, 1.0],
    [0.53, 0.85, 0.5],
    [0.55, 0.11, 0.59],
    [0.0, 0.45, 0.19],
    [1.0, 0.31, 0.66],
    [0.0, 0.75, 0.72],
    [0.84, 0.07, 0.17],
    [0.0, 0.79, 0.9],
    [0.97, 0.42, 0.15],
    [0.0, 0.65, 0.98],
    [0.65, 0.48, 0.0],
    [0.42, 0.22, 0.63],
    [0.84, 0.78, 0.4],
    [0.12, 0.33, 0.55],
    [1.0, 0.62, 0.36],
    [0.0, 0.46, 0.65],
    [0.64, 0.1, 0.08],
    [0.57, 0.75, 1.0],
    [0.6, 0.24, 0.0],
    [0.0, 0.43, 0.32],
    [0.81, 0.0, 0.31],
    [0.25, 0.36, 0.05],
    [1.0, 0.34, 0.45],
    [0.59, 0.59, 0.37],
    [0.35, 0.29, 0.51],
    [0.48, 0.36, 0.0],
    [0.87, 0.69, 0.88],
    [0.61, 0.14, 0.22],
    [1.0, 0.62, 0.79],
    [0.55, 0.21, 0.25],
    [1.0, 0.56, 0.44],
    [0.55, 0.37, 0.54],
    [0.67, 0.4, 0.4],
    [0.74, 0.52, 0.67]
  ];

  private toHex(color: Array<number>): string {
    const c = new THREE.Color();
    c.setRGB(color[0], color[1], color[2]);
    return '#' + c.getHexString();
  }

  public getColorData(): Promise<any> {
    if (ScatterGraph.colorData === null) {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        'Access-Control-Allow-Origin': '*'
      };
      return fetch('./assets/color-options.json', { headers: headers, method: 'GET' })
        .then(res => res.json())
        .then(x => {
          ScatterGraph.colorData = x;
        });
    }
  }

  // Private Subscriptions
  create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
    super.create(labels, events, view);
    this.meshes = [];
    this.points = [];
    this.lines = [];
    this.events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
    this.events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
    this.events.chartKeyUp.subscribe(this.onKeyUp.bind(this));
    this.events.chartResize.subscribe(this.onChartResize.bind(this));
    ScatterGraph.setColorField.subscribe(this.onSetColorField.bind(this));
    ScatterGraph.setTime.subscribe(this.onSetTime.bind(this));
    ScatterGraph.setColorHighlight.subscribe(this.onSetColorHighlight.bind(this));
    return this;
  }
  onSetColorField(e: { field: any; data: Array<number> }): void {
    // if (e.graph !== this.config.graph) {
    //   return;
    // }
    const clusterColorIndex = e.data.map(v => this.colorIndex2[v]);
    const l = e.data.length;
    for (let i = 0; i < l; i++) {
      const colorValues = clusterColorIndex[i];
      this.colors[i * 3] = colorValues[0];
      this.colors[i * 3 + 1] = colorValues[1];
      this.colors[i * 3 + 2] = colorValues[2];
    }

    // const fieldValues = ScatterGraph.colorData.values[e.field];
    // const ci =
    //   ScatterGraph.colorData.labels[e.field].length > this.colorIndex.length ? this.colorIndex2 : this.colorIndex;
    // this.legends[1].name = e.field;
    // this.legends[1].labels = ScatterGraph.colorData.labels[e.field];
    // this.legends[1].labels.push('NA');
    // this.legends[1].values = ci.map(this.toHex);

    // const clusterColorIndex = fieldValues.map(v => ci[v]);
    // const l = this._data.resultScaled.length;
    // LegendPanelComponent.setLegends.emit({
    //   legend: this.legends,
    //   graph: this.config.graph
    // });
    // for (let i = 0; i < l; i++) {
    //   const colorValues = clusterColorIndex[i];
    //   this.colors[i * 3] = colorValues[0];
    //   this.colors[i * 3 + 1] = colorValues[1];
    //   this.colors[i * 3 + 2] = colorValues[2];
    // }
    // // const cd = ScatterGraph.colorData;
    this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
    ChartScene.instance.render();
  }

  onSetTime(e: { time: number; graph: number }): void {
    if (this.config.graph === e.graph) {
      this.material.uniforms.animationPos.value = e.time;
      ChartScene.instance.render();
    }
  }
  onSetColor(colors: THREE.BufferAttribute): void {}
  onSetColorHighlight(tempColors: THREE.BufferAttribute): void {
    this.geometry.addAttribute('customColor', tempColors);
    if (this.config.graph === GraphEnum.GRAPH_A) {
      setTimeout(v => {
        ChartScene.instance.render();
      }, 500);
    }
  }
  onChartResize(e: ClientRect): void {
    this.material.uniforms.u_resolution.value.x = this.view.renderer.domElement.width;
    this.material.uniforms.u_resolution.value.y = this.view.renderer.domElement.height;
  }
  onKeyUp(e: KeyboardEvent): void {
    if (e.keyCode === this.lastKey) {
      return;
    }
    this.lastKey = e.keyCode;

    // if (e.keyCode === 50) {
    //   debugger;
    //   // const d = this._data.resultScaled;
    //   // const l = this._data.resultScaled.length;
    //   // for (let i = 0; i < l; i++) {
    //   //     this.colors[i * 3] = Math.abs(d[i] / 100);
    //   //     this.colors[i * 3 + 1] = Math.abs(d[i] / 100);
    //   //     this.colors[i * 3 + 2] = Math.abs(d[i] / 100);
    //   // }
    //   // Math.abs(83.730937901984 / 100)
    // }
    if (e.keyCode >= 49 && e.keyCode <= 53) {
      const numClusters =
        e.keyCode === 49 ? 17 : e.keyCode === 50 ? 3 : e.keyCode === 51 ? 5 : e.keyCode === 52 ? 7 : 9;
      const d = this._data;
      const clusters = kmeans(this._data.resultScaled, numClusters);

      const clusterColorIndex = clusters.clusters.map(v => this.colorIndex[v]);
      const l = this._data.resultScaled.length;
      for (let i = 0; i < l; i++) {
        const colorValues = clusterColorIndex[i];
        this.colors[i * 3] = colorValues[0];
        this.colors[i * 3 + 1] = colorValues[1];
        this.colors[i * 3 + 2] = colorValues[2];
      }

      ScatterGraph.setColorHighlight.emit(new THREE.BufferAttribute(this.colors, 3));
    }
  }
  onMouseUp(e: ChartEvent): void {
    this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
    ChartScene.instance.render();
  }
  onMouseDown(e: ChartEvent): void {
    this.raycaster.setFromCamera(e.mouse, this.view.camera);
    const intersects = this.raycaster.intersectObject(this.pts);
    if (intersects.length) {
      const intersect = intersects[0];

      const highlight = [
        this.colors[intersect.index * 3],
        this.colors[intersect.index * 3 + 1],
        this.colors[intersect.index * 3 + 2]
      ];
      const d = this.data.resultScaled;
      const tempColors = new Float32Array(this.colors.length);

      for (let i = 0, j = this.colors.length; i < j; i += 3) {
        if (
          this.colors[i] !== highlight[0] ||
          this.colors[i + 1] !== highlight[1] ||
          this.colors[i + 2] !== highlight[2]
        ) {
          tempColors[i] = tempColors[i + 1] = tempColors[i + 2] = 0.8;
        } else {
          tempColors[i] = this.colors[i];
          tempColors[i + 1] = this.colors[i + 1];
          tempColors[i + 2] = this.colors[i + 2];
        }
      }

      ScatterGraph.setColorHighlight.emit(new THREE.BufferAttribute(tempColors, 3));
      // this.geometry.addAttribute(
      //   'customColor',
      //   new THREE.BufferAttribute(tempColors, 3)
      // );
      // ChartScene.instance.render();
    }
  }

  destroy() {
    super.destroy();
    // TODO: Remove Subscriptions
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
    const propertyId = this._config.entity === EntityTypeEnum.GENE ? 'mid' : 'sid';
    const objectIds = this._data[propertyId];

    const inheritColorPosition = this.geometry;

    const data = this._data.resultScaled;
    const dataLength = data.length;

    const positions = new Float32Array(dataLength * 3);
    let datum;
    let positionsFrom = new Float32Array(dataLength * 3);

    const sizes = new Float32Array(dataLength);
    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    if (inheritColorPosition) {
      positionsFrom = this.geometry.getAttribute('position').array as Float32Array;
    } else {
      this.colors = new Float32Array(dataLength * 3);
    }
    for (let i = 0; i < dataLength; i++) {
      datum = data[i];
      positions[i * 3] = datum[0];
      positions[i * 3 + 1] = datum[1];
      positions[i * 3 + 2] = datum[2];
      if (!inheritColorPosition) {
        positionsFrom[i * 3] = getRandomInt(0, 900) - 450;
        positionsFrom[i * 3 + 1] = getRandomInt(0, 900) - 450;
        positionsFrom[i * 3 + 2] = getRandomInt(0, 900) - 450;
        this.colors[i * 3] = 0.12;
        this.colors[i * 3 + 1] = 0.53;
        this.colors[i * 3 + 2] = 0.9;
      }
      sizes[i] = 10.0;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('positionFrom', new THREE.BufferAttribute(positionsFrom, 3));

    this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        animationPos: { value: this.animationFrame },
        selectedColor: { value: new THREE.BufferAttribute(new Float32Array([0.0, 0.0, 0.0]), 3) },
        u_resolution: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      alphaTest: 0.7
    });

    this.material.uniforms.u_resolution.value.x = this.view.renderer.domElement.width;
    this.material.uniforms.u_resolution.value.y = this.view.renderer.domElement.height;
    console.dir(this.material.uniforms.u_resolution.value);

    this.pts = new THREE.Points(this.geometry, this.material);
    this.meshes.push(this.pts);
    this.view.scene.add(this.pts);

    const tween = new TWEEN.Tween(this.material.uniforms.animationPos);
    tween.to({ value: 1 }, 3000);
    tween.delay(0);
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
      new THREE.Box3(new Vector3(-250, -250, -250), new THREE.Vector3(250, 250, 250))
    );
  }
  constructor() {
    super();
    this.getColorData();
  }

  removeObjects() {
    this.view.scene.remove(...this.meshes);
    this.view.scene.remove(...this.lines);
    this.meshes.length = 0;
    this.lines.length = 0;
  }
}
