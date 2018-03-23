import { EntityTypeEnum } from 'app/model/enum.model';
import { CollectionTypeEnum, DataTypeEnum } from './enum.model';
import { DataField, DataTable } from './data-field.model';

/**
* Represents A Field In A DataSet
*/
export class DataFieldFactory {

  public static defaultDataField: DataField = DataFieldFactory.getUndefined();
  public static getMolecularShapeFields(tables: Array<DataTable>): Array<DataField> {
    return DataFieldFactory.getMolecularColorFields(tables);
  }
  public static getMolecularSizeFields(tables: Array<DataTable>): Array<DataField> {
    return DataFieldFactory.getMolecularColorFields(tables);
  }
  public static getMolecularColorFields(tables: Array<DataTable>): Array<DataField> {


    const fields = tables.filter(tbl => tbl.ctype & CollectionTypeEnum.MOLEC_DATA_FIELD_TABLES).map(tbl => ({
      key: 'avg',
      label: tbl.label + ' (Avg)',
      type: DataTypeEnum.NUMBER,
      tbl: tbl.tbl,
      values: null,
      ctype: tbl.ctype
    }));

    return [DataFieldFactory.defaultDataField, DataFieldFactory.getGeneFamily(),
    DataFieldFactory.getGeneType(), DataFieldFactory.getHicType(),
    DataFieldFactory.getTadType()].concat(...fields);
  }
  public static getSampleColorFields(clinicalFields: Array<DataField>, entity: EntityTypeEnum = EntityTypeEnum.SAMPLE): Array<DataField> {

    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 10);
        case DataTypeEnum.NUMBER:
          return true;
      }
    })];

  }

  public static getSampleSizeFields(clinicalFields: Array<DataField>, entity: EntityTypeEnum = EntityTypeEnum.SAMPLE): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 4);
        case DataTypeEnum.NUMBER:
          return true;
      }
    })];
  }

  public static getSampleShapeFields(clinicalFields: Array<DataField>, entity: EntityTypeEnum = EntityTypeEnum.SAMPLE): Array<DataField> {
    return [DataFieldFactory.defaultDataField, ...clinicalFields.filter(v => {
      switch (v.type) {
        case DataTypeEnum.STRING:
          return (v.values.length <= 8);
        case DataTypeEnum.NUMBER:
          return true;
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
    return DataFieldFactory.getSampleShapeFields(clinicalFields);
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
