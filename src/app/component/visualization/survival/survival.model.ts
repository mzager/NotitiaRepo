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
        this.enableCohorts = true;
        this.enableGenesets = false;
        this.enableLabel = false;
        this.enableColor = false;
        this.enableShape = false;
        this.enableSupplemental = false;
    }
    censorEvent: string;
    cohortsToCompare: Array<string> = [];
}
export interface SurvivalDatumModel {
    line: Array<[number, number]>;
    upper: Array<[number, number]>;
    lower: Array<[number, number]>;
    range: Array<[number, number]>;
    name: string;
    color: number;
}
export interface SurvivalDataModel extends GraphData {
    legends: Array<Legend>;
    survival: Array<SurvivalDatumModel>;
}
