import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class TruncatedSvdAlgorithm {
    public static RANDOMIZED = 'randomized';
    // public static ARPACK = 'arpack';

}

export class TruncatedSvdConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.TRUNCATED_SVD;
        this.label = 'Truncated SVD';
    }
    dimension = DimensionEnum.THREE_D;
    algorithm = TruncatedSvdAlgorithm.RANDOMIZED;
    n_components = 10;
    tol = 0;
    n_iter = 5;

    pcx = 1;
    pcy = 2;
    pcz = 3;
}

export interface TruncatedSvdDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

    components: any;
    explainedVariance: any;
    explainedVarianceRatio: any;
    singularValues: any;
}
