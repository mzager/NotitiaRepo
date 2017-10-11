import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class LdaLearningMethod {
    public static BATCH = 'batch';
    public static ONLINE = 'online';
}

export class LdaConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.LDA;
    }
    // coulld review this, there are a lot
    components = 3;
    dimension = DimensionEnum.THREE_D;
    learning_method = LdaLearningMethod.BATCH;
    learning_decay = 0.7;
    learning_offset = 10;
    mean_change_tol = 1e-3;
}

export interface LdaDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
