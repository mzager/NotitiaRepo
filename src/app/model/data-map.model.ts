import { Legend } from 'app/model/legend.model';
import { DataField } from 'app/model/data-field.model';
import { EntityTypeEnum } from './enum.model';


export interface DataDecoratorValue {
    pid: string;
    sid: string;
    mid: string;
    key: any;
    value: any;
    label: string;
}
export const enum DataDecoratorTypeEnum {
    COLOR = 0,
    SIZE = 1 << 0,
    SHAPE = 1 << 1,
    TOOLTIP = 1 << 2,
    SELECT = 1 << 3
}
export interface DataDecorator {
    type: DataDecoratorTypeEnum;
    values: Array<DataDecoratorValue>;
    field: DataField;
    legend: Legend;
}
