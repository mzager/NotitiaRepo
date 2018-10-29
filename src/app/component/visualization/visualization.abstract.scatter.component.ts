import { ScatterSelectionLassoController } from './../../controller/scatter/scatter.selection.lasso.controller';
import { AbstractScatterSelectionController } from './../../controller/scatter/abstract.scatter.selection.controller';
import { ScatterSelectionKddController } from './../../controller/scatter/scatter.selection.kdd.controller';
import { ScatterSelectionHullController } from './../../controller/scatter/scatter.selection.hull.controller';
// import { ScatterSelectionController } from '../../controller/scatter/scatter.selection.kdd.controller';
import { ChartScene } from './../workspace/chart/chart.scene';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import { Subscription } from 'rxjs';
// import * as THREE from 'three';
import { Vector3 } from 'three';
import {
  LabelController,
  LabelOptions
} from '../../controller/label/label.controller';
import { ChartObjectInterface } from '../../model/chart.object.interface';
import {
  DataDecorator,
  DataDecoratorTypeEnum
} from '../../model/data-map.model';
import { EntityTypeEnum } from '../../model/enum.model';
import { ChartEvents } from '../workspace/chart/chart.events';
import { ChartSelection } from './../../model/chart-selection.model';
import { VisualizationView } from './../../model/chart-view.model';
import { GraphConfig } from './../../model/graph-config.model';
import { AbstractVisualization } from './visualization.abstract.component';
const fragShader = require('raw-loader!glslify-loader!app/glsl/scatter.frag');
const vertShader = require('raw-loader!glslify-loader!app/glsl/scatter.vert');
declare var $;
declare var THREE;
/*
circle
blast
*/
export class AbstractScatterVisualization extends AbstractVisualization {
  public static textureLoader = new THREE.TextureLoader();

  // tslint:disable-next-line:max-line-length
  public static textureImages = [
    './assets/shapes/shape-circle-solid.png',
    './assets/shapes/shape-blast-solid.png',
    './assets/shapes/shape-diamond-solid.png',
    './assets/shapes/shape-polygon-solid.png',
    './assets/shapes/shape-square-solid.png',
    './assets/shapes/shape-star-solid.png',
    './assets/shapes/shape-triangle-solid.png',
    './assets/shapes/shape-na-solid.png'
  ];
  public static textures = AbstractScatterVisualization.textureImages.reduce(
    (p, c, i) => {
      p['uTexture' + i.toString()] = {
        value: AbstractScatterVisualization.textureLoader.load(c)
      };
      return p;
    },
    {}
  );

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
  protected selectionController: AbstractScatterSelectionController;
  private selectSubscription: Subscription;
  private pointsMaterial: THREE.ShaderMaterial;
  private pointsGeometry = new THREE.BufferGeometry();
  private points: THREE.Points;
  private positionsFrame: Number;
  private positionsPrev: Float32Array;
  private positions: Float32Array;
  private colors: Float32Array;
  private alphas: Float32Array;
  private shapes: Float32Array;
  private sizes: Float32Array;
  private selected: Float32Array;
  private ids: Array<string>;
  private lbls: Array<string>;

  public getTargets(): {
    point: Vector3;
    id: string;
    idType: EntityTypeEnum;
  }[] {
    const p = this.points;
    const positions = this.points.geometry['attributes'].position.array;
    const pts = new Array<{
      point: Vector3;
      id: string;
      idType: EntityTypeEnum;
    }>(positions.length / 3);
    for (let i = 0; i < positions.length; i += 3) {
      pts[i / 3] = {
        point: new THREE.Vector3(
          positions[i],
          positions[i + 1],
          positions[i + 2]
        ),
        id: this.ids[i / 3],
        idType: this.config.entity
      };
    }
    return pts;
  }

  // Private Subscriptions
  create(
    labels: HTMLElement,
    events: ChartEvents,
    view: VisualizationView
  ): ChartObjectInterface {
    super.create(labels, events, view);

    this.selectionController = new ScatterSelectionLassoController(
      view,
      events
    );
    this.selectionController.enable = true;
    this.selectSubscription = this.selectionController.onSelect.subscribe(
      (ids: Array<number>) => {
        const selected = this.pointsGeometry.attributes.gSelected;
        ids.forEach(v => {
          selected.array[v / 3] = 1.0;
        });
        selected.needsUpdate = true;
        this.onRequestRender.emit(this.config.graph);
      }
    );
    return this;
  }

  destroy() {
    super.destroy();
    // this.selectionController.destroy();
    // this.selectSubscription.unsubscribe();
    this.removeObjects();
  }

  updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
    super.updateDecorator(config, decorators);
    if (this.decorators.length === 0) {
      return;
    }

