import { HelpSetConfigAction } from './../action/help.action';
import { GraphConfig } from './../model/graph-config.model';
import { DataLoadedAction, DataLoadFromDexieAction } from './../action/data.action';
import { DataChromosome } from './../model/data-chromosome.model';
import { DataField, DataTable } from './../model/data-field.model';
import * as e from 'app/model/enum.model';
import * as help from 'app/action/help.action';
import { Action } from '@ngrx/store';

export interface State {
    helpConfig: GraphConfig;
}

const initialState: State = {
    helpConfig: null
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case help.HELP_SET_CONFIG:
            const hsa: HelpSetConfigAction = action as HelpSetConfigAction;
            return Object.assign({}, state, { helpConfig: hsa.payload });
        default:
            return state;
    }
}

export const getHelpConfigState = (state: State) => state.helpConfig;
