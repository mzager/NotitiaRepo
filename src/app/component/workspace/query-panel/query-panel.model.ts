import { DataField } from './../../../model/data-field.model';

export interface ConditionModel {
    field: DataField;
    value: any;
    operator: string;
    condition: string;
}


