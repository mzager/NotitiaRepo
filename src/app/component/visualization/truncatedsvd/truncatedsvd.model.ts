import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class TruncatedSvdAlgorithem {
    public static RANDOMIZED = 'randomized';
    public static ARPACK = 'arpack';
}

export class TruncatedSvdConfigModel extends GraphConfig {
  
    components = 3;
    dimension = DimensionEnum.THREE_D;
    algorithm = TruncatedSvdAlgorithem.RANDOMIZED;
    tol = 0;
}

export interface TruncatedSvdDataModel extends GraphData {
    result: Array<Array<number>>;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    components: any;
    explainedVariance: any;
    explainedVarianceRatio: any;
    singularValues: any;
}
