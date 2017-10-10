import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class MdsConfigModel extends GraphConfig {
   
    components = 3;
    metric = true;
    nInit = 4;
    eps = 1e-3;
    dimension = DimensionEnum.THREE_D;
}




export interface MdsDataModel extends GraphData {
    stress: number;
    result: Array<Array<number>>;
    resultScaled: Array<Array<number>>;
    embeddings: Array<Array<number>>;
    embeddingsScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
}
