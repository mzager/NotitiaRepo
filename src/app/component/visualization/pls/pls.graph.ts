import { EventEmitter } from '@angular/core';
import { GraphEnum, ShapeEnum } from 'app/model/enum.model';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { PlsConfigModel, PlsDataModel } from './pls.model';

export class PlsGraph implements ChartObjectInterface {
  // Emitters
  public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
  public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{
    type: GraphConfig;
  }>();
  public onSelect: EventEmitter<{ type: EntityTypeEnum; ids: Array<string> }> = new EventEmitter<{
    type: EntityTypeEnum;
    ids: Array<string>;
  }>();

  // Private Members
  public meshes: Array<THREE.Mesh>;
  public decorators: DataDecorator[];
  private container: THREE.Object3D;
  private layout: any;
  private sizes: Array<any>;
  private shapes: Array<any>;
  private colors: Array<any>;
  private config: PlsConfigModel;

  create(label: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
    return this;
  }
  updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
    throw new Error('Method not implemented.');
  }
  updateData(config: GraphConfig, data: any) {}
  preRender(
    views: Array<VisualizationView>,
    layout: WorkspaceLayoutEnum,
    renderer: THREE.WebGLRenderer
  ) {}
  enable(truthy: Boolean) {}

  // Interface
  setContainer(container: THREE.Object3D) {
    this.container = container;
    this.meshes = [];
  }
  setConfig(config: PlsConfigModel): void {
    this.config = config;
  }
  setData(data: PlsDataModel): void {
    // this.layout = data.eigenvectorsScaled;
    // this.draw();
  }
  activate(events: ChartEvents, controls: OrbitControls): void {}
  deactivate(events: ChartEvents, controls: OrbitControls): void {}
  prerender() {}
  destroy() {
    this.meshes.forEach(v => this.container.remove(v));
    this.meshes.length = 0;
  }
  private colorFactory(color): THREE.Material {
    const rv = new THREE.MeshPhongMaterial({ color: color, specular: color, shininess: 100 });
    return rv;
  }

  draw() {
    if (this.layout === null) {
      return;
    }

    this.destroy();

    const layoutLength = this.layout.length;
    const sizeLength = this.sizes.length;
    const shapeLength = this.shapes.length;
    const colorLength = this.colors.length;

    for (let i = 0; i < layoutLength; i++) {
      const position = this.layout[i];
      const size = i < sizeLength ? this.sizes[i] : 1;
      // const shape =
      //   i < shapeLength ? this.shapeFactory(this.shapes[i]) : this.shapeFactory(ShapeEnum.SQUARE);
      // const color =
      //   i < colorLength ? this.colorFactory(this.colors[i]) : this.colorFactory(0xdd2c00);
      // const point = new THREE.Mesh(shape, color);
      // point.position.x = position[0] - 250;
      // point.position.y = position[1] - 250;
      // point.position.z = position[2] - 250;
      // point.scale.set(size, size, size);
      // this.meshes.push(point);
      // this.container.add(point);
    }
  }

  // Lifecycle Methods
  constructor() {}
  // constructor() {
  //     this.sizes = [];
  //     this.shapes = [];
  //     this.colors = [];
  //     this.intersect = new BehaviorSubject<Array<any>>([]);
  // }
}
