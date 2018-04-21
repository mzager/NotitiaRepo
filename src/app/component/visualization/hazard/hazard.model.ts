import { Legend } from './../../../model/legend.model';

import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';
import { GraphData } from 'app/model/graph-data.model';

export class HazardConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.PATIENT;
        this.visualization = VisualizationEnum.HAZARD;
        this.label = 'Hazard';
    }
    censorEvent: string;

    cohorts: Array<{
        name: string,
        sampleIds: Array<number>
    }>;
}
export interface HazardDatumModel {
    line: Array<[number, number]>;
    upper: Array<[number, number]>;
    lower: Array<[number, number]>;
    range: Array<[number, number]>;
    name: string;
    color: number;
}
export interface HazardDataModel extends GraphData {
    legends: Array<Legend>;
    hazard: Array<HazardDatumModel>;
}
