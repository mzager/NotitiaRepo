import { DataFieldFactory } from 'app/model/data-field.model';
import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class BoxWhiskersConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.BOX_WHISKERS;
    this.label = 'Box & Whiskers';
    this.enableSupplemental = false;
  }

  displayType: DimensionEnum = DimensionEnum.THREE_D;
  continuousVariable = DataFieldFactory.getUndefined();
  categoricalVariable1 = DataFieldFactory.getUndefined();
  categoricalVariable2 = DataFieldFactory.getUndefined();
  sort = DataFieldFactory.getUndefined();
  scatter = false;
  outliers = false;
  average = false;
  standardDeviation = false;
}

export interface BoxWhiskersDataModel extends GraphData {
  min: number;
  max: number;
}
