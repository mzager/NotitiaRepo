import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from '../../../model/graph-config.model';
import { GraphData } from '../../../model/graph-data.model';

export class PlsRegressionConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.PLSREGRESSION;
    this.label = 'PLS-REGRESSION';
    this.enableBehaviors = true;
  }

  n_components = 10;
  scale: Boolean = true;
  max_iter = 500;
  tol = 1e-6;
  copy: Boolean = true;
  dimension = DimensionEnum.THREE_D;
  batch_size: 'None';
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface PlsRegressionDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;


  nComponents: any;
  x_weights: any;
  y_weights: any;
  x_scores: any;
  y_scores: any;
  x_loadings: any;
  y_loadings: any;
  x_rotations: any;
  y_rotations: any;
  coef: any;
  n_iter: any;

}
