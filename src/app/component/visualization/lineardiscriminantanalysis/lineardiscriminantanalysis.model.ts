import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';
import { linearDiscriminantAnalysisCompute } from './lineardiscriminantanalysis.compute';

export class LinearDiscriminantAnalysisSolver {
    public static SVD = 'svd';
    public static LSQR = 'lsqr';
    public static EIGEN = 'eigen';
}

export class LinearDiscriminantAnalysisShrinkage {
    public static NONE = 'None';
    public static AUTO = 'auto';
    public static FLOAT = 'float';
}

export class LinearDiscriminantAnalysisConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS;
        this.label = 'Linear Discriminant Analysis';
    }

    n_components = 10;
    dimension = DimensionEnum.THREE_D;
    solver = LinearDiscriminantAnalysisSolver.SVD;
    shrinkage = LinearDiscriminantAnalysisShrinkage.NONE;
    // priors =
    store_covariance = false;
    tol = 1.0e-4;

    pcx = 1;
    pcy = 2;
    pcz = 3;
}


export interface LinearDiscriminantAnalysisDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

    coef: any;
    intercept: any;
    covariance: any;
    explained_variance_ratio: any;
    means: any;
    priors: any;
    scalings: any;
    xbar: any;
    classes: any;
}
