import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';
import { DistanceEnum, DenseSparseEnum } from './../../../model/enum.model';
import { Component } from '@angular/core';

export class TsneMetric {
    public static EUCLIDEAN = 'euclidean';
    public static MANHATTAN = 'manhattan';
    public static JACCARD = 'jaccard';
    public static DICE = 'dice';
    public static CITYBLOCK = 'cityblock';
    public static COSINE = 'cosine';
    public static L1 = 'l1';
    public static L2 = 'l2';
    public static BRAYCURTIS = 'braycurtis';
    public static CANBERRA = 'canberra';
    public static CHEBYSHEV = 'chebyshev';
    public static CORRELATION = 'correlation';
    public static HAMMING = 'hamming';
    public static KULSINSKI = 'kulsinski';
    public static MAHALANOBIS = 'mahalanobis';
    public static CMATCHING = 'matching';
    public static MINKOWSKI = 'minkowski';
    public static ROGERSTANIMOTO = 'rogerstanimoto';
    public static RUSSELLRAO = 'russellrao';
    public static SEUCLIDEAN = 'seuclidean';
    public static SOKALMICHENER = 'sokalmichener';
    public static SOKALSNEATH = 'sokalsneath';
    public static SQEUCLIDEAN = 'sqeuclidean';
    public static YULE = 'yule';
}

export class TsneMethod {
    public static BARNES_HUT = 'barnes_hut';
    public static EXACT = 'exact';

}

export class TsneConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.TSNE;
        this.label = 'T-SNE';
    }

    dimension = DimensionEnum.THREE_D;
    n_components = 3;
    perplexity = 5;
    early_exaggeration = 5;
    learning_rate = 500;
    n_iter = 250;
    n_iter_without_progress = 300;
    min_grad_norm = 1e-7;
    metric = TsneMetric.EUCLIDEAN;
    sk_method = TsneMethod.BARNES_HUT;
    pcx = 1;
    pcy = 2;
    pcz = 3;
}

export interface TsneDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

    embedding: any;
    klDivergence: any;
    nIter: any;
}
