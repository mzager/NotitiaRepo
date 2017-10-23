import { WORKSPACE_CONFIG } from './../action/graph.action';
import { WorkspaceConfigModel } from './../model/workspace.model';
import { WORKSPACE_PANEL_SHOW_TAB, EDGE_PANEL_SHOW_TAB, FILE_PANEL_SHOW_TAB, 
    TCGA_PANEL_TOGGLE, GENE_SIGNATURE_PANEL_HIDE } from './../action/layout.action';
import { UnsafeAction } from './../action/unsafe.action';
import * as e from 'app/model/enum.model';
import * as layout from 'app/action/layout.action';
import { Action } from '@ngrx/store';

export interface State {
    filePanel: e.FilePanelEnum;
    queryPanel: e.QueryPanelEnum;
    graphPanel: e.GraphPanelEnum;
    genesetPanel: e.SinglePanelEnum;
    samplePanel: e.StatPanelEnum;
    populationPanel: e.StatPanelEnum;
    legendPanel: e.LegendPanelEnum;
    edgePanel: e.EdgePanelEnum;
    toolPanel: e.ToolPanelEnum;
    tcgaPanel: e.TcgaPanelEnum;
    historyPanel: e.HistoryPanelEnum;
    cohortPanel: e.GraphPanelEnum;
    dataPanel: e.DataPanelEnum;
    geneSignaturePanel: e.SinglePanelEnum;
    clusterAlgorithmPanel: e.SinglePanelEnum;
    workspacePanel: e.WorkspacePanelEnum;
    workspaceConfig: WorkspaceConfigModel;   // Would fit better in a more generalized state reducer
}

const initialState: State = {
    filePanel: e.FilePanelEnum.NONE,
    queryPanel: e.QueryPanelEnum.NONE,
    graphPanel: e.GraphPanelEnum.NONE,
    genesetPanel: e.SinglePanelEnum.HIDE,
    samplePanel: e.StatPanelEnum.NONE,
    populationPanel: e.StatPanelEnum.NONE,
    legendPanel: e.LegendPanelEnum.NONE,
    edgePanel: e.EdgePanelEnum.NONE,
    toolPanel: e.ToolPanelEnum.NONE,
    historyPanel: e.HistoryPanelEnum.NONE,
    cohortPanel: e.GraphPanelEnum.NONE,
    dataPanel: e.DataPanelEnum.NONE,
    geneSignaturePanel: e.SinglePanelEnum.HIDE,
    clusterAlgorithmPanel: e.SinglePanelEnum.HIDE,
    tcgaPanel: e.TcgaPanelEnum.NONE,
    workspacePanel: e.WorkspacePanelEnum.NONE,
    workspaceConfig: new WorkspaceConfigModel()
};

