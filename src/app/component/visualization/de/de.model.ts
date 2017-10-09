import { DataField } from 'app/model/data-field.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig, GraphData } from './../../../model/graph-config.model';
import { GraphEnum, VisualizationEnum } from 'app/model/enum.model';
import { Legend, LegendItem } from './../../../model/legend.model';

export class DeConfigModel extends GraphConfig {
    dimension: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    showVectors: Boolean = false;
    latientVectors: Number = 10;
    tolerance: Number = 1e-4;
}

export interface DeDataModel extends GraphData {
    legends: Array<Legend>;
    pointColor: any;
    pointSize: any;
    pointShape: any;
    sampleIds: Array<string>;
    markerIds: Array<string>;
}
