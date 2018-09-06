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
    this.visualization = VisualizationEnum.PCA;
    this.label = 'UMAP';
  }

  n_neighbors = 5;
  min_dist = 0.3;
  metric = UmapMetric.CORRELATION;
}

export interface UmapDataModel extends GraphData {
  debugger;
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
