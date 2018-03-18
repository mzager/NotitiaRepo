import { ChartObjectInterface } from './chart.object.interface';

/**
* Represents A Chart View
*/
export interface EdgeView {
  chart: ChartObjectInterface;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
}
