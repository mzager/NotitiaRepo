import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory, DataTable } from './../../../model/data-field.model';
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
        this.label = 'Local Linear Embedding';
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    n_neighbors = 5;
    eigen_solver = LocalLinearEmbeddingEigenSolver.AUTO;
    reg = 0.001;
    neighbors_algorithm = LocalLinearEmbeddingNeighborsAlgorithm.AUTO;
    lle_method = LocalLinearEmbeddingMethod.STANDARD;
    tol = 1e-06;
    hessian_tol = 0.0001;
    modified_tol = 1e-12;
}


export interface LocalLinearEmbeddingDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;
    reconstructionError: any;
}
