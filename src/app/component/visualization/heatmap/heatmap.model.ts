import { GraphData } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { VisualizationEnum, ShapeEnum, GraphEnum } from 'app/model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum,
    HClustMethodEnum, HClustDistanceEnum, EntityTypeEnum } from './../../../model/enum.model';

export class HeatmapConfigModel extends GraphConfig {
    method: HClustMethodEnum = HClustMethodEnum.AGNES;
    distance: HClustDistanceEnum = HClustDistanceEnum.SINGLE;
}

export interface HeatmapDataModel extends GraphData {
    legends: Array<Legend>;
    positions: Float32Array;
    colors: Float32Array;
    cluster: any;
}
