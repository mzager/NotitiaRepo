import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { InfoPanelComponent } from './../../component/workspace/info-panel/info-panel.component';
import { AbstractScatterSelectionController } from './abstract.scatter.selection.controller';
import { ChartScene } from '../../component/workspace/chart/chart.scene';
import { ChartEvents, ChartEvent } from '../../component/workspace/chart/chart.events';
import { VisualizationView } from '../../model/chart-view.model';
import {
  Vector3,
  Vector2,
  MeshPhongMaterial,
  Mesh,
  Raycaster,
  Geometry,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Intersection,
  Points
} from 'three';

declare var THREE;
export class ScatterSelectionLassoController extends AbstractScatterSelectionController {
  // State
  public enabled = false;
  public tool: 'NONE' | 'LASSO' | 'BRUSH' = 'NONE';
  public mode: 'NONE' | 'SELECT' | 'DESELECT' = 'NONE';

  private kdTree: any;
  private posMap: Array<any>;

  public brushState = {
    isDrawing: false,
    originPolar: new Vector3(0, 0, 0),
    originCart: new Vector2(0, 0),
    kddResult: null,
    pointIndex: 0,
    positionsPolar: new Float32Array(500 * 6),
    line: new Line(
      new BufferGeometry(),
      new LineBasicMaterial({
        color: 0xff00ff,
        linewidth: 6.0
      })
    )
  };
  public lassoState = {
    isDrawing: false,
    pointIndex: 0,
    pointLimit: 500,
    originCart: new Vector2(0, 0),
    positionsCart: new Float32Array(500 * 2),
    positionsPolar: new Float32Array(500 * 3),
    line: new Line(
      new BufferGeometry(),
      new LineBasicMaterial({
        color: 0xff00ff,
        linewidth: 6.0
      })
    )
  };

  constructor(public view: VisualizationView, public events: ChartEvents, public debounce: number = 10) {
    super(view, events, debounce);
    (this.lassoState.line.geometry as BufferGeometry).addAttribute(
      'position',
      new THREE.BufferAttribute(this.lassoState.positionsPolar, 3)
    );
    (this.brushState.line.geometry as BufferGeometry).addAttribute(
      'position',
      new THREE.BufferAttribute(this.brushState.positionsPolar, 3)
    );
  }

  convertRange(value, r1, r2): number {
    return Math.round(((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0]);
  }

  //#region KDD
  public get points(): Points {
    return this._points;
  }
  public set points(p: Points) {
    if (p === null) {
      this._points = null;
      return;
    }
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
    this._points = p;
  }
  //#endregion

  //#region Primary Events
  public onKeyDown(e: KeyboardEvent): void {
    super.onKeyDown(e);
    this.mode = !e.shiftKey ? 'NONE' : e.metaKey ? 'DESELECT' : 'SELECT';
  }
  public onKeyUp(e: KeyboardEvent): void {
    super.onKeyUp(e);
    this.mode = !e.shiftKey ? 'NONE' : e.metaKey ? 'DESELECT' : 'SELECT';
  }
  public onMouseDown(e: ChartEvent): void {
    super.onMouseDown(e);
    if (this.mode === 'NONE') {
      return;
    }
    this.raycaster.setFromCamera(e.mouse, this.view.camera);
    const intersects = this.raycaster.intersectObject(this.points);
    this.tool = intersects.length < 0 ? 'NONE' : intersects.length === 0 ? 'LASSO' : 'BRUSH';
    switch (this.tool) {
      case 'NONE':
        return;
      case 'BRUSH':
        this.brushMouseDown(e);
        break;
      case 'LASSO':
        this.lassoMouseDown(e);
        break;
    }
  }
  public onMouseUp(e: ChartEvent): void {
    super.onMouseUp(e);
    switch (this.tool) {
      case 'NONE':
        return;
      case 'LASSO':
        this.lassoMouseUp(e);
        break;
      case 'BRUSH':
        this.brushMouseUp(e);
        break;
    }
    this.tool = 'NONE';
  }
  public onMouseMove(e: ChartEvent): void {
    super.onMouseMove(e);
    switch (this.tool) {
      case 'NONE':
        return;
      case 'LASSO':
        this.lassoMouseMove(e);
        break;
      case 'BRUSH':
        this.brushMouseMove(e);
        break;
    }
  }
  //#endregion

  //#region Lasso
  private pointInPoly(point, vs) {
    let i, j, intersect;
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0];
      const yi = vs[i][1];
      const xj = vs[j][0];
      const yj = vs[j][1];
      intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
  public lassoMouseUp(e: ChartEvent): void {
    this.lassoState.isDrawing = false;
    this.view.controls.enabled = true;
    this.tool = 'NONE';
    this.view.scene.remove(this.lassoState.line);

    // Detect Points In Poly
    const poly = [];
    for (let i = 0; i < this.lassoState.pointIndex; i++) {
      poly.push([this.lassoState.positionsCart[i * 2], this.lassoState.positionsCart[i * 2 + 1]]);
    }
    const pts = this.points.geometry['attributes'].position.array;
    const ptsCount = pts.length / 3;
    const ptsVec3 = new Array(ptsCount);
    for (let i = 0; i < ptsCount; i++) {
      const vec3 = new Vector3(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]).project(this.view.camera);
      ptsVec3[i] = [vec3.x, vec3.y];
    }
    const hits = ptsVec3.reduce((p, c, i) => {
      if (this.pointInPoly(c, poly)) {
        p.push(i * 3);
      }
      return p;
    }, []);
    hits.forEach(hit => {
      if (this.mode === 'SELECT') {
        this.highlightIndexes.add(hit);
      } else {
        this.highlightIndexes.delete(hit);
      }
    });
    this.onSelect.emit(Array.from(this.highlightIndexes));
  }
  public lassoMouseDown(e: ChartEvent): void {
    this.view.scene.add(this.lassoState.line);
    this.view.controls.enabled = false;
    this.lassoState.isDrawing = true;
    this.lassoState.originCart.set(e.mouse.x, e.mouse.y);
    this.lassoState.pointIndex = 0;
  }
  public lassoMouseMove(e: ChartEvent): void {
    if (!this.lassoState.isDrawing) {
      return;
    }
    this.lassoState.positionsCart[this.lassoState.pointIndex * 2] = e.mouse.x;
    this.lassoState.positionsCart[this.lassoState.pointIndex * 2 + 1] = e.mouse.y;
    const mousePolar = new THREE.Vector3(e.mouse.x, e.mouse.y, 0);
    mousePolar.unproject(this.view.camera);
    this.lassoState.positionsPolar[this.lassoState.pointIndex * 3] = mousePolar.x;
    this.lassoState.positionsPolar[this.lassoState.pointIndex * 3 + 1] = mousePolar.y;
    this.lassoState.positionsPolar[this.lassoState.pointIndex * 3 + 2] = mousePolar.z;
    this.lassoState.pointIndex += 1;
    (this.lassoState.line.geometry as BufferGeometry).setDrawRange(1, this.lassoState.pointIndex - 1);
    (this.lassoState.line.geometry as BufferGeometry).attributes.position['needsUpdate'] = true;
    ChartScene.instance.render();
  }
  //#endregion

