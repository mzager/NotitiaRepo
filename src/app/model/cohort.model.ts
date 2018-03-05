/**
 * Represents a Geneset Set
 */
export interface Cohort {
    name: string;
    patientIds: Array<string>;
    sampleIds: Array<string>;
    criteria: any;
  }
  