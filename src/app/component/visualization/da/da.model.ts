import { DataField } from 'app/model/data-field.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { GraphEnum, VisualizationEnum } from 'app/model/enum.model';
import { Legend } from './../../../model/legend.model';

export class DaConfigModel extends GraphConfig {
    
    dimension: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
}

export interface DaDataModel extends GraphData {
    legends: Array<Legend>;
    pointColor: any;
    pointSize: any;
    pointShape: any;
    sampleIds: Array<string>;
    markerIds: Array<string>;
}
