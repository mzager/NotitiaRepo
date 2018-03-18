import { DataField } from 'app/model/data-field.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { DimensionEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { GraphEnum, VisualizationEnum, EntityTypeEnum } from 'app/model/enum.model';
import { Legend } from './../../../model/legend.model';

export enum PlsDisplayEnum {
    WEIGHT = 1,
    SCORE = 2,
    LOADING = 4,
    NONE = 0
}

export class PlsConfigModel extends GraphConfig {
    dimension: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    showVectors: Boolean = false;
    latientVectors: Number = 10;
    tolerance: Number = 1e-4;
}

export interface PlsDataModel extends GraphData {
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;
    scoresX: any;
    loadingsX: any;
    scoresY: any;
    loadingsY: any;
    loadingsScaled: any;
    regressionCoefficient: any;
    weights: any;
    standardDeviationsX: any;
    standardDeviationsY: any;
    meanX: any;
    meanY: any;
    explainedVariance: any;
}
