import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class BoxWhiskersConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.BOX_WHISKERS;
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    continuousVariable = DataFieldFactory.getUndefined();
    categoricalVariable1 = DataFieldFactory.getUndefined();
    categoricalVariable2 = DataFieldFactory.getUndefined();
    sort = DataFieldFactory.getUndefined();
    scatter = false;
    outliers = false;
    average = false;
    standardDeviation = false;
}

export interface BoxWhiskersDataModel extends GraphData {
    min: number;
    max: number;
}
