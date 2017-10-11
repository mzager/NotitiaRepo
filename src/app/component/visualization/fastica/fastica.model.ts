import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class FastIcaAlgorithm {
    public static PARALLEL = 'parallel';
    public static DEFLATION = 'deflation';
}

export class FastIcaFunction {
    public static LOGCOSH = 'logcosh';
    public static EXP = 'exp';
    public static CUBE = 'cube';
}

export class FastIcaConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.FAST_ICA;
    }

    dimension = DimensionEnum.THREE_D;
    components = 3;
    algorithm = FastIcaAlgorithm.PARALLEL;
    fun = FastIcaFunction.LOGCOSH;
    whiten: Boolean = false;
    tol = 1e-4;
}


export interface FastIcaDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
