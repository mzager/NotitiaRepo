import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class PcaSvdSolver {
  public static AUTO = 'auto';
  public static FULL = 'full';
  public static ARPACK = 'arpack';
  public static RANDOMIZED = 'randomized';
}

export class PcaConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.PCA;
    this.label = 'PCA';
    this.enableBehaviors = true;
  }

  n_components = 10;
  dimension = DimensionEnum.THREE_D;
  copy: Boolean = true;
  whiten: Boolean = false;
  svd_solver = 'auto';
  tol = 0.0;
  iterated_power = 'auto';
  random_state = 'None';
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface PcaDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;
  components: any;
  explainedVariance: any;
  explainedVarianceRatio: any;
  singularValues: any;
  mean: any;
  nComponents: any;
  noiseVariance: any;
}
