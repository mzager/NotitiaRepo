import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { VisualizationEnum, ShapeEnum, GraphEnum } from 'app/model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum, EntityTypeEnum } from './../../../model/enum.model';

export class SvdConfigModel extends GraphConfig {
    
    dimension: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-300, 300];
    perpexity = 5;  // 5-50
    earlyExaggeration = 5; // *>1
    learningRate = 500; // 100-1000
    nIter = 200; // Maximum Number of itterations >200
    distance = DistanceEnum.EUCLIDEAN;
    density = DenseSparseEnum.DENSE;
}

export interface SvdDataModel extends GraphData {
    legends: Array<Legend>;
    data: Array<any>;
    // eigenvectors: any;
    // eigenvectorsScaled: any;
    // eigenvalues: any;
    // loadings: any;
    // loadingsScaled: any;
    // explainedVariance: any;
    // cumulativeVariance: any;
    // standardDeviations: any;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
}
