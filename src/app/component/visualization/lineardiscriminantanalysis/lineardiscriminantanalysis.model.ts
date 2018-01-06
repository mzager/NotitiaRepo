import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class LinearDiscriminantAnalysisDissimilarity {
    public static ECULIDEAN = 'euclidean';
    public static PRECOMPUTED = 'precomputed';
}

export class LinearDiscriminantAnalysisConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.MDS;
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    metric: Boolean = true;
    eps = 1e-3;
    dissimilarity = LinearDiscriminantAnalysisDissimilarity.ECULIDEAN;
}


export interface LinearDiscriminantAnalysisDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    embedding: any;
    stress: any;
}
