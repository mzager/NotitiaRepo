import { WORKSPACE_CONFIG } from './../action/graph.action';
import { WorkspaceConfigModel } from './../model/workspace.model';
import { ModalPanelAction, GraphPanelToggleAction } from './../action/layout.action';
import { UnsafeAction } from './../action/unsafe.action';
import * as e from 'app/model/enum.model';
import * as layout from 'app/action/layout.action';
import { Action } from '@ngrx/store';
import { GraphPanelEnum } from 'app/model/enum.model';

export interface State {
    graphPanelA: e.GraphPanelEnum;
    graphPanelB: e.GraphPanelEnum;
    modalPanel: e.PanelEnum;
    workspaceConfig: WorkspaceConfigModel;
}

const initialState: State = {
    graphPanelA: e.GraphPanelEnum.GRAPH_A,
    graphPanelB: e.GraphPanelEnum.NONE,
    modalPanel: e.PanelEnum.DATA,
    workspaceConfig: new WorkspaceConfigModel()
};

export function reducer(state = initialState, action: UnsafeAction): State {
    switch (action.type) {
        case layout.GRAPH_PANEL_TOGGLE:
            if ((action as GraphPanelToggleAction).payload === GraphPanelEnum.GRAPH_A) {
                return Object.assign({}, state,
                    { graphPanelA: (state.graphPanelA === e.GraphPanelEnum.NONE) ? e.GraphPanelEnum.GRAPH_A : e.GraphPanelEnum.NONE });
            } else {
                return Object.assign({}, state,
                    { graphPanelB: (state.graphPanelB === e.GraphPanelEnum.NONE) ? e.GraphPanelEnum.GRAPH_B : e.GraphPanelEnum.NONE });
            }

        case layout.MODAL_PANEL:
            return Object.assign({}, state, { modalPanel: action.payload })
        case WORKSPACE_CONFIG:
            return Object.assign({}, state, { workspaceConfig: action.payload });
        default:
            return state;
    }
}


export const getGraphPanelAState = (state: State) => state.graphPanelA;
export const getGraphPanelBState = (state: State) => state.graphPanelB;
export const getModalPanelState = (state: State) => state.modalPanel;
export const getWorkspaceConfig = (state: State) => state.workspaceConfig;