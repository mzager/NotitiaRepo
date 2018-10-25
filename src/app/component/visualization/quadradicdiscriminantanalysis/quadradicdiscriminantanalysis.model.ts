import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from '../../../model/graph-config.model';
import { GraphData } from '../../../model/graph-data.model';

export class QuadradicDiscriminantAnalysisConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS;
    this.label = 'QUADRATIC-DISCRIMINANT-ANALYSIS';
    this.enableBehaviors = true;
  }

  n_components = 10;
  dimension = DimensionEnum.THREE_D;
  pcx = 1;
  pcy = 2;
  pcz = 3;
  // priors
  // reg_param
  store_covariance = false;
  tol = 1.0e-4;
}

export interface QuadradicDiscriminantAnalysisDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;
  covariance: any;
  means: any;
  priors: any;
  rotations: any;
  scalings: any;

}










