import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class SpectralEmbeddingEigenSolver {
    public static NONE = 'none';
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
    }

    components = 2;
    dimension = DimensionEnum.THREE_D;
    eigen_solver = SpectralEmbeddingEigenSolver.NONE;
    random_state = 'None';
    n_neighbors = 'None';
    n_jobs = 1;
    gamma = 'None';
    affinity = SpectralEmbeddingAffinity.NEAREST_NEIGHBORS;
}

export interface SpectralEmbeddingDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
