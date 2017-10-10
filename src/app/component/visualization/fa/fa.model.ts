import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class FaSvdMethod {
    public static RANDOMIZED = 'randomized';
    public static LAPACK = 'lapack';
}     
export class FaConfigModel extends GraphConfig {
    
    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.FA;
    }
    
    components = 3;
    dimension = DimensionEnum.THREE_D;
    svd_method = FaSvdMethod.RANDOMIZED;
    tol = 0.01;
    copy = true;
    max_iter = 1000;
    iterated_power = 3;
    random_state = 0;
}


export interface FaDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
