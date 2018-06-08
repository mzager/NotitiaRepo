import * as select from 'app/action/select.action';
import * as e from 'app/model/enum.model';
import { SELECT_GRAPH_COMPLETE } from './../action/select.action';
import { UnsafeAction } from './../action/unsafe.action';
import { GraphConfig } from './../model/graph-config.model';

export interface State {
    selectedTool: e.ToolEnum;
    selectedGraph: e.GraphEnum;
    selectedConfig: GraphConfig;
}

const initialState: State = {
    selectedTool: e.ToolEnum.MOVE,
    selectedGraph: e.GraphEnum.GRAPH_A,
    selectedConfig: null
};

export function reducer(state = initialState, action: UnsafeAction): State {
    switch (action.type) {
        case select.SELECT_TOOL:
            return Object.assign({}, state, { selectedTool: action.payload });
        case SELECT_GRAPH_COMPLETE:
            return Object.assign({}, state, { selectedGraph: action.payload.graph, selectedConfig: action.payload.config });
        default:
            return state;
    }
}

export const getSelectedTool = (state: State) => state.selectedTool;
export const getSelectedGraph = (state: State) => state.selectedGraph;
export const getSelectedConfig = (state: State) => state.selectedConfig;
