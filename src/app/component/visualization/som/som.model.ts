import { DimensionEnum, DistanceEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class SomConfigModel extends GraphConfig {

    dimension: DimensionEnum = DimensionEnum.THREE_D;
    tau = 0.02;
    iterations = 1;
    dist = DistanceEnum.EUCLIDEAN;
    xCells = 2;
    yCells = 1;
    weights = [];
}

export interface SomDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;
}
