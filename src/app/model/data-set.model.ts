import { DataCollection } from './data-collection.model';
import { DiseaseEnum } from '../model/enum.model';

/**
 * Represents a Data Set
 */
export interface DataSet {
  name: string;
  disease: DiseaseEnum;
  collections: Array<DataCollection>;
}
