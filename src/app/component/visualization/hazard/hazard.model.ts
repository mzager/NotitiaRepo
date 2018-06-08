import { EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from 'app/model/graph-data.model';
import { Legend } from './../../../model/legend.model';


export class HazardConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.PATIENT;
        this.visualization = VisualizationEnum.HAZARD;
        this.label = 'Hazard';
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
