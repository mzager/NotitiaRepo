import { Action } from '@ngrx/store';
import { QueryPanelEnum, StatPanelEnum, ToolPanelEnum, TcgaPanelEnum,
    HistoryPanelEnum, GraphPanelEnum, LegendPanelEnum, SinglePanelEnum,
    DataPanelEnum, EdgePanelEnum, FilePanelEnum } from 'app/model/enum.model';

// Actions Consts
export const FILE_PANEL_SHOW_TAB = '[LAYOUT] File Panel Show Tab';
export const FILE_PANEL_TOGGLE = '[LAYOUT] File Panel Toggle';
export const EDGE_PANEL_SHOW_TAB = '[LAYOUT] Edge Panel Show Tab';
export const EDGE_PANEL_TOGGLE = '[LAYOUT] Edge Panel Toggle';
export const QUERY_PANEL_SHOW_TAB = '[LAYOUT] Query Panel Show Tab';
export const QUERY_PANEL_TOGGLE = '[LAYOUT] Query Panel Toggle';
export const GRAPH_PANEL_SHOW_TAB = '[LAYOUT] Graph Panel Show Tab';
export const GRAPH_PANEL_TOGGLE = '[LAYOUT] Graph Panel Toggle';
export const GENESET_PANEL_SHOW_TAB = '[LAYOUT] Geneset Panel Show Tab';
export const GENESET_PANEL_TOGGLE = '[LAYOUT] Geneset Panel Toggle';
export const SAMPLE_PANEL_SHOW_TAB = '[LAYOUT] Sample Panel Show Tab';
export const SAMPLE_PANEL_TOGGLE = '[LAYOUT] Sample Panel Toggle';
export const TCGA_PANEL_SHOW_TAB = '[LAYOUT] Tcga Panel Show Tab';
export const TCGA_PANEL_TOGGLE = '[LAYOUT] Tcga Panel Toggle';
export const POPULATION_PANEL_SHOW_TAB = '[LAYOUT] Population Panel Show Tab';
export const POPULATION_PANEL_TOGGLE = '[LAYOUT] Population Panel Toggle';
export const LEGEND_PANEL_SHOW_TAB = '[LAYOUT] Legend Panel Show Tab';
export const LEGEND_PANEL_TOGGLE = '[LAYOUT] Legend Panel Toggle';
export const TOOL_PANEL_SHOW_TAB = '[LAYOUT] Tool Panel Show Tab';
export const TOOL_PANEL_TOGGLE = '[LAYOUT] Tool Panel Toggle';
export const HISTORY_PANEL_SHOW_TAB = '[LAYOUT] History Panel Show Tab';
export const HISTORY_PANEL_TOGGLE = '[LAYOUT] History Panel Toggle';
export const COHORT_PANEL_SHOW_TAB = '[LAYOUT] Cohort Panel Show Tab';
export const COHORT_PANEL_TOGGLE = '[LAYOUT] Cohort Panel Toggle';
export const DATA_PANEL_SHOW_TAB = '[LAYOUT] Data Panel Show Tab';
export const DATA_PANEL_TOGGLE = '[LAYOUT] Data Panel Toggle';
export const WORKSPACE_PANEL_SHOW_TAB = '[LAYOUT] Workspace Panel Show Tab';
export const WORKSPACE_PANEL_TOGGLE = '[LAYOUT] Workspace Panel Toggle';

// Action Classes
export class FilePanelShowTabAction implements Action {
    readonly type: string = FILE_PANEL_SHOW_TAB;
    constructor(public payload: FilePanelEnum) { }
}
export class FilePanelToggleAction implements Action {
    readonly type: string = FILE_PANEL_TOGGLE;
    constructor() { }
}
export class EdgePanelShowTabAction implements Action {
    readonly type: string = EDGE_PANEL_SHOW_TAB;
    constructor(public payload: EdgePanelEnum) { }
}
export class EdgePanelToggleAction implements Action {
    readonly type: string = EDGE_PANEL_TOGGLE;
    constructor() { }
}

export class QueryPanelShowTabAction implements Action {
    readonly type: string = QUERY_PANEL_SHOW_TAB;
    constructor(public payload: QueryPanelEnum) { }
}
export class QueryPanelToggleAction implements Action {
    readonly type: string = QUERY_PANEL_TOGGLE;
    constructor() { }
}

