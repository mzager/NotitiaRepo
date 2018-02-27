import { GraphConfig } from './../model/graph-config.model';
import { Action } from '@ngrx/store';
import { GraphPanelEnum, PanelEnum, SinglePanelEnum } from 'app/model/enum.model';

// Actions Consts
export const GRAPH_PANEL_TOGGLE = '[LAYOUT] Graph Panel Toggle';
export const MODAL_PANEL = '[LAYOUT] Modal Panel';

// Action Classes
export class GraphPanelToggleAction implements Action {
    readonly type: string = GRAPH_PANEL_TOGGLE;
    constructor(public payload: GraphPanelEnum) { }
}

export class ModalPanelAction implements Action {
    readonly type: string = MODAL_PANEL;
    constructor(public payload: PanelEnum) { }
}


// Action Type
export type Actions =
   GraphPanelToggleAction | ModalPanelAction;
   
