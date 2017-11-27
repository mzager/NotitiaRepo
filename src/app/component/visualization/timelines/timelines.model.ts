import { Legend } from './../../../model/legend.model';

import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class TimelinesConfigModel extends GraphConfig {
    constructor() {
        super();
        this.visualization = VisualizationEnum.TIMELINES;
        this.entity = EntityTypeEnum.PATIENT;
    }
    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    showAllGenes: Boolean = false;
    showCytobands: Boolean = true;
}

export interface TimelinesDataModel {
    legends: Array<Legend>;
    result: any;
}