export class TcgaPanelShowTabAction implements Action {
    readonly type: string = TCGA_PANEL_SHOW_TAB;
    constructor(public payload: TcgaPanelEnum) { }
}
export class TcgaPanelToggleAction implements Action {
    readonly type: string = TCGA_PANEL_TOGGLE;
    constructor() { }
}
export class GraphPanelShowTabAction implements Action {
    readonly type: string = GRAPH_PANEL_SHOW_TAB;
    constructor(public payload: GraphPanelEnum) { }
}
export class GraphPanelToggleAction implements Action {
    readonly type: string = GRAPH_PANEL_TOGGLE;
    constructor() { }
}
export class GenesetPanelShowTabAction implements Action {
    readonly type: string = GENESET_PANEL_SHOW_TAB;
    constructor(public payload: SinglePanelEnum) { }
}
export class GenesetPanelToggleAction implements Action {
    readonly type: string = GENESET_PANEL_TOGGLE;
    constructor() { }
}
export class SamplePanelShowTabAction implements Action {
    readonly type: string = SAMPLE_PANEL_SHOW_TAB;
    constructor(public payload: StatPanelEnum) { }
}
export class SamplePanelToggleAction implements Action {
    readonly type: string = SAMPLE_PANEL_TOGGLE;
    constructor() { }
}
export class PopulationPanelShowTabAction implements Action {
    readonly type: string = POPULATION_PANEL_SHOW_TAB;
    constructor(public payload: StatPanelEnum) { }
}
export class PopulationPanelToggleAction implements Action {
    readonly type: string = POPULATION_PANEL_TOGGLE;
    constructor() { }
}
export class LegendPanelShowTabAction implements Action {
    readonly type: string = LEGEND_PANEL_SHOW_TAB;
    constructor(public payload: LegendPanelEnum) { }
}
export class LegendPanelToggleAction implements Action {
    readonly type: string = LEGEND_PANEL_TOGGLE;
    constructor() { }
}
export class ToolPanelShowTabAction implements Action {
    readonly type: string = TOOL_PANEL_SHOW_TAB;
    constructor(public payload: ToolPanelEnum) { }
}
export class ToolPanelToggleAction implements Action {
    readonly type: string = TOOL_PANEL_TOGGLE;
    constructor() { }
}
export class WorkspacePanelShowTabAction implements Action {
    readonly type: string = WORKSPACE_PANEL_SHOW_TAB;
    constructor(public payload: ToolPanelEnum) { }
}
export class WorkspacePanelToggleAction implements Action {
    readonly type: string = WORKSPACE_PANEL_TOGGLE;
    constructor() { }
}
export class HistoryPanelShowTabAction implements Action {
    readonly type: string = HISTORY_PANEL_SHOW_TAB;
    constructor(public payload: HistoryPanelEnum) { }
}
export class HistoryPanelToggleAction implements Action {
    readonly type: string = HISTORY_PANEL_TOGGLE;
    constructor() { }
}
export class CohortPanelShowTabAction implements Action {
    readonly type: string = COHORT_PANEL_SHOW_TAB;
    constructor(public payload: GraphPanelEnum) { }
}
export class CohortPanelToggleAction implements Action {
    readonly type: string = COHORT_PANEL_TOGGLE;
    constructor() { }
}
export class DataPanelShowTabAction implements Action {
    readonly type: string = DATA_PANEL_SHOW_TAB;
    constructor(public payload: DataPanelEnum) { }
}
export class DataPanelToggleAction implements Action {
    readonly type: string = DATA_PANEL_TOGGLE;
    constructor() { }
}

// Action Type
export type Actions =
   FilePanelShowTabAction | FilePanelToggleAction |
   EdgePanelShowTabAction | EdgePanelToggleAction |
   QueryPanelShowTabAction | QueryPanelToggleAction |
   GraphPanelShowTabAction | GraphPanelToggleAction |
   GenesetPanelShowTabAction | GenesetPanelToggleAction |
   SamplePanelShowTabAction | SamplePanelToggleAction |
   PopulationPanelShowTabAction | PopulationPanelToggleAction |
   LegendPanelShowTabAction | LegendPanelToggleAction |
   ToolPanelShowTabAction | ToolPanelToggleAction |
   HistoryPanelShowTabAction | HistoryPanelToggleAction |
   CohortPanelShowTabAction | CohortPanelToggleAction |
   DataPanelShowTabAction | DataPanelToggleAction |
   WorkspacePanelShowTabAction | WorkspacePanelToggleAction;
