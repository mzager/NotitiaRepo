import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
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

    dimension = DimensionEnum.THREE_D;
    algorithm: FastIcaAlgorithm = FastIcaAlgorithm.DEFLATION;
    fun: FastIcaFunction = FastIcaFunction.LOGCOSH;
    whiten = true;
    tol = 1e-4;
}




export interface FastIcaDataModel extends GraphData {
    result: Array<Array<number>>;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
}