    const propertyId =
      this._config.entity === EntityTypeEnum.GENE ? 'mid' : 'sid';
    const ids = this.ids;
    decorators.forEach(decorator => {
      switch (decorator.type) {
        case DataDecoratorTypeEnum.SHAPE:
          const textureLookup = AbstractScatterVisualization.textureImages.reduce(
            (p, c, i) => {
              p['s' + c.replace('.png', '-legend.png')] = i;
              return p;
            },
            {}
          );

          const shapeMap = decorator.values.reduce((p, c) => {
            p[c[propertyId]] = textureLookup['s' + c.value];
            return p;
          }, {});
          this.ids.forEach((id, index) => {
            this.shapes[index] = shapeMap[id];
            if (this.shapes[index] === undefined) {
              this.shapes[index] = 7;
            }
          });

          this.pointsGeometry.addAttribute(
            'gShape',
            new THREE.BufferAttribute(this.shapes, 1)
          );
          ChartScene.instance.render();
          break;
        case DataDecoratorTypeEnum.COLOR:
          const colorsMap = decorator.values.reduce((p, c) => {
            const color = new THREE.Color();
            color.set(c.value);
            p[c[propertyId]] = color;
            return p;
          }, {});
          this.ids.forEach((id, index) => {
            const col = colorsMap[id];
            this.colors[index * 3] = col.r;
            this.colors[index * 3 + 1] = col.g;
            this.colors[index * 3 + 2] = col.b;
          });
          this.pointsGeometry.addAttribute(
            'gColor',
            new THREE.BufferAttribute(this.colors, 3)
          );
          ChartScene.instance.render();
          break;
        case DataDecoratorTypeEnum.SHAPE:
      }
    });
    this.selectionController.points = this.points;
    this.selectionController.tooltips = this.ids.map(v => {
      return [{ key: 'id', value: v }];
    });

    ChartFactory.decorateDataGroups(this.meshes, this.decorators);
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
    this.view.controls.enableRotate = true;
  }

  addObjects(type: EntityTypeEnum) {
    const propertyId =
      this._config.entity === EntityTypeEnum.GENE ? 'mid' : 'sid';
    this.ids = this._data[propertyId];
    this.positionsFrame = 0;
    this.positionsPrev = new Float32Array(this._data.resultScaled.length * 3);
    this.positions = new Float32Array(this._data.resultScaled.length * 3);
    this.colors = new Float32Array(this._data.resultScaled.length * 3);
    this.sizes = new Float32Array(this._data.resultScaled.length);
    this.alphas = new Float32Array(this._data.resultScaled.length);
    this.shapes = new Float32Array(this._data.resultScaled.length);
    this.selected = new Float32Array(this._data.resultScaled.length);

    this._data.resultScaled.forEach((point, index) => {
      this.selected[index] = 0.0;
      this.sizes[index] = 50;
      this.shapes[index] = 0.0;
      this.alphas[index] = 0.9;
      this.colors[index * 3] = 0.12;
      this.colors[index * 3 + 1] = 0.53;
      this.colors[index * 3 + 2] = 0.9;
      for (let i = 0; i < 3; i++) {
        this.positionsPrev[index * 3 + i] = point[i];
        this.positions[index * 3 + i] = point[i];
      }
    });

    this.pointsGeometry = new THREE.BufferGeometry();
    this.pointsGeometry.addAttribute(
      'gPositionFrom',
      new THREE.BufferAttribute(this.positionsPrev, 3)
    );
    this.pointsGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.pointsGeometry.addAttribute(
      'gColor',
      new THREE.BufferAttribute(this.colors, 3)
    );
    this.pointsGeometry.addAttribute(
      'gShape',
      new THREE.BufferAttribute(this.shapes, 1)
    );
    this.pointsGeometry.addAttribute(
      'gSize',
      new THREE.BufferAttribute(this.sizes, 1)
    );
    this.pointsGeometry.addAttribute(
      'gAlpha',
      new THREE.BufferAttribute(this.alphas, 1)
    );
    this.pointsGeometry.addAttribute(
      'gSelected',
      new THREE.BufferAttribute(this.selected, 1)
    );

    const uniforms = Object.assign(
      { uAnimationPos: { value: this.positionsFrame } },
      AbstractScatterVisualization.textures
    );

    this.pointsMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      vertexShader: vertShader,
      fragmentShader: fragShader,
      alphaTest: 0.5
    });

    this.points = new THREE.Points(this.pointsGeometry, this.pointsMaterial);

    this.meshes.push(this.points);
    this.view.scene.add(this.points);
    this.selectionController.points = this.points;
    this.selectionController.tooltips = this.ids.map(v => {
      return [{ key: 'id', value: v }];
    });
    this.updateDecorator(this.config, this.decorators);

    // this.tooltipController.targets = this.points;
    ChartFactory.configPerspectiveOrbit(
      this.view,
      new THREE.Box3(
        new Vector3(-250, -250, -250),
        new THREE.Vector3(250, 250, 250)
      )
    );
    setTimeout(ChartScene.instance.render, 300);
    // requestAnimationFrame(ChartScene.instance.render);
    // this.onRequestRender.emit(this.config.graph);
  }

  removeObjects() {
    this.view.scene.remove(...this.meshes);
    this.meshes.length = 0;
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
}
