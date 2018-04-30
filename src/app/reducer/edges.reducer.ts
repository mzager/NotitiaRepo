import { COMPUTE_EDGES_COMPLETE } from './../action/compute.action';
import { EdgeDataModel, EdgeConfigModel } from './../component/visualization/edges/edges.model';
import { GraphConfig } from './../model/graph-config.model';
import { DataLoadedAction } from './../action/data.action';
import { DataChromosome } from './../model/data-chromosome.model';
import { DataField } from './../model/data-field.model';
import * as e from 'app/model/enum.model';
import * as data from 'app/action/data.action';
import { Action } from '@ngrx/store';

export interface State {
    config: EdgeConfigModel;
    data: EdgeDataModel;
}

const initialState: State = {
    config: new EdgeConfigModel(),
    data: null
};

export function reducer(state = initialState, action: any): State {
    switch (action.type) {
        case COMPUTE_EDGES_COMPLETE:
            return Object.assign({}, state,
                { data: action.payload.data, config: action.payload.config });
        default:
            return state;
    }
}

export const getConfig = (state: State) => state.config;
