import { CohortField } from './cohort.model';
/**
 * Represents a Patient / Sample Cohort
 */

export interface Cohort {
    n: string;
    pids: Array<string>;
    sids: Array<string>;
    conditions: Array<CohortCondition>;
}

export interface CohortField {  // Field W/o Value
    key: string;
    name: string;
    type: 'category' | 'number';
    options?: Array<string>;
}


export interface CohortCondition {  // Field W Value
    field: CohortField;
    pids: Array<string>;
    condition: 'where' | 'and' | 'or';
    value?: string;
    min?: number;
    max?: number;
}
