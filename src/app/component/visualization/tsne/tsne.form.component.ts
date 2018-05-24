import { TsneConfigModel, TsneMetric, TsneMethod } from './tsne.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-tsne-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tsne.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TsneFormComponent extends AbstractScatterForm {


  @Input() set config(v: TsneConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  TsneMetricOptions = [
    TsneMetric.CANBERRA, TsneMetric.CHEBYSHEV, TsneMetric.CITYBLOCK, TsneMetric.CMATCHING,
    TsneMetric.CORRELATION, TsneMetric.COSINE, TsneMetric.DICE, TsneMetric.EUCLIDEAN,
    TsneMetric.HAMMING, TsneMetric.JACCARD, TsneMetric.KULSINSKI, TsneMetric.KULSINSKI, TsneMetric.L1,
    TsneMetric.L2, TsneMetric.MAHALANOBIS, TsneMetric.MANHATTAN, TsneMetric.MINKOWSKI,
    TsneMetric.ROGERSTANIMOTO, TsneMetric.RUSSELLRAO, TsneMetric.SEUCLIDEAN, TsneMetric.SOKALMICHENER,
    TsneMetric.SOKALSNEATH, TsneMetric.SQEUCLIDEAN, TsneMetric.YULE];

  TsneMethodOptions = [
    TsneMethod.BARNES_HUT, TsneMethod.EXACT];


  constructor(private fb: FormBuilder) {

    super();

    this.PcOptions = [1, 2, 3];

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      pointData: [],
      // pointColor: [],
      // pointShape: [],
      // pointSize: [],

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      early_exaggeration: [],
      domain: [],
      perplexity: [],
      learning_rate: [],
      n_iter: [],
      metric: [],
      sk_method: [],
      min_grad_norm: [],

      enableCohorts: [],
      enableGenesets: [],
      enablePathways: [],
      enableSupplemental: [],
      enableLabel: [],
      enableColor: [],
      enableShape: []
    });

    this.registerFormChange();
  }
}
