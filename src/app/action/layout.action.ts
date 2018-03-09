import { GraphConfig } from './../model/graph-config.model';
import { Action } from '@ngrx/store';
import { GraphPanelEnum, PanelEnum, SinglePanelEnum } from 'app/model/enum.model';

// Actions Consts
export const GRAPH_PANEL_TOGGLE = '[LAYOUT] Graph Panel Toggle';
export const MODAL_PANEL = '[LAYOUT] Modal Panel';
export const LOADER_SHOW = '[LAYOUT] Loader Show';
export const LOADER_HIDE = '[LAYOUT] Loader Hide';

// Action Classes
export class GraphPanelToggleAction implements Action {
    readonly type: string = GRAPH_PANEL_TOGGLE;
    constructor(public payload: GraphPanelEnum) { }
}

export class ModalPanelAction implements Action {
    readonly type: string = MODAL_PANEL;
    constructor(public payload: PanelEnum) { }
}

export class LoaderShowAction implements Action {
    readonly type: string = LOADER_SHOW;
    constructor() {}
}

export class LoaderHideAction implements Action {
    readonly type: string = LOADER_HIDE;
    constructor() {}
}


// Action Type
export type Actions =
   GraphPanelToggleAction | ModalPanelAction | LoaderShowAction | LoaderHideAction;
   
