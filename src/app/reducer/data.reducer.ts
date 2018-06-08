import { Action } from '@ngrx/store';
import * as data from 'app/action/data.action';
import { DataLoadedAction, DataUpdateCohortsAction, DataUpdateGenesetsAction, DataUpdatePathwayAction } from './../action/data.action';
import { DataField, DataTable } from './../model/data-field.model';

export interface State {
    // chromosome: DataChromosome;
    dataset: string;
    fields: Array<DataField>;
    tables: Array<DataTable>;
    pathways: Array<any>;
    genesets: Array<any>;
    cohorts: Array<any>;
    events: Array<{ type: string, subtype: string }>;
}

const initialState: State = {
    // chromosome: null,
    dataset: null,
    fields: [],
    tables: [],
    events: [],
    pathways: [],
    genesets: [],
    cohorts: []
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case data.DATA_LOADED:
            const dla: DataLoadedAction = action as DataLoadedAction;
            return Object.assign({}, state, {
                cohorts: dla.cohorts,
                pathways: dla.pathways,
                genesets: dla.genesets,
                dataset: dla.dataset, fields: dla.fields, tables: dla.tables, events: dla.events
            });
        case data.DATA_UPDATE_COHORTS:
            const duc: DataUpdateCohortsAction = action as DataUpdateCohortsAction;
            return Object.assign({}, state, { cohorts: duc.payload });
        case data.DATA_UPDATE_PATHWAYS:
            const dup: DataUpdatePathwayAction = action as DataUpdatePathwayAction;
            return Object.assign({}, state, { pathways: dup.payload });
        case data.DATA_UPDATE_GENESETS:
            const dug: DataUpdateGenesetsAction = action as DataUpdateGenesetsAction;
            return Object.assign({}, state, { genesets: dug.payload });
        default:
            return state;
    }
}

export const getPathways = (state: State) => state.pathways;
export const getGenesets = (state: State) => state.genesets;
export const getCohorts = (state: State) => state.cohorts;
export const getDataset = (state: State) => state.dataset;
export const getFields = (state: State) => state.fields;
export const getTables = (state: State) => state.tables;
export const getEvents = (state: State) => state.events;
