import { Pathway } from './../model/pathway.model';
import { Cohort } from './../model/cohort.model';
import { GeneSet } from './../model/gene-set.model';
import { UnsafeAction } from './unsafe.action';
import { DataChromosome } from './../model/data-chromosome.model';
import { DataField, DataTable } from './../model/data-field.model';
import { DataSet } from './../model/data-set.model';
import { GraphEnum } from 'app/model/enum.model';
import { Action } from '@ngrx/store';
import * as XLSX from 'xlsx';

// Action Constants
export const DATA_LOAD_FROM_DEXIE = '[Data] Load From Dexie';
export const DATA_LOAD_FROM_FILE = '[Data] Load From File';
export const DATA_LOAD_FROM_TCGA = '[Data] Load From TCGA';
export const DATA_LOAD_ILLUMINA_VCF = '[Data] Load Illumina VCF';
export const DATA_LOADED = '[Data] Loaded';
export const DATA_UPDATE_GENESETS = '[Data] Update Genesets';
export const DATA_ADD_GENESET = '[Data] Add Geneset';
export const DATA_DEL_GENESET = '[Data] Del Geneset';
export const DATA_UPDATE_PATHWAYS = '[Data] Update Pathways';
export const DATA_ADD_PATHWAY = '[Data] Add Pathway';
export const DATA_DEL_PATHWAY = '[Data] Del Pathway';
export const DATA_UPDATE_COHORTS = '[Data] Update Cohorts';
export const DATA_ADD_COHORT = '[Data] Add Cohort';
export const DATA_DEL_COHORT = '[Data] Del Cohort';
export const DATA_QUERY_COHORT = '[Data] Query Cohort';


// Action Classes
export class DataLoadFromDexieAction implements Action {
    readonly type: string = DATA_LOAD_FROM_DEXIE;
    constructor(public dataset: string) { }
}

export class DataAddPathwayAction implements Action {
    readonly type: string = DATA_ADD_PATHWAY;
    constructor(public payload: { pathway: Pathway, database: string }) { }
}
export class DataDelPathwayAction implements Action {
    readonly type: string = DATA_DEL_PATHWAY
    constructor(public payload: { pathway: Pathway, database: string }) { }
}
export class DataUpdatePathwayAction implements Action {
    readonly type: string = DATA_UPDATE_PATHWAYS;
    constructor(public payload: Array<Pathway>) { }
}


export class DataAddGenesetAction implements Action {
    readonly type: string = DATA_ADD_GENESET;
    constructor(public payload: { geneset: GeneSet, database: string }) { }
}
export class DataDelGenesetAction implements Action {
    readonly type: string = DATA_DEL_GENESET;
    constructor(public payload: { geneset: GeneSet, database: string }) { }
}
export class DataUpdateGenesetsAction implements Action {
    readonly type: string = DATA_UPDATE_GENESETS;
    constructor(public payload: Array<GeneSet>) { }
}

export class DataQueryCohortAction implements Action {
    readonly type: string = DATA_QUERY_COHORT;
    constructor(public payload: { cohort: Cohort, database: string }) { }
}
export class DataAddCohortAction implements Action {
    readonly type: string = DATA_ADD_COHORT;
    constructor(public payload: { cohort: Cohort, database: string }) { }
}
export class DataDelCohortAction implements Action {
    readonly type: string = DATA_DEL_COHORT;
    constructor(public payload: { cohort: Cohort, database: string }) { }
}
export class DataUpdateCohortsAction implements Action {
    readonly type: string = DATA_UPDATE_COHORTS;
    constructor(public payload: Array<Cohort>) { }
}

export class DataLoadFromFileAction implements Action {
    readonly type: string = DATA_LOAD_FROM_FILE;
    constructor(public payload: DataTransfer) { }
}

export class DataLoadFromTcga implements Action {
    readonly type: string = DATA_LOAD_FROM_TCGA;
    constructor(public payload: String) { }
}

export class DataLoadedAction implements UnsafeAction {
    readonly type: string = DATA_LOADED;
    constructor(public dataset: string, public tables: Array<DataTable>, public fields: Array<DataField>,
        public events: Array<{ type: string, subtype: string }>, public genesets: Array<any>, public cohorts: Array<any>) { }
}

export class DataLoadIlluminaVcfAction implements UnsafeAction {
    readonly type: string = DATA_LOAD_ILLUMINA_VCF;
    constructor(public payload: any) { }
}

// Action Type
export type Actions =
    DataLoadFromFileAction | DataLoadFromDexieAction |
    DataLoadedAction | DataLoadIlluminaVcfAction | DataLoadFromTcga |
    DataAddPathwayAction | DataDelPathwayAction | DataUpdatePathwayAction |
    DataAddGenesetAction | DataDelGenesetAction | DataUpdateGenesetsAction |
    DataAddCohortAction | DataDelCohortAction | DataUpdateCohortsAction | DataQueryCohortAction;