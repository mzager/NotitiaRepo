
import { GraphConfig } from 'app/model/graph-config.model';
import { Renderer } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartObjectInterface } from './../model/chart.object.interface';

/**
* Represents A Chart View
*/
export interface VisualizationView {
  controls: OrbitControls;
  config: GraphConfig; // {visualization: VisualizationEnum};
  renderer: Renderer;
  viewport: { x: number, y: number, width: number, height: number };
  camera: THREE.Camera;
  scene: THREE.Scene;
  chart: ChartObjectInterface;
}
