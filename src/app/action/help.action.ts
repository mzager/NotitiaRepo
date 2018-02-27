import { GraphConfig } from 'app/model/graph-config.model';
import { Action } from '@ngrx/store';
import { GraphPanelEnum, PanelEnum, SinglePanelEnum } from 'app/model/enum.model';

// Actions Consts
export const HELP_SET_CONFIG = '[HELP] Set Config';

// Action Classes
export class HelpSetConfigAction implements Action {
    readonly type: string = HELP_SET_CONFIG;
    constructor(public payload: GraphConfig) { }
}

// Action Type
export type Actions =
   HelpSetConfigAction;
   
