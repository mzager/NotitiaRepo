import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class MiniBatchDictionaryLearningFit {
    public static LARS = 'lars';
    public static CD = 'cd';
}
export class MiniBatchDictionaryTransform {
    public static OMP = 'omp';
    public static LASSO_LARS = 'lasso_lars';
    public static LASSO_CD = 'lasso_cd';
    public static LARS = 'lars';
    public static THRESHOLD = 'threshold';
}

export class MiniBatchDictionaryLearningConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING;
        this.label = 'Dictionary Learning Mini Batch';
    }

    dimension = DimensionEnum.THREE_D;
    n_components = 10;
    alpha = 1;
    n_iter = 1000;
    fit_algorithm = MiniBatchDictionaryLearningFit.LARS;
    batch_size = 3;
    shuffle = true;
    transform_algorithm = MiniBatchDictionaryTransform.OMP;
    split_sign = false;
    pcx = 1;
    pcy = 2;
    pcz = 3;
}


export interface MiniBatchDictionaryLearningDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

    components: any;
    iter: any;
    inner_stats: any;
}
