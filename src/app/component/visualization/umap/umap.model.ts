import {
  DimensionEnum,
  EntityTypeEnum,
  VisualizationEnum
} from 'app/model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class UmapMetric {
  public static EUCLIDEAN = 'euclidean';
  public static MANHATTAN = 'manhattan';
  public static CHEBYSHEV = 'chebyshev';
  public static MINKOWSKI = 'minkowski';
  public static CANBERRA = 'canberra';
  public static BRAYCURTIS = 'braycurtis';
  public static MAHALANOBIS = 'mahalanobis';
  public static WMINKOWSKI = 'wminkowski';
  public static SEUCLIDEAN = 'seuclidean';
  public static COSINE = 'cosine';
  public static CORRELATION = 'correlation';
  public static HAVERSINE = 'haversine';
  public static HAMMING = 'hamming';
  public static JACCARD = 'jaccard';
  public static DICE = 'dice';
  public static RUSSELRAO = 'russelrao';
  public static KULSINSKI = 'kulsinski';
  public static ROGERSTANIMOTO = 'rogerstanimoto';
  public static SOKALMICHENER = 'sokalmichener';
  public static SOKALSNEATH = 'sokalsneath';
  public static YULE = 'yule';
}

export class UmapConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.SAMPLE;
    this.visualization = VisualizationEnum.UMAP;
    this.enableSupplemental = false;
    this.label = 'UMAP';
  }
  learning_rate = 1.0;
  n_components = 3;
  n_neighbors = 5;
  min_dist = 0.3;
  spread = 1;
  set_op_mix_ratio = 1;
  local_connectivity = 1;
  repulsion_strength = 1;
  negative_sample_rate = 5;
  transform_queue_size = 4;
  angular_rp_forest = false;
  target_n_neighbors = -1;
  target_weight = 0.5;
  metric = UmapMetric.CORRELATION;
}

export interface UmapDataModel extends GraphData {
  result: any;
  // resultScaled: Array<Array<number>>;
  sid: Array<string>;
  mid: Array<string>;
  pid: Array<string>;
  // components: any;
  // explainedVariance: any;
  // explainedVarianceRatio: any;
  // singularValues: any;
  // mean: any;
  // nComponents: any;
  // noiseVariance: any;
}
