import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class MiniBatchSparsePcaMethod {
    public static LARS = 'euclidean';
    public static CD = 'cd';
}

export class MiniBatchSparsePcaConfigModel extends GraphConfig {
 
    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.MINI_BATCH_SPARSE_PCA;
    }

    n_components = 3;
    alpha = 1;
    ridge_alpha = 0.01;
    n_iter = 100;
    batch_size = 3;
    shuffle = true;
    method = MiniBatchSparsePcaMethod.LARS;
}


export interface MiniBatchSparsePcaDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    error: any;
    n_iter: any;
}
