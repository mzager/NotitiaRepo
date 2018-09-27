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
  LABEL = 1 << 4,
  GROUP = 1 << 5,
  CLUSTER_DBSCAN = 1 << 6,
  CLUSTER_AGGLOMERATIVE = 1 << 7,
  CLUSTER_GAUSSIANMIXTURE = 1 << 8,
  CLUSTER_MINIBATCHKMEANS = 1 << 9,
  CLUSTER_SPECTRALCLUSTERING = 1 << 10,
  CLUSTER_WARD = 1 << 11
}
export interface DataDecorator {
  type: DataDecoratorTypeEnum;
  values: Array<DataDecoratorValue>;
  field: DataField;
  legend: Legend;
}
