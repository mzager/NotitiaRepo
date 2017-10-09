import { Action } from '@ngrx/store';

// Actions Consts
export const VIEW_DATA_TABLE = '[VIEW] Data TABLE';

// Action Classes
export class ViewDataTable implements Action {
    readonly type: string = VIEW_DATA_TABLE;
    constructor(public payload?: string ) { }
}

// Action Type
export type Actions =
    ViewDataTable;
