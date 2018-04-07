import { EntityTypeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DataField } from 'app/model/data-field.model';


export interface DataDecoratorValue {
    pid: string;
    sid: string;
    mid: string;
    key: EntityTypeEnum;
    value: any;
    label: string;
}
export const enum DataDecoratorTypeEnum {
    COLOR = 0,
    SIZE = 1 << 0,
    SHAPE = 1 << 1,
    TOOLTIP = 1 << 2,
    SELECT = 1 << 3,
    LABEL = 1 << 4
}
export interface DataDecorator {
    type: DataDecoratorTypeEnum;
    values: Array<DataDecoratorValue>;
    field: DataField;
    legend: Legend;
}
