import { EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

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
