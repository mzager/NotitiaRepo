import * as data from 'app/action/data.action';
import * as spreadsheet from 'app/action/spreadsheet.action';
import { UnsafeAction } from './../action/unsafe.action';

export interface State {
    data: Array<any>;
    dataTable: string;
    dataTables: Array<string>;
}

const initialState: State = {
    dataTable: null,
    dataTables: [],
    data: []
};

export function reducer(state = initialState, action: UnsafeAction): State {
    switch (action.type) {
        case data.DATA_LOADED:
            break;
        case spreadsheet.VIEW_DATA_TABLE:
            return Object.assign({}, state, { dataTable: action.payload });
        default:
            return state;
    }
}

export const getData = (state: State) => state.data;
export const getDataTable = (state: State) => state.dataTable;
export const getDataTables = (state: State) => state.dataTables;

