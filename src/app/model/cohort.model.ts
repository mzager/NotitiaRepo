/**
 * Represents a Patient / Sample Cohort
 */
export interface Cohort {
    name: string;
    patientIds: Array<string>;
    sampleIds: Array<string>;
    conditions: Array<CohortCondition>;
}

export interface CohortCondition {
    field: any;
    condition: string;
    value?: string;
    min?: number;
    max?: number;
}
