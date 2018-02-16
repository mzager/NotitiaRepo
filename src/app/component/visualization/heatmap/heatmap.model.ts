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
    public static SINGLE = { label: 'single', value: 'single' };
    public static COMPLETE = { label: 'complete', value: 'complete' };
    public static AVERAGE = { label: 'average', value: 'average' };
    public static WEIGHTED = { label: 'weighted', value: 'weighted' };
    public static CENTROID = { label: 'centroid', value: 'centroid' };
    public static MEDIAN = { label: 'median', value: 'median' };
    public static WARD = { label: 'ward', value: 'ward' };
}

export class HeatmapDistance {
    public static BRAYCURTIS = { label: 'braycurtis', value: 'braycurtis' };
    public static CANBERRA = { label: 'canberra', value: 'canberra' };
    public static CHEBYSHEV = { label: 'chebyshev', value: 'chebyshev' };
    public static CITYBLOCK = { label: 'cityblock', value: 'cityblock' };
    public static CORRELATION = { label: 'correlation', value: 'correlation' };
    public static COSINE = { label: 'cosine', value: 'cosine' };
    public static DICE = { label: 'dice', value: 'dice' };
    public static EUCLIDEAN = { label: 'euclidean', value: 'euclidean' };
    public static HAMMING = { label: 'hamming', value: 'hamming' };
    public static JACCARD = { label: 'jaccard', value: 'jaccard' };
    public static KULSINSKI = { label: 'kulsinski', value: 'kulsinski' };
    public static MAHALANOBIS = { label: 'mahalanobis', value: 'mahalanobis' };
    public static MATCHING = { label: 'matching', value: 'matching' };
    public static MINKOWSKI = { label: 'minkowski', value: 'minkowski' };
    public static ROGERSTANIMOTO = { label: 'rogerstanimoto', value: 'rogerstanimoto' };
    public static RUSSELLRAO = { label: 'russellrao', value: 'russellrao' };
    public static SEUCLIDEAN = { label: 'seuclidean', value: 'seuclidean' };
    public static SOKALMICHENER = { label: 'sokalmichener', value: 'sokalmichener' };
    public static SOKALSNEATH = { label: 'sokalsneath', value: 'sokalsneath' };
    public static SQEUCLIDEAN = { label: 'sqeuclidean', value: 'sqeuclidean' };
    public static YULE = { label: 'yule', value: 'yule' };
}

export class HeatmapConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.HEATMAP;
        this.label = 'Heatmap';
    }

    order = false;
    method = HeatmapMethod.WARD.value;
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
