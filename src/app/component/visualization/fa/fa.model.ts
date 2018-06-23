import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class FaSvdMethod {
  public static RANDOMIZED = 'randomized';
  public static LAPACK = 'lapack';
}

export class FaConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.FA;
    this.label = 'Factor Analysis';
  }

  dimension = DimensionEnum.THREE_D;
  n_components = 10;
  svd_method = FaSvdMethod.RANDOMIZED;
  tol = 0.01;
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface FaDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;

  loglike: any;
  noiseVariance: any;
  nIter: any;
}
