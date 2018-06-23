import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class FastIcaAlgorithm {
  public static PARALLEL = 'parallel';
  public static DEFLATION = 'deflation';
}

export class FastIcaFunction {
  public static LOGCOSH = 'logcosh';
  public static EXP = 'exp';
  public static CUBE = 'cube';
}

export class FastIcaConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.FAST_ICA;
    this.label = 'Fast ICA';
  }

  dimension = DimensionEnum.THREE_D;
  n_components = 10;
  algorithm = FastIcaAlgorithm.PARALLEL;
  fun = FastIcaFunction.LOGCOSH;
  whiten: Boolean = false;
  tol = 1e-4;
  pcx = 1;
  pcy = 2;
  pcz = 3;
}

export interface FastIcaDataModel extends GraphData {
  result: any;
  resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;

  components: any;
  mixing: any;
  nIter: any;
}
