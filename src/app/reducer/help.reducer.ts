import { HelpPanelShowAction } from './../action/layout.action';
import { GraphConfig } from './../model/graph-config.model';
import { DataLoadedAction, DataLoadFromDexieAction } from './../action/data.action';
import { DataChromosome } from './../model/data-chromosome.model';
import { DataField, DataTable } from './../model/data-field.model';
import * as e from 'app/model/enum.model';
import * as layout from 'app/action/layout.action';
import { Action } from '@ngrx/store';

export interface State {
    helpConfig: GraphConfig;
}

const initialState: State = {
    helpConfig: null
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case layout.HELP_PANEL_SHOW:
            const hsa: HelpPanelShowAction = action as HelpPanelShowAction;
            return Object.assign({}, state, { helpConfig: hsa.payload });
        default:
            return state;
    }
}

export const getHelpConfigState = (state: State) => state.helpConfig;
