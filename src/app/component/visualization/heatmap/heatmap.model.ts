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

export class HeatmapMethod {
    public static SINGLE = {label: 'single linkage', value: 's'};
    public static COMPLETE = {label: 'complete linkage', value: 'complete'};
    public static CENTROID = {label: 'centroid linkage', value: 'centroid'};
    public static AVERAGE = {label: 'average linkage', value: 'average'};
}
// 'ward', 'complete', 'average'
// “euclidean”, “l1”, “l2”, “manhattan”, “cosine”, or ‘precomputed
export class HeatmapDistance {
    public static CORRELATION = {label: 'Correlation', value: 'c'};
    public static ABS_CORRELATION = {label: 'Abs(Correlation)', value: 'a'};
    public static UNCENTERED = {label: 'Uncentered', value: 'u'};
    public static ABS_UNCENTERED = {label: 'Abs(Uncentered)', value: 'x'};
    public static SPEARMANS = {label: 'Spearman’s Correlation', value: 's'};
    public static KENDALL = {label: 'Kendall’s τ', value: 'k'};
    public static EUCLIDEAN = {label: 'Euclidean', value: 'euclidean'};
    public static MANHATTEN = {label: 'Manhatten', value: 'm'};
}

export class HeatmapConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.HEATMAP;
    }

    method = 'ward'; //HeatmapMethod.SINGLE.value;
    dist = HeatmapDistance.EUCLIDEAN.value;
    transpose = 0;
}

export interface HeatmapDataModel extends GraphData {
    legends: Array<Legend>;
    map: any;
    values: Array<Array<number>>;
    colors: Array<Array<number>>;
    range: Array<number>;
    x: {
        children: Array<Array<number>>;
        labels: Array<number>;
        n_components: number;
        n_leaves: number;
        result: Array<number>;
    };
    y: {
        children: Array<Array<number>>;
        labels: Array<number>;
        n_components: number;
        n_leaves: number;
        result: Array<number>;
    };
}
