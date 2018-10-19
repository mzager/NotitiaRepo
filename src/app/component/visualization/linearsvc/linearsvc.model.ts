import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from '../../../model/graph-config.model';
import { GraphData } from '../../../model/graph-data.model';


export class LinearSVCPenalty {
  public static l1 = 'l1';
  public static l2 = 'l2';
}
export class LinearSVCLoss {
  public static HINGE = 'hinge';
  public static SQUARED_HINGE = 'squared_hinge';

}
export class LinearSVCMultiClass {
  public static OVR = 'ovr';
  public static CRAMMER_SINGER = 'crammer_singer';
}

export class LinearSVCRandomState {
  public static INSTANCE = 'instance';
  public static NONE = 'None';
}


export class LinearSVCConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.LINEAR_SVC;
    this.label = 'Linear SVC';
    this.enableBehaviors = true;
  }

  n_components = 10;
  LinearSVCPenalty = 'squared_hinge';
  LinearSVCLoss = 'l1';
  dual: Boolean = true;
  tol = 1e-6; // optional
  c = 1; // optional
  LinearSVCMultiClass = 'ovr';
  fit_intercept: Boolean = true;
  intercept_scaling = 1; // optional
  verbose = 0;
  max_iter = 1000;
  LinearSVCRandomState = 'None'; // optional
  // class_weight opitional
  dimension = DimensionEnum.THREE_D;
  batch_size: 'None';
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface LinearSVCDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;


  nComponents: any;
  coef: any;
  intercept: any;

}
