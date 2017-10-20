import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';
import { DistanceEnum, DenseSparseEnum } from './../../../model/enum.model';
import { Component } from '@angular/core';

export enum TsneMetric {
    euclidean = 0,
    manhattan = 1,
    jaccard = 2,
    dice = 4
}
export enum TsneDisplayEnum {
    WEIGHT = 1,
    SCORE = 2,
    LOADING = 4,
    NONE = 0
}

export class TsneConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.TSNE;
    }

    dimension = DimensionEnum.THREE_D;
    components = 3;
    domain: [-300, 300];
    perpexity = 5;  // 5-50
    early_exaggeration = 5; // *>1
    learning_rate = 500; // 100-1000
    n_iter = 200; // Maximum Number of itterations >200
    // distance = DistanceEnum.EUCLIDEAN;
    density = DenseSparseEnum.DENSE;
    n_iter_without_progress = 300;
    min_grad_norm = 1e-7;
    metric = TsneMetric.euclidean;
    init =
    verbose = 0;
    random_state = 'None';
    method = 'barnes_hut';
    angle =  0.5;
}

export interface TsneDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
}
