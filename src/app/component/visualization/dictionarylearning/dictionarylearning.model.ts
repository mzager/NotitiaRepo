import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class DictionaryLearningFitAlgorithm {
  public static LARS = 'lars';
  public static CD = 'cd';
}

export class DictionaryLearningTransformAlgorithm {
  public static LASSO_LARS = 'lasso_lars';
  public static LASSO_CD = 'lasso_cd';
  public static LARS = 'lars';
  public static OMP = 'omp';
  public static THRESHOLD = 'threshold';
}

export class DictionaryLearningConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.DICTIONARY_LEARNING;
    this.label = 'Dictionary Learning';
    this.enableBehaviors = true;
  }

  n_components = 10;
  dimension = DimensionEnum.THREE_D;
  alpha = 1;
  max_iter = 1000;
  tol = 1e-8;
  fit_algorithm = DictionaryLearningFitAlgorithm.CD;
  transform_algorithm = DictionaryLearningTransformAlgorithm.OMP;
  split_sign: Boolean = false;
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface DictionaryLearningDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;

  components: any;
  error: any;
  nIter: any;
}
