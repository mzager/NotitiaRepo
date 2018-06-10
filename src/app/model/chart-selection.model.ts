import { EntityTypeEnum } from './enum.model';
export interface ChartSelection {  // Field W/o Value
    type: EntityTypeEnum;
    ids: Array<string>;
}
