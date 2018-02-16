import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';


export class QuadradicDiscriminantAnalysisConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS;
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    // priors
    // reg_param
    store_covariance = false;
    tol = 1.0e-4;
}


export interface QuadradicDiscriminantAnalysisDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    covariance: any;
    means: any;
    priors: any;
    rotations: any;
    scalings: any;
}
