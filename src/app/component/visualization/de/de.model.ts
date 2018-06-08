import { DimensionEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class DeConfigModel extends GraphConfig {
    dimension: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    showVectors: Boolean = false;
    latientVectors: Number = 10;
    tolerance: Number = 1e-4;
}

export interface DeDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;
}
