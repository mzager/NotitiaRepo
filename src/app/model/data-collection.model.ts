import { DataCollection } from './data-collection.model';
import { DataField } from 'app/model/data-field.model';
import { DataTypeEnum } from '../model/enum.model';
/**
 * Represents a Specific Collection In A Data Set
 */
export interface DataCollection {
  name: string;
  type: DataTypeEnum;
  src: string;
  fields: Array<DataField>;
}
