import { AbstractScatterSelectionController } from './abstract.scatter.selection.controller';
import { ChartScene } from '../../component/workspace/chart/chart.scene';
import {
  ChartEvents,
  ChartEvent
} from '../../component/workspace/chart/chart.events';
import { VisualizationView } from '../../model/chart-view.model';
import { Vector3, MeshPhongMaterial, Mesh, Raycaster, Geometry } from 'three';
import QuickHull from 'quickhull3d';
declare var THREE;
export class ScatterSelectionHullController extends AbstractScatterSelectionController {
  private material: THREE.MeshNormalMaterial;
  private hull: QuickHull;
  constructor(
    public view: VisualizationView,
    public events: ChartEvents,
    public debounce: number = 10
  ) {
    super(view, events, debounce);
    this.raycaster = new Raycaster();
    this.raycaster.params.Points.threshold = 5;
    this.material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0.3
    });
    //   color: 0x000000,
    //   transparent: true,
    //   opacity: 0.2
    // });

    this.mesh = new THREE.Mesh(
      this.geometry,
      new MeshPhongMaterial({ color: 0x7777ff })
    );
    view.scene.add(this.mesh);
  }

  public destroy(): void {
    super.destroy();
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
