import * as fromData from './data.reducer';
import * as fromGraph from './graph.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRouter from '@ngrx/router-store';
import * as fromSelect from './select.reducer';
import * as fromQuery from './query.reducer';
import * as fromEdges from './edges.reducer';
import * as fromSpreadsheet from './spreadsheet.reducer';
import { ActionReducer } from '@ngrx/store';
import { combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { createSelector } from 'reselect';
import { environment } from '../../environments/environment';
import { GraphEnum } from 'app/model/enum.model';
import { storeFreeze } from 'ngrx-store-freeze';

export interface State {
    layout: fromLayout.State;
    graphA: fromGraph.State;
    graphB: fromGraph.State;
    edges: fromEdges.State;
    data: fromData.State;
    selected: fromSelect.State;
    query: fromQuery.State;
    spreadsheet: fromSpreadsheet.State;
}
const graphAReducer = fromGraph.graphReducerA;
const graphBReducer = fromGraph.graphReducerB;
export let reducers = {
    layout: fromLayout.reducer,
    graphA: graphAReducer,
    graphB: graphBReducer,
    edges: fromEdges.reducer,
    selected: fromSelect.reducer,
    data: fromData.reducer,
    query: fromQuery.reducer,
    spreadsheet: fromSpreadsheet.reducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: State, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

/**
 * Query Reducer
 */
export const getQueryState = (state: State) => state.query;
export const getQueryData = createSelector(getQueryState, fromQuery.getQueryData);


/**
 * Layout Reducer
 */
export const getLayoutState = (state: State) => state.layout;
export const getLayoutFilePanelState = createSelector(getLayoutState, fromLayout.getFilePanelState);
export const getLayoutGeneSignaturePanelState = createSelector( getLayoutState, fromLayout.getGeneSignaturePanelState);
export const getLayoutClusteringAlgorithmPanelState = createSelector( getLayoutState, fromLayout.getClusteringAlgorithmPanelState );
export const getLayoutEdgePanelState = createSelector(getLayoutState, fromLayout.getEdgePanelState);
export const getLayoutQueryPanelState = createSelector(getLayoutState, fromLayout.getQueryPanelState);
export const getLayoutGraphPanelState = createSelector(getLayoutState, fromLayout.getGraphPanelState);
export const getLayoutGenesetPanelState = createSelector(getLayoutState, fromLayout.getGenesetPanelState);
export const getLayoutSamplePanelState = createSelector(getLayoutState, fromLayout.getSamplePanelState);
export const getLayoutPopulationPanelState = createSelector(getLayoutState, fromLayout.getPopulationPanelState);
export const getLayoutLegendPanelState = createSelector(getLayoutState, fromLayout.getLegendPanelState);
export const getLayoutToolPanelState = createSelector(getLayoutState, fromLayout.getToolPanelState);
export const getlayoutTcgaPanelState = createSelector(getLayoutState, fromLayout.getTcgaPanelState);
export const getLayoutHistoryPanelState = createSelector(getLayoutState, fromLayout.getHistoryPanelState);
export const getLayoutCohortPanelState = createSelector(getLayoutState, fromLayout.getCohortPanelState);
export const getLayoutDataPanelState = createSelector(getLayoutState, fromLayout.getDataPanelState);
export const getWorkspacePanelState = createSelector(getLayoutState, fromLayout.getWorkspacePanelState);
export const getWorkspaceConfig = createSelector( getLayoutState, (state: fromLayout.State) => state.workspaceConfig );

/**
 * Graph Reducers
 */
export const getGraphAState = (state: State) => state.graphA;
export const getGraphAVisibility = createSelector( getGraphAState, (state: fromGraph.State) => state.visibility );
export const getGraphADepth = createSelector( getGraphAState, (state: fromGraph.State) => state.depth );
export const getGraphAConfig = createSelector( getGraphAState, (state: fromGraph.State) => state.config );
export const getGraphAData = createSelector( getGraphAState, (state: fromGraph.State) => state.data );

export const getGraphBState = (state: State) => state.graphB;
export const getGraphBVisibility = createSelector( getGraphBState, (state: fromGraph.State) => state.visibility );
export const getGraphBDepth = createSelector( getGraphBState, (state: fromGraph.State) => state.depth );
export const getGraphBConfig = createSelector( getGraphBState, (state: fromGraph.State) => state.config );
export const getGraphBData = createSelector( getGraphBState, (state: fromGraph.State) => state.data );

// Edges Reducer
export const getEdgesState = (state: State) => state.edges;
export const getEdgesConfig = createSelector( getEdgesState, (state: fromEdges.State) => state.config );
export const getEdgesData = createSelector( getEdgesState, (state: fromEdges.State) => state.data );

// Data Reducer
export const getDataState = (state: State) => state.data;
export const getFields = createSelector(getDataState, fromData.getFields);
export const getTables = createSelector(getDataState, fromData.getTables);
export const getEvents = createSelector(getDataState, fromData.getEvents);

/**
 * Spreadsheet Reducer
 */
export const getSpreadsheetState = (state: State) => state.spreadsheet;
export const getDataTable = createSelector(getSpreadsheetState, fromSpreadsheet.getDataTable);
