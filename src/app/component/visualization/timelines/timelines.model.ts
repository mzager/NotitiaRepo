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

    attrs = [];

    align = 'Relapse';
    sort = {label: 'None'}; //{label: 'Relapse', type: 'event'};
    group = {label: 'None'};
    bars = [
        {label: 'Immunosuppression Kinetics', style: TimelinesStyle.ARCS, events: ['Start ISP', 'Stop ISP', 'Restart ISP'], row: 0, z: 0, track: 0},
        {label: 'GVHD', style: TimelinesStyle.SYMBOLS, events: ['Chronic GVHD', 'Acute GVHD', 'Acute GVHD Grade I-II', 'Acute GVHD Grade III-IV'], row: 0, z: 1, track: 0},
        {label: 'Response or Relapse', style: TimelinesStyle.TICKS, events: ['CR', 'Relapse', 'Death', 'Last Follow Up'], row: 1, z: 0, track: 1},
        {label: 'Treatment', style: TimelinesStyle.SYMBOLS, events: ['Induction chemotherapy','Consolidation chemotherapy','Hydroxyurea','Intrathecal therapy','Radiation','Hypomethylating therapy','Targeted therapy','Checkpoint inhibitors','Cytokine','DLI','HCT','Other'], row: 1, z: 1, track: 1},
    ];
    // align = 'Diagnosis';
    // sort = 'Death';
    // bars = [
    //     { 'label': 'Status', 'style': TimelinesStyle.SYMBOLS, 'events': ['Follow Up', 'Diagnosis', 'Death'], row: 0, z: 0, track: 0 },
    //     { 'label': 'Treatment', 'style': TimelinesStyle.ARCS, 'events': ['Drug', 'Radiation'], row: 0, z: 1, track: 0 }
    // ];
}

export interface TimelinesDataModel {
    legends: Array<Legend>;
    result: any;
}