  //#region Brush
  public brushMouseUp(e: ChartEvent): void {
    this.view.scene.remove(this.brushState.line);
    this.view.controls.enabled = true;
    this.brushState.isDrawing = false;
    this.tool = 'NONE';
    this.brushState.kddResult.forEach(v => {
      if (this.mode === 'SELECT') {
        this.highlightIndexes.add(v.pos);
      } else {
        this.highlightIndexes.delete(v.pos);
      }
    });
    this.brushState.line.geometry['attributes'].position.array.fill(0);
    this.brushState.pointIndex = 0;
    this.brushState.positionsPolar.fill(0);
    this.brushState.kddResult = [];
    this.onSelect.emit(Array.from(this.highlightIndexes));
  }
  public brushMouseDown(e: ChartEvent): void {
    this.brushState.line.geometry['attributes'].position.array.fill(0);
    this.brushState.pointIndex = 0;
    this.brushState.positionsPolar.fill(0);
    this.view.controls.enabled = false;
    this.raycaster.setFromCamera(e.mouse, this.view.camera);
    const intersects = this.raycaster.intersectObject(this.points);
    this.brushState.originPolar = intersects[0].point;
    this.brushState.originCart.set(e.mouse.xs, e.mouse.ys);

    this.view.scene.add(this.brushState.line);
    this.brushState.isDrawing = true;
    if (this.mode === 'SELECT') {
      this.highlightIndexes.add(intersects[0].index * 3);
    } else {
      this.highlightIndexes.delete(intersects[0].index * 3);
    }
    this.onSelect.emit(Array.from(this.highlightIndexes));
    ChartScene.instance.render();
  }

  public brushMouseMove(e: ChartEvent): void {
    if (!this.brushState.isDrawing) {
      return;
    }
    const points = Math.ceil(this.brushState.originCart.distanceTo(new Vector2(e.mouse.xs, e.mouse.ys)) / 10);
    if (points === 0) {
      return;
    }
    this.brushState.kddResult = this.kdTree
      .nearest(
        [this.brushState.originPolar.x, this.brushState.originPolar.y, this.brushState.originPolar.z],
        points,
        100000
      )
      .map(v => {
        const pt = v[0].obj;
        return {
          vec3: new Vector3(pt[0], pt[1], pt[2]),
          pos: this.posMap[v[0].pos]
        };
      });

    this.brushState.pointIndex = 0;

    for (let i = 0; i < this.brushState.kddResult.length; i++) {
      this.brushState.positionsPolar[this.brushState.pointIndex * 3] = this.brushState.originPolar.x;
      this.brushState.positionsPolar[this.brushState.pointIndex * 3 + 1] = this.brushState.originPolar.y;
      this.brushState.positionsPolar[this.brushState.pointIndex * 3 + 2] = this.brushState.originPolar.z;
      this.brushState.pointIndex += 1;
      this.brushState.positionsPolar[this.brushState.pointIndex * 3] = this.brushState.kddResult[i].vec3.x;
      this.brushState.positionsPolar[this.brushState.pointIndex * 3 + 1] = this.brushState.kddResult[i].vec3.y;
      this.brushState.positionsPolar[this.brushState.pointIndex * 3 + 2] = this.brushState.kddResult[i].vec3.z;
      this.brushState.pointIndex += 1;
    }
    (this.brushState.line.geometry as BufferGeometry).setDrawRange(1, this.brushState.pointIndex - 1);
    (this.brushState.line.geometry as BufferGeometry).attributes.position['needsUpdate'] = true;
    ChartScene.instance.render();
  }
  //#endregion
}
