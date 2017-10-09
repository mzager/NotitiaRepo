import { Action } from '@ngrx/store';
import { Legend } from 'app/model/legend.model';

// Actions Consts
export const LEGEND_EDGE_ADD = '[LEGEND] EDGE ADD';
export const LEGEND_EDGE_DELETE = '[LEGEND] EDGE DELETE';
export const LEGEND_A_ADD = '[LEGEND] A ADD ';
export const LEGEND_A_DELETE = '[LEGEND] A DELETE';
export const LEGEND_B_ADD = '[LEGEND] B ADD';
export const LEGEND_B_DELETE = '[LEGEND] B DELETE';

// Action Classes
export class LegendEdgeAddAction implements Action {
    readonly type: string = LEGEND_EDGE_ADD;
    constructor(public payload: Legend) { }
}
export class LegendEdgeDeleteAction implements Action {
    readonly type: string = LEGEND_EDGE_DELETE;
    constructor(public payload: Legend) { }
}
export class LegendAAddAction implements Action {
    readonly type: string = LEGEND_A_ADD;
    constructor(public payload: Legend) { }
}
export class LegendADeleteAction implements Action {
    readonly type: string = LEGEND_A_DELETE;
    constructor(public payload: Legend) { }
}
export class LegendBAddAction implements Action {
    readonly type: string = LEGEND_B_ADD;
    constructor(public payload: Legend) { }
}
export class LegendBDeleteAction implements Action {
    readonly type: string = LEGEND_B_DELETE;
    constructor(public payload: Legend) { }
}

// Action Type
export type Actions =
    LegendEdgeAddAction | LegendEdgeDeleteAction |
    LegendAAddAction | LegendADeleteAction |
    LegendBAddAction | LegendBDeleteAction;
