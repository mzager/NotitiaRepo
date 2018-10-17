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
    this.visualization = VisualizationEnum.PLSSVD;
    this.label = 'PLS-SVD';
    this.enableBehaviors = true;
  }

  n_components = 3;
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


  nComponents: any;
  x_weights: any;
  y_weights: any;
  x_scores: any;
  y_scores: any;

}
