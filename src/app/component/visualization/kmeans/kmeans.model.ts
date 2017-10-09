import { VisualizationEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { Legend } from './../../../model/legend.model';
import { GraphData, GraphConfig } from 'app/model/graph-config.model';
export class KmeansConfigModel extends GraphConfig {
}

export interface KmeansDataModel extends GraphData {
    legends: Array<Legend>;
}
