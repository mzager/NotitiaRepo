import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class PcaSparseSkMethod {
    public static LARS = 'lars';
    public static CD = 'cd';
}

export class PcaSparseConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.SPARSE_PCA;
        this.label = 'PCA Sparse';
    }

    n_components = 10;
    dimension = DimensionEnum.THREE_D;
    alpha = 1;
    ridge_alpha = 0.01;
    max_iter = 1000;
    tol = 1e-8;
    sk_method = 'cd';
    pcx = 1;
    pcy = 2;
    pcz = 3;
}


export interface PcaSparseDataModel extends GraphData {
    result: Array<Array<number>>;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;
    components: any;
    error: any;
    iter: any;
}
