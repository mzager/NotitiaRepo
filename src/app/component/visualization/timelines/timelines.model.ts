import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class TimelinesStyle {
    public static HIDDEN: 'Hidden';
    public static CONTINUOUS = 'Continuous Bar';
    public static TICKS = 'Ticks';
    public static ARCS = 'Arcs';
    public static SYMBOLS = 'Symbols';
}

export class TimelinesConfigModel extends GraphConfig {
    constructor() {
        super();
        this.visualization = VisualizationEnum.TIMELINES;
        this.entity = EntityTypeEnum.PATIENT;
    }
    align = 'Diagnosis';
    sort = 'Death';
    bars: Array<any>;
    heatmap: Array<DataField>;
}

export interface TimelinesDataModel {
    legends: Array<Legend>;
    result: any;
}
