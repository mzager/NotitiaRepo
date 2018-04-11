import * as fromHelp from './help.reducer';
import * as fromData from './data.reducer';
import * as fromGraph from './graph.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRouter from '@ngrx/router-store';
import * as fromSelect from './select.reducer';
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
  help: fromHelp.State;
  graphA: fromGraph.State;
  graphB: fromGraph.State;
  edges: fromEdges.State;
  data: fromData.State;
  selected: fromSelect.State;
  spreadsheet: fromSpreadsheet.State;
}
const graphAReducer = fromGraph.graphReducerA;
const graphBReducer = fromGraph.graphReducerB;

export let reducers = {
  help: fromHelp.reducer,
  layout: fromLayout.reducer,
  graphA: graphAReducer,
  graphB: graphBReducer,
  edges: fromEdges.reducer,
  selected: fromSelect.reducer,
  data: fromData.reducer,
  spreadsheet: fromSpreadsheet.reducer
};

// const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: State, action: any) {

  return productionReducer(state, action);

  // if (environment.production) {
  // } else {
  //   return developmentReducer(state, action);
  // }
}

/**
 * Layout Reducer
 */
export const getLayoutState = (state: State) => state.layout;
export const getLayoutGraphPanelAState = createSelector(getLayoutState, fromLayout.getGraphPanelAState);
export const getLayoutGraphPanelBState = createSelector(getLayoutState, fromLayout.getGraphPanelBState);
export const getLayoutModalPanelState = createSelector(getLayoutState, fromLayout.getModalPanelState);
export const getLayoutLoaderState = createSelector(getLayoutState, fromLayout.getLoaderState);
export const getWorkspaceConfig = createSelector(getLayoutState, (state: fromLayout.State) => state.workspaceConfig);

/**
 * Graph Reducers
 */
export const getGraphAState = (state: State) => state.graphA;
export const getGraphAVisibility = createSelector(getGraphAState, (state: fromGraph.State) => state.visibility);
export const getGraphADepth = createSelector(getGraphAState, (state: fromGraph.State) => state.depth);
export const getGraphAConfig = createSelector(getGraphAState, (state: fromGraph.State) => state.config);
export const getGraphAData = createSelector(getGraphAState, (state: fromGraph.State) => state.data);
export const getGraphADecorators = createSelector(getGraphAState, (state: fromGraph.State) => state.decorators);

export const getGraphBState = (state: State) => state.graphB;
export const getGraphBVisibility = createSelector(getGraphBState, (state: fromGraph.State) => state.visibility);
export const getGraphBDepth = createSelector(getGraphBState, (state: fromGraph.State) => state.depth);
export const getGraphBConfig = createSelector(getGraphBState, (state: fromGraph.State) => state.config);
export const getGraphBData = createSelector(getGraphBState, (state: fromGraph.State) => state.data);
export const getGraphBDecorators = createSelector(getGraphBState, (state: fromGraph.State) => state.decorators);

// Edges Reducer
export const getEdgesState = (state: State) => state.edges;
export const getEdgesConfig = createSelector(getEdgesState, (state: fromEdges.State) => state.config);
export const getEdgesData = createSelector(getEdgesState, (state: fromEdges.State) => state.data);

// Data Reducer
export const getDataState = (state: State) => state.data;
export const getFields = createSelector(getDataState, fromData.getFields);
export const getTables = createSelector(getDataState, fromData.getTables);
export const getEvents = createSelector(getDataState, fromData.getEvents);
export const getGenesets = createSelector(getDataState, fromData.getGenesets);
export const getCohorts = createSelector(getDataState, fromData.getCohorts);

// Spreadsheet Reducer
export const getSpreadsheetState = (state: State) => state.spreadsheet;
export const getDataTable = createSelector(getSpreadsheetState, fromSpreadsheet.getDataTable);

// Help Reducer
export const getHelpState = (state: State) => state.help;
export const getHelpConfigState = createSelector(getHelpState, fromHelp.getHelpConfigState);
