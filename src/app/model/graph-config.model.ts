import { GraphData } from './graph-data.model';
import { DataField } from 'app/model/data-field.model';
import { DataTable, DataFieldFactory } from './data-field.model';
import { EntityTypeEnum } from './enum.model';
import { Legend } from './legend.model';
import { VisualizationEnum, GraphEnum, ShapeEnum } from 'app/model/enum.model';
/**
 * Represents The Graph Config
 */
export interface Graph {
    config: GraphConfig;
    data: GraphData;
}

export class GraphConfig {

    dirtyFlag = 1;
    visualization: VisualizationEnum;
    entity: EntityTypeEnum;
    graph: GraphEnum;
    table: DataTable;

    sampleSelect: Array<string> = [];
    markerSelect: Array<string> = [];
    sampleFilter: Array<string> = [];
    markerFilter: Array<string> = [];

    pointColor: DataField = DataFieldFactory.getUndefined();
    pointShape: DataField = DataFieldFactory.getUndefined();
    pointSize: DataField = DataFieldFactory.getUndefined();
}
