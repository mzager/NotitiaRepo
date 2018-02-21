import { Legend } from './../../../model/legend.model';

import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';
import { GraphData } from 'app/model/graph-data.model';

export class SurvivalConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.PATIENT;
        this.visualization = VisualizationEnum.SURVIVAL;
        this.label = 'Survival';
    }
    censorEvent: string;

    cohorts: Array<{
        name: string,
        sampleIds: Array<number>
    }>;
}

export interface SurvivalDataModel extends GraphData {
    legends: Array<Legend>;
    cohorts: Array<{
        name: string,
        result: Array<[number, number]>,
        confidence: {
            upper: Array<[number, number]>,
            lower: Array<[number, number]>
        },
        median: number,
        timeRange: [number, number]
    }>;
}
