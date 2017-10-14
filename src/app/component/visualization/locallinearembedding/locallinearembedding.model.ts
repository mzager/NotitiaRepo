import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class LocalLinearEmbeddingEigenSolver {
    public static AUTO = 'auto';
    public static DENSE = 'dense';
    public static ARPACK = 'arpack';
}

export class LocalLinearEmbeddingMethod {
    public static STANDARD = 'standard';
    public static MODIFIED = 'modified';
    public static LTSA = 'ltsa';
    public static HESSIAN = 'hessian';
}

export class LocalLinearEmbeddingNeighborsAlgorithm {
    public static AUTO = 'auto';
    public static BRUTE = 'brute';
    public static KD_TREE = 'kd_tree';
    public static BALL_TREE = 'ball_tree';
}


export class LocalLinearEmbeddingConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.LOCALLY_LINEAR_EMBEDDING;
    }

    components = 2;
    dimension = DimensionEnum.THREE_D;
    n_neighbors = 5;
    eigen_solver = LocalLinearEmbeddingEigenSolver.AUTO;
    reg = 0.001;
    random_state = 'None';
    neighbors_algorithm = LocalLinearEmbeddingNeighborsAlgorithm.AUTO;
    LocalLinearEmbeddingMethod = LocalLinearEmbeddingMethod.STANDARD;
}


export interface LocalLinearEmbeddingDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
