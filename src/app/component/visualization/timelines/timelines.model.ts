import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class TimelinesStyle {
    public static NONE = 'None';
    public static CONTINUOUS = 'Continuous Bar';
    public static TICKS = 'Bars';
    public static ARCS = 'Arcs';
    public static SYMBOLS = 'Symbols';
}

export class TimelinesConfigModel extends GraphConfig {
    constructor() {
        super();
        this.visualization = VisualizationEnum.TIMELINES;
        this.entity = EntityTypeEnum.PATIENT;
        this.dirtyFlag = DirtyEnum.LAYOUT;
    }
    // align = 'Diagnosis';
    // sort = 'Death';
    align = 'Start ISP';
    sort = 'Stop';
    attrs = [];
    bars = [
        {label: 'Response or Relapse', style: TimelinesStyle.TICKS, events: ['CR','Relapse']},
        {label: 'GVHD', style: TimelinesStyle.TICKS, events: ['Chronic GVHD', 'Acute GVHD', 'Acute GVHD Grade I-II', 'Acute GVHD Grade III-IV']},
        {label: 'Treatment', style: TimelinesStyle.TICKS, events: ['Consolidation chemotherapy']},
        {label: 'Immunosuppression Kinetics', style: TimelinesStyle.TICKS, events: ['Start ISP', 'Stop ISP', 'Restart ISP']},
    ]
    // bars = [
    //     { 'label': 'Status', 'style': 'Bars', 'events': ['Follow Up', 'Diagnosis', 'Death'] },
    //     { 'label': 'Treatment', 'style': 'Bars', 'events': ['Drug', 'Radiation'] }
    // ];
}

export interface TimelinesDataModel {
    legends: Array<Legend>;
    result: any;
}
