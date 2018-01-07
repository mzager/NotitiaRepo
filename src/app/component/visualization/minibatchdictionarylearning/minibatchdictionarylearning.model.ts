import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

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
        this.visualization = VisualizationEnum.MDS;
    }

    dimension = DimensionEnum.THREE_D;
    n_components = 3;
    alpha = 1;
    n_iter = 1000;
    fit_algorithm = MiniBatchDictionaryLearningFit.LARS;
    batch_size = 3;
    shuffle = true;
    transform_algorithm = MiniBatchDictionaryTransform.OMP;
    split_sign = false;
}


export interface MiniBatchDictionaryLearningDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    components: any;
    iter: any;
}
