import { EffectComposer } from 'postprocessing';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../model/chart.object.interface';
import { VisualizationView } from './chart-view.model';
import { VisualizationEnum } from 'app/model/enum.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Renderer } from 'three';

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
