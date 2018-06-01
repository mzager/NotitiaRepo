import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class SpectralEmbeddingEigenSolver {
    public static NONE = 'None';
    public static LOBPCG = 'lobpcg';
    public static ARPACK = 'arpack';
    public static AMG = 'amg';
}

export class SpectralEmbeddingAffinity {
    public static NEAREST_NEIGHBORS = 'nearest_neighbors';
    public static RBF = 'rbf';
    public static PRECOMPUTED = 'precomputed';
    public static CALLABLE = 'callable';
}

export class SpectralEmbeddingConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.SPECTRAL_EMBEDDING;
        this.label = 'Spectral Embedding';
        this.enableSupplemental = false;
    }

    n_components = 10;
    dimension = DimensionEnum.THREE_D;
    eigen_solver = SpectralEmbeddingEigenSolver.NONE;
    n_neighbors = 3;
    gamma = 'None';
    affinity = SpectralEmbeddingAffinity.NEAREST_NEIGHBORS;
    pcx = 1;
    pcy = 2;
    pcz = 3;
}

export interface SpectralEmbeddingDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

    embedding: any;
    affinityMatrix: any;
}
