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

// Action Classes
export class DataLoadFromDexieAction implements Action {
    readonly type: string = DATA_LOAD_FROM_DEXIE;
    constructor(public dataset: string) { }
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
        public events: Array<{type: string, subtype: string}>) {}
}

export class DataLoadIlluminaVcfAction implements UnsafeAction {
    readonly type: string = DATA_LOAD_ILLUMINA_VCF;
    constructor(public payload: any) { }
}

// Action Type
export type Actions =
    DataLoadFromFileAction | DataLoadFromDexieAction |
    DataLoadedAction | DataLoadIlluminaVcfAction |
    DataLoadFromTcga;
