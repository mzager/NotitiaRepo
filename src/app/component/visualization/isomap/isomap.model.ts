import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class IsoMapEigenSolver {
    public static AUTO = 'auto';
    public static DENSE = 'dense';
    public static ARPACK = 'arpack';
}

export class IsoMapPathMethod {
    public static AUTO = 'auto';
    public static FW = 'FW';
    public static D = 'D';
}

export class IsoMapNeighborsAlgorithm {
    public static AUTO = 'auto';
    public static BRUTE = 'brute';
    public static KD_TREE = 'kd_tree';
    public static BALL_TREE = 'ball_tree';
}

export class IsoMapConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.ISOMAP;
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    tol = 0;
    n_neighbors = 5;
    eigen_solver = IsoMapEigenSolver.AUTO;
    path_method = IsoMapPathMethod.AUTO;
    neighbors_algorithm = IsoMapNeighborsAlgorithm.AUTO;
}


export interface IsoMapDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    embedding: any;
}
