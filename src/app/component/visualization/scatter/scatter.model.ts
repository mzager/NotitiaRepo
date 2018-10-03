import {
  VisualizationEnum,
  EntityTypeEnum,
  DimensionEnum
} from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { GraphConfig } from './../../../model/graph-config.model';

export class ScatterConfigModel extends GraphConfig {
  constructor() {
    super();
    this.enableGenesets = false;
    this.enableCohorts = false;
    this.enableColor = false;
    this.enableLabel = false;
    this.enableShape = false;
    this.enableSupplemental = false;
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.SCATTER;
    this.label = 'Scatter';
  }
  uri = 'tsne.json';
}

export interface ScatterDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;
}
