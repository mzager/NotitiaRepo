import { EntityTypeEnum } from 'app/model/enum.model';
import { CollectionTypeEnum, DataTypeEnum } from './enum.model';
import { DataField } from './data-field.model';

/**
* Represents A Field In A DataSet
*/
export class DataFieldFactory {

  public static defaultDataField: DataField = DataFieldFactory.getUndefined();
  public static getColorFields(clinicalFields: Array<DataField>, entity: EntityTypeEnum = EntityTypeEnum.SAMPLE): Array<DataField> {

    switch (entity) {
      case EntityTypeEnum.SAMPLE:
        return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
          switch (v.type) {
            case DataTypeEnum.STRING:
              return (v.values.length <= 10);
            case DataTypeEnum.NUMBER:
              return true;
          }
        })];
        //, DataFieldFactory.getGeneFamily(), DataFieldFactory.getGeneType(), DataFieldFactory.getHicType()];
      case EntityTypeEnum.GENE:
      const  g = {
        key: 'Gistic',
        label: 'Gistic',
        type: DataTypeEnum.NUMBER,
        tbl: 'Gistic',
        values: null,
        ctype: CollectionTypeEnum.MOLECULAR
      };
        return [DataFieldFactory.defaultDataField, DataFieldFactory.getGeneFamily(),
          DataFieldFactory.getGeneType(), DataFieldFactory.getHicType(),
          DataFieldFactory.getTadType()];

    }
    return null;
  }

  public static getSizeFields(clinicalFields: Array<DataField>, entity: EntityTypeEnum = EntityTypeEnum.SAMPLE): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 4);
        case DataTypeEnum.NUMBER:
          return true;
      }
    })];
  }

  public static getShapeFields(clinicalFields: Array<DataField>, entity: EntityTypeEnum = EntityTypeEnum.SAMPLE): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 4);
        case DataTypeEnum.NUMBER:
          return false;
      }
    })];
  }

  public static getCategoricalFields(clinicalFields: Array<DataField>): Array<DataField> {
    return clinicalFields.filter(v => v.type === DataTypeEnum.STRING);
  }

  public static getContinuousFields(clinicalFields: Array<DataField>): Array<DataField> {
    return clinicalFields.filter(v => v.type === DataTypeEnum.NUMBER);
  }

  public static getIntersectFields(clinicalFields: Array<DataField>): Array<DataField> {
    return DataFieldFactory.getShapeFields(clinicalFields);
  }

  public static getGeneFamily(): DataField {
    return {
      key: 'GeneFamily',
      label: 'Gene Family',
      type: DataTypeEnum.FUNCTION,
      tbl: null,
      values: null,
      ctype: CollectionTypeEnum.GENE_FAMILY
    };
  }

  public static getGeneType(): DataField {
    return {
      key: 'GeneType',
      label: 'Gene Type',
      type: DataTypeEnum.FUNCTION,
      tbl: null,
      values: null,
      ctype: CollectionTypeEnum.GENE_TYPE
    };
  }

  public static getTadType(): DataField {
    return {
      key: 'tad',
      label: 'Tad',
      type: DataTypeEnum.FUNCTION,
      tbl: null,
      values: null,
      ctype: CollectionTypeEnum.TAD
    };
  }
  public static getHicType(): DataField {
    return {
      key: 'hic',
      label: 'Hi-C',
      type: DataTypeEnum.FUNCTION,
      tbl: null,
      values: null,
      ctype: CollectionTypeEnum.HIC
    };
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
