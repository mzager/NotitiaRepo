import { DataLoadedAction, DataLoadFromDexieAction } from './../action/data.action';
import { DataChromosome } from './../model/data-chromosome.model';
import { DataField, DataTable } from './../model/data-field.model';
import * as e from 'app/model/enum.model';
import * as data from 'app/action/data.action';
import { Action } from '@ngrx/store';

export interface State {
    // chromosome: DataChromosome;
    dataset: string;
    fields: Array<DataField>;
    tables: Array<DataTable>;
    eventData: Array<string>;
}

const initialState: State = {
    // chromosome: null,
    dataset: null,
    fields: [],
    tables: [],
    eventData: []
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case data.DATA_LOADED:
            const dla: DataLoadedAction = action as DataLoadedAction;
            return Object.assign({}, state, { dataset: dla.dataset, fields: dla.fields, tables: dla.tables });
        default:
            return state;
    }
}
export const getDataset = (state: State) => state.dataset;
export const getFields = (state: State) => state.fields;
export const getTables = (state: State) => state.tables;
