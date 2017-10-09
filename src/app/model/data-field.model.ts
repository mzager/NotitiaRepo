import { CollectionTypeEnum } from './enum.model';
import { DataField } from './data-field.model';
import { DataTypeEnum } from 'app/model/enum.model';

/**
* Represents A Field In A DataSet
*/
export class DataFieldFactory {




  public static defaultDataField: DataField = DataFieldFactory.getUndefined();
  public static getColorFields(clinicalFields: Array<DataField>): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 10);
        case DataTypeEnum.NUMBER:
          return true;
      }
    })];
  }

  public static getSizeFields(clinicalFields: Array<DataField>): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 4);
        case DataTypeEnum.NUMBER:
          return true;
      }
    })];
  }

  public static getShapeFields(clinicalFields: Array<DataField>): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 4);
        case DataTypeEnum.NUMBER:
          return false;
      }
    })];
  }


  public static getUndefined(): DataField {
    return {
      key: 'None',
      label: 'None',
      type: DataTypeEnum.UNDEFINED,
      tbl: null,
      values: null,
      ctype: CollectionTypeEnum.UNDEFINED
    };
  }
  // public static create(key: string, label: string, type: DataTypeEnum = DataTypeEnum.UNDEFINED, data: any = null): DataField {
  //   return {
  //     key: key,
  //     label: label,
  //     type: type
  //   };
  // }
}

export interface DataTable {
  tbl: string;
  label: string;
  map: string;
  ctype: CollectionTypeEnum;
}
export interface DataField {
  key: string;
  label: string;
  type: DataTypeEnum;
  tbl: string;
  values: any;
  ctype: CollectionTypeEnum;
}
