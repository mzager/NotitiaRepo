import { PreprocessingMethod, PreprocessingType } from './enum.model';
/**
 * Represents a Preprocessing Set
 * update array!
 */
export class Preprocessing {
  public n: string;
  public steps: Array<PreprocessingStep> = [];

  static getUndefined(): Preprocessing {
    const rv = new Preprocessing();
    rv.n = 'None';
    rv.steps = [];
    return rv;
  }
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
