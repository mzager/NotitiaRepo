import { InfoPanelComponent } from './../../component/workspace/info-panel/info-panel.component';
import { AbstractScatterSelectionController } from './abstract.scatter.selection.controller';
import { ChartScene } from '../../component/workspace/chart/chart.scene';
import {
  ChartEvents,
  ChartEvent
} from '../../component/workspace/chart/chart.events';
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
  Line
} from 'three';

declare var THREE;
export class ScatterSelectionLassoController extends AbstractScatterSelectionController {
  private MAX_POINTS = 500;
  private bufferGeometry: BufferGeometry = new BufferGeometry();
  private positionsCart = new Float32Array(this.MAX_POINTS * 2);
  private positionsPolar = new Float32Array(this.MAX_POINTS * 3); // 3 vertices per point
  private drawCount = 2;
  private material: LineBasicMaterial;
  private line: Line;

  private isDrawing: Boolean = false;
  private startPointCart = new Vector2();
  private startPointPolar = new Vector3();

  private pointInPoly(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    let i, j, intersect;
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0];
      const yi = vs[i][1];
      const xj = vs[j][0];
      const yj = vs[j][1];
      intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }

  constructor(
    public view: VisualizationView,
    public events: ChartEvents,
    public debounce: number = 1
  ) {
    super(view, events, debounce);
    this.bufferGeometry.addAttribute(
      'position',
      new THREE.BufferAttribute(this.positionsPolar, 3)
    );
    this.bufferGeometry.setDrawRange(0, this.drawCount);
    this.material = new LineBasicMaterial({
      color: 0xff0000,
      linewidth: 6.0
    });
    this.line = new Line(this.bufferGeometry, this.material);
    this.view.scene.add(this.line);
  }

  public destroy(): void {
    super.destroy();
  }

  public onMouseUp(e: ChartEvent): void {
    super.onMouseUp(e);
    if (!this.isDrawing) {
      return;
    }
    this.positionsCart[this.drawCount * 2] = this.positionsCart[0];
    this.positionsCart[this.drawCount * 2 + 1] = this.positionsCart[1];
    this.positionsPolar[this.drawCount * 3] = this.positionsPolar[0];
    this.positionsPolar[this.drawCount * 3 + 1] = this.positionsPolar[1];
    this.positionsPolar[this.drawCount * 3 + 2] = this.positionsPolar[2];
    this.drawCount += 1;
    this.bufferGeometry.setDrawRange(1, this.drawCount - 1);
    this.bufferGeometry.attributes.position['needsUpdate'] = true;
    ChartScene.instance.render();

    const poly = [];
    for (let i = 0; i < this.drawCount; i++) {
      poly.push([this.positionsCart[i * 2], this.positionsCart[i * 2 + 1]]);
    }
    const pts = this.points.geometry['attributes'].position.array;
    const ptsCount = pts.length / 3;
    const ptsVec3 = new Array(ptsCount);
    for (let i = 0; i < ptsCount; i++) {
      const vec3 = new Vector3(
        pts[i * 3],
        pts[i * 3 + 1],
        pts[i * 3 + 2]
      ).project(this.view.camera);
      ptsVec3[i] = [vec3.x, vec3.y];
    }
    const hits = ptsVec3.reduce((p, c, i) => {
      if (this.pointInPoly(c, poly)) {
        p.push(i * 3);
      }
      return p;
    }, []);

    this.onSelect.emit(hits);
    this.drawCount = 0;
    this.bufferGeometry.setDrawRange(0, this.drawCount);
    ChartScene.instance.render();

    this.isDrawing = false;
    this.view.controls.enabled = true;
  }

  public onMouseDown(e: ChartEvent): void {
    super.onMouseDown(e);
    // this.view.controls.enablePan = this.view.controls.enableRotate = this.view.controls.enableZoom = false;

    if (e.event.shiftKey && !this.isDrawing) {
      this.view.controls.enabled = false;
      this.isDrawing = true;
      this.drawCount = 0;
      const x = e.mouse.x;
      const y = e.mouse.y;
      this.startPointCart = new THREE.Vector2(e.event.screenX, e.event.screenY);
      this.startPointPolar = new THREE.Vector3(e.mouse.x, e.mouse.y, 0);
      this.startPointPolar.unproject(this.view.camera);
    }
  }
  public onMouseMove(e: ChartEvent): void {
    super.onMouseMove(e);

    if (this.isDrawing) {
      const x = e.mouse.x;
      const y = e.mouse.y;
      this.positionsCart[this.drawCount * 2] = x;
      this.positionsCart[this.drawCount * 2 + 1] = y;

      const vNow = new THREE.Vector3(x, y, 0);
      vNow.unproject(this.view.camera);
      this.positionsPolar[this.drawCount * 3] = vNow.x;
      this.positionsPolar[this.drawCount * 3 + 1] = vNow.y;
      this.positionsPolar[this.drawCount * 3 + 2] = vNow.z;
      this.drawCount += 1;

      this.bufferGeometry.setDrawRange(1, this.drawCount - 1);
      this.bufferGeometry.attributes.position['needsUpdate'] = true;
      ChartScene.instance.render();
    } else {
      this.raycaster.setFromCamera(e.mouse, this.view.camera);
      const intersects = this.raycaster.intersectObject(this.points);
      if (intersects.length === 0) {
        InfoPanelComponent.showDefault.emit();
      } else {
        const i = intersects[0];
        InfoPanelComponent.showMessage.emit({
          msg: this.getTooltip(i.index),
          time: 300
        });
      }
    }
  }
}
