import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from '../../../model/graph-config.model';
import { GraphData } from '../../../model/graph-data.model';

export class NuSVRKernal {
  public static RBF = 'rbf';
  public static LINER = 'linear';
  public static POLY = 'poly';
  public static SIGMOID = 'sigmoid';
  public static PRECOMPUTED = 'precomputed';
  public static CALLABLE = 'callable';
}
// export class NuSVCDecisionFunctionShape {
//   public static OVR = 'ovr';
//   public static OVO = 'ovo';
// }

// export class NuSVCRandomState {
//   public static INSTANCE = 'instance';
//   public static NONE = 'None';
// }

export class NuSVRConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.NU_SVR;
    this.label = 'Nu SVR';
    this.enableBehaviors = true;
  }

  n_components = 10;
  nu = 0.5; // optional
  c = 1.0; // optional
  kernal = NuSVRKernal.RBF; // optional
  degree = 3; // optional
  // gamma = // optional
  coef0 = 0.0; // optional
  shrinking: Boolean = true;
  tol = 1e-3; // optional
  // cache_size : float, // optional
  verbose: Boolean = false;
  max_iter = 1; // optional
  dimension = DimensionEnum.THREE_D;
  batch_size: 'None';
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface NuSVRDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;

  nComponents: any;
  support: any;
  support_vectors: any;
  n_support: any;
  dual_coef: any;
  coef: any;
  intercept: any;

}
