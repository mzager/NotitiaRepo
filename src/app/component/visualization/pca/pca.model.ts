import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class PcaSvdSolver {
    public static AUTO = 'auto';
    public static FULL = 'full';
    public static ARPACK = 'arpack';
    public static RANDOMIZED = 'randomized';
}

export class PcaConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.PCA;
    }

    components = 3;
    dimension = DimensionEnum.THREE_D;
    copy: Boolean = true;
    whiten: Boolean = false;
    svd_solver = 'auto';
    tol = 0.0;
    iterated_power = 'auto';
    random_state = 'None';
}


export interface PcaDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
