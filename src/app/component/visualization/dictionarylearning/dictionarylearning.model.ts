import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class DictionaryLearningFitAlgorithm {
    public static LARS = 'lars';
    public static CD = 'cd';
}

export class DictionaryLearningTransformAlgorithm {
    public static LASSO_LARS = 'lasso_lars';
    public static LASSO_CD = 'lasso_cd';
    public static LARS = 'lars';
    public static OMP = 'omp';
    public static THRESHOLD = 'threshold';
}

export class DictionaryLearningConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.DICTIONARY_LEARNING;
    }

    components = 3;
    dimension = DimensionEnum.THREE_D;
    alpha = 1;
    max_iter = 1000;
    tol = 1e-08;
    fit_algorithm = DictionaryLearningFitAlgorithm.CD;
    transform_algorithm = DictionaryLearningTransformAlgorithm.OMP;
    split = false;
}

export interface DictionaryLearningDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
