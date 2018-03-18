import { EntityTypeEnum } from './../../../model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { VisualizationEnum, ShapeEnum, GraphEnum, DimensionEnum, DistanceEnum } from 'app/model/enum.model';
import { DataField } from 'app/model/data-field.model';

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
