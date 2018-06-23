import { VisualizationEnum } from 'app/model/enum.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { HeatmapDistance, HeatmapMethod } from './../heatmap/heatmap.model';

export class DendogramConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.DENDOGRAM;
    this.label = 'Dendogram';
  }

  order = false;
  method = HeatmapMethod.WARD.value;
  dist = HeatmapDistance.EUCLIDEAN.value;
  transpose = 0;
}

export interface DendogramDataModel extends GraphData {
  legends: Array<Legend>;
  map: any;
  values: Array<Array<number>>;
  colors: Array<Array<number>>;
  range: Array<number>;
  result: {
    children: Array<Array<number>>;
    labels: Array<number>;
    n_components: number;
    n_leaves: number;
    result: Array<number>;
  };
}
