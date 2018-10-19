import { SelectionToolConfig } from './../../../model/selection-config.model';
import { EventEmitter } from '@angular/core';
import {
  GraphEnum,
  EntityTypeEnum,
  WorkspaceLayoutEnum
} from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import * as _ from 'lodash';
import * as THREE from 'three';
import { LabelController } from './../../../controller/label/label.controller';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import {
  DataDecorator,
  DataDecoratorTypeEnum
} from './../../../model/data-map.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { EdgeConfigModel, EdgeDataModel } from './edges.model';

export class EdgesGraph implements ChartObjectInterface {
  // Chart Elements
  private data: EdgeDataModel;
  private config: EdgeConfigModel;
  private view: VisualizationView;

  public meshes: Array<THREE.Mesh>;
  public decorators: DataDecorator[] = [];
  public lines: Array<THREE.Line> = [];
  private drawEdgesDebounce: Function;
  public updateEdges: Boolean = false;

  // Emitters
  public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
  public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{
    type: GraphConfig;
  }>();
  public onSelect: EventEmitter<{
    type: EntityTypeEnum;
    ids: Array<string>;
  }> = new EventEmitter<{ type: EntityTypeEnum; ids: Array<string> }>();
  getTargets(): { point: THREE.Vector3; id: string; idType: EntityTypeEnum }[] {
    return [];
  }
  public filterObjectsInFrustum(
    targets: Array<{
      point: THREE.Vector3;
      id: string;
      idType: EntityTypeEnum;
    }>,
    view: VisualizationView
  ): Array<{ point: THREE.Vector3; id: string; idType: EntityTypeEnum }> {
    const camera = view.camera as THREE.PerspectiveCamera;
    camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.getInverse(camera.matrixWorld);
    const cameraViewProjectionMatrix: THREE.Matrix4 = new THREE.Matrix4();
    cameraViewProjectionMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    const frustum = new THREE.Frustum();
    frustum.setFromMatrix(cameraViewProjectionMatrix);
    return targets.filter(target => frustum.containsPoint(target.point));
  }
  enable(truthy: Boolean) {
    // throw new Error('Method not implemented.');
  }

  updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
    this.decorators = decorators;
    this.drawEdgesDebounce();
  }
  updateData(config: GraphConfig, data: any) {
    this.config = config as EdgeConfigModel;
    this.data = data;
    this.drawEdgesDebounce();
  }
  updateSelectionTool(config: SelectionToolConfig) {}
  public createMap2D(
    objects: Array<{
      point: THREE.Vector3;
      id: string;
      idType: EntityTypeEnum;
    }>,
    view: VisualizationView
  ): Object {
    const viewport = view.viewport;
    const width = viewport.width;
    const height = viewport.height;
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const offset =
      view.config.graph === GraphEnum.GRAPH_A
        ? new THREE.Vector3(-view.viewport.x, -view.viewport.y, 0)
        : new THREE.Vector3(view.viewport.x, view.viewport.y, 0);
    return objects.reduce((p, obj) => {
      const position = obj.point.clone().project(view.camera);
      position.x = position.x * halfWidth - halfWidth;
      position.y = position.y * halfHeight;
      position.z = 0;
      p[obj.id] = position.add(offset);
      return p;
    }, {});
  }
  getTargetsFromMeshes(
    view: VisualizationView,
    entityType: EntityTypeEnum
  ): Array<{ point: THREE.Vector3; id: string; idType: EntityTypeEnum }> {
    return view.chart.meshes.map(mesh => {
      return { point: mesh.position, id: mesh.userData.id, idType: entityType };
    });
    return null;
  }
  drawEdges(views: Array<VisualizationView>, layout, renderer) {
    if (layout === WorkspaceLayoutEnum.SINGLE) {
      this.decorators = [];
      return;
    }
    if (this.data.result.length === 0) {
      // Clear Scene + Add Center Line
      this.view.scene.children = this.view.scene.children.splice(0, 2);
      this.view.scene.add(
        ChartFactory.lineAllocate(
          0x039be5,
          new THREE.Vector2(0, -1000),
          new THREE.Vector2(0, 1000)
        )
      );
      renderer.clear();
      views.forEach(view => {
        renderer.setViewport(
          view.viewport.x,
          view.viewport.y,
          view.viewport.width,
          view.viewport.height
        );
        renderer.render(view.scene, view.camera);
      });
      return;
    }

    let a = views[0].chart.getTargets();
    let b = views[1].chart.getTargets();
    if (a === null) {
      a = this.getTargetsFromMeshes(views[0], this.config.entityA);
    }
    if (b === null) {
      b = this.getTargetsFromMeshes(views[1], this.config.entityB);
    }
    a = this.filterObjectsInFrustum(a, views[0]);
    b = this.filterObjectsInFrustum(b, views[1]);

    this.view.scene.children = this.view.scene.children.splice(0, 2);
    if (views[0].chart === null || views[1].chart === null) {
      return;
    }
    // const visibleObjectsA = LabelController.filterObjectsInFrustum(
    //   views[0].chart.meshes,
    //   views[0]
    // );
    // const visibleObjectsB = LabelController.filterObjectsInFrustum(
    //   views[1].chart.meshes,
    //   views[1]
    // );
    const obj2dMapA = this.createMap2D(a, views[0]);
    const obj2dMapB = this.createMap2D(b, views[1]);
    // const obj2dMapA = LabelController.createMap2D(visibleObjectsA, views[0]);
    // const obj2dMapB = LabelController.createMap2D(visibleObjectsB, views[1]);

    /*
    const ea =
      this.config.entityA === 'Samples'
        ? 'sid'
        : this.config.entityA === 'Patients'
          ? 'pid'
          : 'mid';
    const eb =
      this.config.entityB === 'Samples'
        ? 'sid'
        : this.config.entityB === 'Patients'
          ? 'pid'
          : 'mid';
*/
    const colorDecorator = this.decorators.find(
      d => d.type === DataDecoratorTypeEnum.COLOR
    );
    const hasColorDecorator = colorDecorator !== undefined;
    const colorMap = hasColorDecorator
      ? colorDecorator.values.reduce((p, c) => {
          p[c.pid] = c;
          p[c.sid] = c;
          return p;
        }, {})
      : {};

    const groupDecorator = this.decorators.find(
      d => d.type === DataDecoratorTypeEnum.GROUP
    );
    const hasGroupDecorator = groupDecorator !== undefined;
    const groupMap = hasGroupDecorator
      ? groupDecorator.values.reduce((p, c) => {
          c.value = parseInt(c.value, 10);
          p[c.pid] = c;
          p[c.sid] = c;
          return p;
        }, {})
      : {};

    let groupY = [];
    if (hasGroupDecorator) {
      const vph = this.view.viewport.height;
      const vphHalf = this.view.viewport.height * 0.5;
      const binCount = Math.max(...groupDecorator.values.map(v => v.value));
      const binHeight = vph / (binCount + 1);
      groupY = Array.from({ length: binCount }, (v, k) => k + 1).map(
        v => v * binHeight - vphHalf - binHeight * 0.5
      );
    }

    this.data.result
      .map(v => {
        if (!obj2dMapA.hasOwnProperty(v.a) || !obj2dMapB.hasOwnProperty(v.b)) {
          return null;
        }
        // const color = 0x81d4fa;
        const color = !hasColorDecorator
          ? 0x81d4fa
          : colorMap.hasOwnProperty(v.a)
            ? colorMap[v.a].value
            : colorMap.hasOwnProperty(v.b)
              ? colorMap[v.b].value
              : 0xeeeeee;

        const yPos = !hasGroupDecorator
          ? 0
          : groupMap.hasOwnProperty(v.a)
            ? groupY[groupMap[v.a].value]
            : groupMap.hasOwnProperty(v.b)
              ? groupY[groupMap[v.b].value]
              : 0;

        let line;
        if (hasGroupDecorator) {
          return ChartFactory.lineAllocateCurve(
            color,
            obj2dMapA[v.a],
            obj2dMapB[v.b],
            new THREE.Vector2(0, yPos)
          );
        } else {
          line = ChartFactory.lineAllocate(
            color,
            obj2dMapA[v.a],
            obj2dMapB[v.b]
          );
        }
        line = ChartFactory.lineAllocate(color, obj2dMapA[v.a], obj2dMapB[v.b]);

        line.userData = v;
        return line;
      })
      .filter(v => v !== null)
      .forEach(edge => this.view.scene.add(edge));

    // Center Line
    this.view.scene.add(
      ChartFactory.lineAllocate(
        0x039be5,
        new THREE.Vector2(0, -1000),
        new THREE.Vector2(0, 1000)
      )
    );

    renderer.clear();
    views.forEach(view => {
      renderer.setViewport(
        view.viewport.x,
        view.viewport.y,
        view.viewport.width,
        view.viewport.height
      );
      renderer.render(view.scene, view.camera);
    });
  }

  preRender(
    views: Array<VisualizationView>,
    layout: WorkspaceLayoutEnum,
    renderer: THREE.WebGLRenderer
  ) {
    if (this.view.scene.children.length > 2) {
      this.view.scene.children = this.view.scene.children.splice(0, 2);
    }
    this.drawEdgesDebounce(views, layout, renderer);
  }
  create(
    labels: HTMLElement,
    events: ChartEvents,
    view: VisualizationView
  ): ChartObjectInterface {
    // this.labels = labels;
    // this.events = events;
    this.view = view;
    this.drawEdgesDebounce = _.debounce(this.drawEdges, 600);
    return this;
  }
  destroy() {
    // throw new Error('Method not implemented.');
  }

  constructor() {
    this.data = new EdgeDataModel();
  }
}
