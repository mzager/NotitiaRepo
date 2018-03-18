import { EntityTypeEnum } from './enum.model';
/**
* Represents A Entity In A DataSet
*/
export interface DataPoint {
  type: EntityTypeEnum;
  key: string;
}
