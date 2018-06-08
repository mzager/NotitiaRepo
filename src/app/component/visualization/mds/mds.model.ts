import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class MdsDissimilarity {
    public static ECULIDEAN = 'euclidean';
    public static PRECOMPUTED = 'precomputed';
}

export class MdsConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.MDS;
        this.label = 'Multidimensional Scaling';
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    metric: Boolean = true;
    eps = 1e-3;
    dissimilarity = MdsDissimilarity.ECULIDEAN;
    pcx = 1;
    pcy = 2;
    pcz = 3;
}


export interface MdsDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

    embedding: any;
    stress: any;
}
