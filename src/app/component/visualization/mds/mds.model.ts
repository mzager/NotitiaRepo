import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class MdsDissimilarity {
    public static ECULIDEAN = 'euclidean';
    public static PRECOMPUTED = 'precomputed';
}

export class MdsConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.MDS;
    }

    components = 3;
    dimension = DimensionEnum.THREE_D;
    metric: Boolean = true;
    n_init = 4;
    eps = 1e-3;
    max_iter = 300;
    verbose = 0;
    n_jobs = 1;
    random_state = 'None';
    dissimilarity = MdsDissimilarity.ECULIDEAN;
}


export interface MdsDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
