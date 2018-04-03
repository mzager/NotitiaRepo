import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class HistogramConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.HISTOGRAM;
        this.label = 'Histogram';
    }
}

export interface HistogramDataModel extends GraphData {
    data: any;
}
