import { HeatmapDistance, HeatmapMethod } from './../heatmap/heatmap.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { VisualizationEnum, ShapeEnum, GraphEnum } from 'app/model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
    DimensionEnum, DistanceEnum, DenseSparseEnum,
    HClustMethodEnum, HClustDistanceEnum, EntityTypeEnum
} from './../../../model/enum.model';


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
