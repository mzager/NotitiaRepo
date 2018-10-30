import { kdTree } from 'kd-tree-javascript';
import { ChartScene } from './../../component/workspace/chart/chart.scene';
import { ChartFactory } from './../../component/workspace/chart/chart.factory';
import { Subscription } from 'rxjs';
import { ChartSelection } from './../../model/chart-selection.model';

import { GraphConfig } from 'app/model/graph-config.model';
import { ChartEvents, ChartEvent } from './../../component/workspace/chart/chart.events';
import { VisualizationView } from './../../model/chart-view.model';
import { AbstractMouseController } from './../abstract.mouse.controller';
import {
  Vector3,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Object3D,
  Vector2,
  Sphere,
  Raycaster,
  Points,
  LineSegments,
  Geometry,
  LineBasicMaterial,
  Matrix4,
  Frustum,
  Float32Attribute
} from 'three';
import { EventEmitter } from '@angular/core';
import { GraphEnum } from '../../model/enum.model';
import { scaleLinear } from 'd3-scale';
import { AbstractScatterSelectionController } from './abstract.scatter.selection.controller';
declare var THREE;
export class ScatterSelectionKddController extends AbstractScatterSelectionController {
  private kdTree: any;
  private posMap: Array<number>;
  private intersect: any = null;
  private lines: LineSegments;
  private lineGeo = new Geometry();
  private lineMat = new LineBasicMaterial({ color: 0xe000fb });

  public get points(): Points {
    return this._points;
  }
  public set points(p: Points) {
    const distanceFunction = (a, b) => {
      return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2);
    };
    const ptsArray = p.geometry['attributes'].position.array;
    const sortArray = new Float32Array(ptsArray.length);
    sortArray.set(ptsArray);
    this.kdTree = new THREE.TypedArrayUtils.Kdtree(sortArray, distanceFunction, 3);

    this.posMap = new Array(ptsArray.length / 3);

    for (let i = 0; i < sortArray.length; i += 3) {
      this.posMap[i / 3] = ptsArray.findIndex(v => {
        return v === sortArray[i];
      });
    }
    console.log('11...ss');
    this._points = p;
  }

  public distanceBetweenVectors(v1: Vector3, v2: Vector3): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    const dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  constructor(public view: VisualizationView, public events: ChartEvents, public debounce: number = 10) {
    super(view, events, debounce);
    this.raycaster = new Raycaster();
    this.raycaster.params.Points.threshold = 5;
  }

  public destroy(): void {
    super.destroy();
    this.posMap = null;
    this.kdTree = null;
  }

  public onMouseDown(e: ChartEvent): void {
    super.onMouseDown(e);

    this.raycaster.setFromCamera(e.mouse, this.view.camera);
    const intersects = this.raycaster.intersectObject(this.points);
    if (intersects.length) {
      this.onSelect.emit(Array.from(this.highlightIndexes));
    }
  }

  public onMouseMove(e: ChartEvent): void {
    super.onMouseMove(e);
    if (!this.points) {
      return;
    }
    console.log('testing');
    // if (this.intersect !== null) {
    //   const alphas = this.intersect.object.geometry.attributes.gAlpha;
    //   alphas.array.fill(0.8);
    //   alphas.needsUpdate = true;
    //   ChartScene.instance.render();
    //   this.intersect = null;
    // }

    if (this.lines !== null) {
      this._view.scene.remove(this.lines);
    }

    this.raycaster.setFromCamera(e.mouse, this.view.camera);
    const intersects = this.raycaster.intersectObject(this.points);
    const maxDistance = Math.pow(100, 2);

    this.highlightIndexes.clear();

    if (intersects.length) {
      this.intersect = intersects[0];
      const position = this.intersect.point;

      const imagePositionsInRange = this.kdTree.nearest([position.x, position.y, position.z], 50, maxDistance);

      // Convert
      const target = new Vector3(this.intersect.point.x, this.intersect.point.y, this.intersect.point.z);
      const points = imagePositionsInRange.map(v => {
        const pt = v[0].obj;
        return {
          vec3: new Vector3(pt[0], pt[1], pt[2]),
          pos: this.posMap[v[0].pos]
        };
      });
      this.highlightIndexes = points.map(v => v.pos);

      // if (points.length > 0) {
      //   // const alphas = this.intersect.object.geometry.attributes.gAlpha;
      //   // alphas.array.fill(0.8);
      //   // points.forEach(pt => {
      //   //   alphas.array[pt.pos] = 1;
      //   // });
      //   // alphas.needsUpdate = true;
      // }

      const closestPoint = points.reduce(
        (p, c) => {
          const dist = this.distanceBetweenVectors(c.vec3, target);
          if (dist < p.dist) {
            p.dist = dist;
            p.pt = c.vec3;
          }
          return p;
        },
        { dist: Infinity, pt: null }
      );
      this.lineGeo = new Geometry();
      points.forEach(pt => {
        if (pt.vec3 !== closestPoint.pt) {
          this.lineGeo.vertices.push(closestPoint.pt, pt.vec3);
        }
      });
      this.lineGeo.verticesNeedUpdate = true;

      if (this.lines !== null) {
        this._view.scene.remove(this.lines);
      }
      this.lines = new LineSegments(this.lineGeo, this.lineMat);
      this._view.scene.add(this.lines);

      ChartScene.instance.render();
    }
  }
}
