import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class PlsSvdConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.INCREMENTAL_PCA;
    this.label = 'PLS-SVD';
    this.enableBehaviors = true;
  }

  n_components = 10;
  scale: Boolean = true;
  copy: Boolean = true;
  dimension = DimensionEnum.THREE_D;
  batch_size: 'None';
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface PlsSvdDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;

  components: any;
  explainedVariance: any;
  explainedVarianceRatio: any;
  singularValues: any;
  skVar: any;
  mean: any;
  nComponents: any;
  noiseVariance: any;
  nSamplesSeen: any;
}
