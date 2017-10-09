import { GraphConfig } from 'app/model/graph-config.model';
import { Action } from '@ngrx/store';
import * as e from 'app/model/enum.model';

// Actions Consts
export const SELECT_TOOL = '[SELECT] Tool';
export const SELECT_TOOL_COMPLETE = '[SELECT] Tool Complete';
export const SELECT_GRAPH = '[SELECT] Graph';
export const SELECT_GRAPH_COMPLETE = '[SELECT] Graph Complete';


// Action Classes
export class SelectToolAction implements Action {
readonly type: string = SELECT_TOOL;
    constructor(public payload: e.ToolEnum ) { }
}
export class SelectToolCompleteAction implements Action {
    readonly type: string = SELECT_TOOL_COMPLETE;
    constructor(public payload: { graph: e.GraphEnum, config: GraphConfig} ) { }
}
export class SelectGraphAction implements Action {
    readonly type: string = SELECT_GRAPH;
    constructor(public payload: { config: GraphConfig } ) { }
}
export class SelectGraphCompleteAction implements Action {
    readonly type: string = SELECT_GRAPH_COMPLETE;
    constructor(public payload: { config: GraphConfig } ) { }
}

// Action Type
export type Actions =
    SelectToolAction | SelectToolCompleteAction | SelectGraphAction |
     SelectGraphCompleteAction;