export function reducer(state = initialState, action: UnsafeAction): State {
    switch (action.type) {
        case layout.CLUSTERING_ALGORITHM_PANEL_SHOW:
            return Object.assign({}, state, { clusterAlgorithmPanel: e.SinglePanelEnum.SHOW });
        case layout.CLUSTERING_ALGORITHM_PANEL_HIDE:
            return Object.assign({}, state, { clusterAlgorithmPanel: e.SinglePanelEnum.HIDE });
        case layout.GENE_SIGNATURE_PANEL_SHOW:
            return Object.assign({}, state, { geneSignaturePanel: e.SinglePanelEnum.SHOW });
        case layout.GENE_SIGNATURE_PANEL_HIDE:
            return Object.assign({}, state, { geneSignaturePanel: e.SinglePanelEnum.HIDE });
        case layout.FILE_PANEL_SHOW_TAB:
            return Object.assign({}, state, { filePanel: action.payload });
        case layout.QUERY_PANEL_SHOW_TAB:
            return Object.assign({}, state, { queryPanel: action.payload });
        case layout.GRAPH_PANEL_SHOW_TAB:
            return Object.assign({}, state, { graphPanel: action.payload });
        case layout.GENESET_PANEL_SHOW_TAB:
            return Object.assign({}, state, { genesetPanel: action.payload });
        case layout.SAMPLE_PANEL_SHOW_TAB:
            return Object.assign({}, state, { samplePanel: action.payload });
        case layout.POPULATION_PANEL_SHOW_TAB:
            return Object.assign({}, state, { populationPanel: action.payload });
        case layout.LEGEND_PANEL_SHOW_TAB:
            return Object.assign({}, state, { legendPanel: action.payload });
        case layout.TOOL_PANEL_SHOW_TAB:
            return Object.assign({}, state, { toolPanel: action.payload });
        case layout.TCGA_PANEL_SHOW_TAB:
            return Object.assign({}, state, { tcgaPanel: action.payload });
        case layout.HISTORY_PANEL_SHOW_TAB:
            return Object.assign({}, state, { historyPanel: action.payload });
        case layout.COHORT_PANEL_SHOW_TAB:
            return Object.assign({}, state, { cohortPanel: action.payload});
        case layout.DATA_PANEL_SHOW_TAB:
            return Object.assign({}, state, { dataPanel: action.payload });
        case layout.WORKSPACE_PANEL_SHOW_TAB:
            return Object.assign({}, state, { workspacePanel: action.payload });
        case layout.FILE_PANEL_TOGGLE:
            return Object.assign({}, state,
                { filePanel: (state.filePanel === e.FilePanelEnum.NONE) ? e.FilePanelEnum.OPEN : e.FilePanelEnum.NONE });
        case layout.QUERY_PANEL_TOGGLE:
            return Object.assign({}, state,
                { queryPanel: (state.queryPanel === e.QueryPanelEnum.NONE) ? e.QueryPanelEnum.BUILDER : e.QueryPanelEnum.NONE });
        case layout.GRAPH_PANEL_TOGGLE:
            return Object.assign({}, state,
                { graphPanel: (state.graphPanel === e.GraphPanelEnum.NONE) ? e.GraphPanelEnum.GRAPH_A : e.GraphPanelEnum.NONE });
        case layout.GENESET_PANEL_TOGGLE:
            return Object.assign({}, state,
                { genesetPanel: (state.genesetPanel === e.SinglePanelEnum.HIDE) ? e.SinglePanelEnum.SHOW : e.SinglePanelEnum.HIDE });
        case layout.SAMPLE_PANEL_TOGGLE:
            return Object.assign({}, state,
                { samplePanel: (state.samplePanel === e.StatPanelEnum.NONE) ? e.StatPanelEnum.HISTOGRAM : e.StatPanelEnum.NONE });
        case layout.POPULATION_PANEL_TOGGLE:
            return Object.assign({}, state,
                { populationPanel: (state.populationPanel === e.StatPanelEnum.NONE) ? e.StatPanelEnum.HISTOGRAM : e.StatPanelEnum.NONE });
        case layout.LEGEND_PANEL_TOGGLE:
            return Object.assign({}, state,
                { legendPanel: (state.legendPanel === e.LegendPanelEnum.NONE) ? e.LegendPanelEnum.ALL : e.LegendPanelEnum.NONE });
        case layout.TOOL_PANEL_TOGGLE:
            return Object.assign({}, state,
                { toolPanel: (state.toolPanel === e.ToolPanelEnum.NONE) ? e.ToolPanelEnum.SETTINGS : e.ToolPanelEnum.NONE });
        case layout.TCGA_PANEL_TOGGLE:
                return Object.assign({}, state,
                    { tcgaPanel: (state.tcgaPanel === e.TcgaPanelEnum.NONE) ? e.TcgaPanelEnum.DATASETS : e.TcgaPanelEnum.NONE });
        case layout.EDGE_PANEL_TOGGLE:
            return Object.assign({}, state,
                { edgePanel: (state.edgePanel === e.EdgePanelEnum.NONE) ? e.EdgePanelEnum.SETTINGS : e.EdgePanelEnum.NONE });
        case layout.HISTORY_PANEL_TOGGLE:
            return Object.assign({}, state,
                { historyPanel: (state.historyPanel === e.HistoryPanelEnum.NONE) ? e.HistoryPanelEnum.HISTORY : e.HistoryPanelEnum.NONE });
        case layout.COHORT_PANEL_TOGGLE:
            return Object.assign({}, state,
                { cohortPanel:  (state.cohortPanel === e.GraphPanelEnum.NONE) ? e.GraphPanelEnum.GRAPH_A : e.GraphPanelEnum.NONE });
        case layout.DATA_PANEL_TOGGLE:
            return Object.assign({}, state,
                { dataPanel: (state.dataPanel === e.DataPanelEnum.NONE) ? e.DataPanelEnum.TABLE : e.DataPanelEnum.NONE });
        case layout.WORKSPACE_PANEL_TOGGLE:
            return Object.assign({}, state,
                { workspacePanel: (state.workspacePanel === e.WorkspacePanelEnum.NONE) ?
                    e.WorkspacePanelEnum.SETTINGS : e.WorkspacePanelEnum.NONE });
        case WORKSPACE_CONFIG:
            return Object.assign({}, state, {workspaceConfig: action.payload  });
        default:
            return state;
    }
}

export const getFilePanelState = (state: State) => state.filePanel;
export const getEdgePanelState = (state: State) => state.edgePanel;
export const getQueryPanelState = (state: State) => state.queryPanel;
export const getGraphPanelState = (state: State) => state.graphPanel;
export const getGenesetPanelState = (state: State) => state.genesetPanel;
export const getSamplePanelState = (state: State) => state.samplePanel;
export const getPopulationPanelState = (state: State) => state.populationPanel;
export const getLegendPanelState = (state: State) => state.legendPanel;
export const getToolPanelState = (state: State) => state.toolPanel;
export const getTcgaPanelState = (state: State) => state.tcgaPanel;
export const getHistoryPanelState = (state: State) => state.historyPanel;
export const getCohortPanelState = (state: State) => state.cohortPanel;
export const getDataPanelState = (state: State) => state.dataPanel;
export const getWorkspacePanelState = (state: State) => state.workspacePanel;
export const getGeneSignaturePanelState = (state: State) => state.geneSignaturePanel;
export const getClusteringAlgorithmPanelState = (state: State) => state.clusterAlgorithmPanel;
