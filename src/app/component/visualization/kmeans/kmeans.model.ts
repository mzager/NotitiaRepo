import { VisualizationEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
export class KmeansConfigModel extends GraphConfig {
}

export interface KmeansDataModel extends GraphData {
    legends: Array<Legend>;
}
