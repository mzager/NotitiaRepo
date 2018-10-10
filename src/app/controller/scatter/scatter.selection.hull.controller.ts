import { ChartScene } from '../../component/workspace/chart/chart.scene';
import { ChartFactory } from '../../component/workspace/chart/chart.factory';
import { Subscription } from 'rxjs';
import { ChartSelection } from '../../model/chart-selection.model';
import { GraphConfig } from 'app/model/graph-config.model';
import {
  ChartEvents,
  ChartEvent
} from '../../component/workspace/chart/chart.events';
import { VisualizationView } from '../../model/chart-view.model';
import { AbstractMouseController } from '../abstract.mouse.controller';
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
import QuickHull from 'quickhull3d';
declare var THREE;
export class ScatterSelectionHullController extends AbstractMouseController {
  public onSelect: EventEmitter<Array<number>> = new EventEmitter();
  public onDeselect: EventEmitter<Array<number>> = new EventEmitter();

  private mesh: Mesh;
  private geometry: Geometry;
  private material: MeshPhongMaterial;
  private hull: QuickHull;
  private highlightIndexes = [];
  private raycaster: Raycaster;
  private _points: Points;

  // private material = new LineBasicMaterial({ color: 0xe000fb });

  public get points(): Points {
    return this._points;
  }
  public set points(p: Points) {
    this._points = p;
  }

  constructor(
    public view: VisualizationView,
    public events: ChartEvents,
    public debounce: number = 10
  ) {
    super(view, events, debounce);
    this.raycaster = new Raycaster();
    this.raycaster.params.Points.threshold = 5;
    this.material = new MeshPhongMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2
    });

    // this.mesh = new THREE.Mesh(
    //   this.geometry,
    //   new MeshPhongMaterial({ color: 0x7777ff })
    // );
    // view.scene.add(this.mesh);
  }

  public destroy(): void {
    this.points = null;
    this.enable = false;
  }
  public drawHull(): void {
    if (this.highlightIndexes.length > 3) {
      if (this.mesh) {
        this.view.scene.remove(this.mesh);
      }
      const x = THREE.QuickHull;
      const positions = this.points.geometry['attributes'].position.array;
      const points = this.highlightIndexes.map(v => {
        return [positions[v], positions[v + 1], positions[v + 2]];
      });

      const faces = QuickHull(points);

      this.geometry = new Geometry();
      points.forEach(pt => {
        this.geometry.vertices.push(new Vector3().fromArray(pt));
      });

      let normal: THREE.Vector3;
      faces.forEach(face => {
        const a = new THREE.Vector3().fromArray(points[face[0]]);
        const b = new THREE.Vector3().fromArray(points[face[1]]);
        const c = new THREE.Vector3().fromArray(points[face[2]]);
        normal = new THREE.Vector3()
          .crossVectors(
            new THREE.Vector3().subVectors(b, a),
            new THREE.Vector3().subVectors(c, a)
          )
          .normalize();
        this.geometry.faces.push(
          new THREE.Face3(face[0], face[1], face[2], normal)
        );
      });

      this.mesh = new Mesh(this.geometry, this.material);
      this.view.scene.add(this.mesh);
      ChartScene.instance.render();
    }
  }
  public onMouseUp(e: ChartEvent): void {
    super.onMouseUp(e);
  }
  public onMouseDown(e: ChartEvent): void {
    super.onMouseDown(e);

    this.raycaster.setFromCamera(e.mouse, this.view.camera);
    const intersects = this.raycaster.intersectObject(this.points);
    if (intersects.length) {
      this.highlightIndexes.push(intersects[0].index * 3);
      this.drawHull();
      this.onSelect.emit(this.highlightIndexes);
    }
  }

  public onMouseMove(e: ChartEvent): void {
    super.onMouseMove(e);

    if (!this.points) {
      return;
    }
    ChartScene.instance.render();
  }
}
