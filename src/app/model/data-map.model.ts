import { Legend } from 'app/model/legend.model';
import { DataField } from 'app/model/data-field.model';


export interface DataDecoratorValue {
    pid: string;
    sid: string;
    mid: string;
    key: any;
    value: number;
}
export const enum DataDecoratorTypeEnum {
    COLOR = 0,
    SIZE = 1 << 0,
    SHAPE = 1 << 1,
}
export interface DataDecorator {
    type: DataDecoratorTypeEnum;
    values: Object;
    field: DataField;
    legend: Legend;
}
