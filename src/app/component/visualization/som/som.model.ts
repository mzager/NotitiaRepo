import { EntityTypeEnum } from './../../../model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
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
    legends: Array<Legend>;
}
