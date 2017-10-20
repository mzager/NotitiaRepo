import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class NmfInit {
    public static RANDOM = 'random';
    public static NNDSVD = 'nndsvd';
    public static NNDSVDA = 'nndsvda';
    public static NNDSVDAR = 'nndsvdar';
}
export class NmfSolver {
    public static CD = 'cd';
    public static MU = 'mu';
}
export class NmfBetaLoss {
    public static FROBENIUS = 'frobenius';
    public static KULLBACK_LEIBLER = 'kullback-leibler';
    public static ITAKURA_SAITO = 'itakura-saito';
}

export class NmfConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.NMF;
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    init = NmfInit.RANDOM;
    solver = NmfSolver.CD;
    beta_loss = NmfBetaLoss.FROBENIUS;
    tol = 1e-4;
}


export interface NmfDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    components: any;
    reconstruction_err: any;
    nIter: any;
}
