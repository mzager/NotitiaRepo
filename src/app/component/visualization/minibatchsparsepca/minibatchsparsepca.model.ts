import { EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class MiniBatchSparsePcaMethod {
  public static LARS = 'lars';
  public static CD = 'cd';
}

export class MiniBatchSparsePcaConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.MINI_BATCH_SPARSE_PCA;
    this.label = 'PCA Sparse Mini Batch';
    this.enableBehaviors = true;
  }

  n_components = 10;
  alpha = 1;
  ridge_alpha = 0.01;
  n_iter = 10;
  batch_size = 3;
  shuffle = true;
  sk_method = MiniBatchSparsePcaMethod.LARS;
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface MiniBatchSparsePcaDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;

  error: any;
  n_iter: any;
}
