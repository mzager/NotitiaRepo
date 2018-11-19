import { Preprocessing } from './preprocessing.model';
import { PreprocessingMethod, PreprocessingType } from './enum.model';
/**
 * Represents a Preprocessing Set
 * update array!
 */
export interface Preprocessing {
  n: string;
  steps: Array<PreprocessingStep>;
}

export interface PreprocessingStep {
  method: PreprocessingMethod;
  type: PreprocessingType;
  url: string;
  params: Array<PreprocessingStepParmas>;
}

export interface PreprocessingStepParmas {
  name: string;
  dataType: 'float' | 'int' | 'set' | 'boolean' | 'array-like' | 'number' | 'str';
  desc: string;
  default: any;
  values: Array<any>;
  value?: any;
}
