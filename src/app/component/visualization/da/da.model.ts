import { DimensionEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class DaConfigModel extends GraphConfig {
  dimension: DimensionEnum = DimensionEnum.THREE_D;
  domain: Array<number> = [-500, 500];
}

export interface DaDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;
}
