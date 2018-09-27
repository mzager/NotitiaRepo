import { TsneConfigModel, TsneMetric, TsneMethod } from './tsne.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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
    TsneMetric.COSINE, TsneMetric.EUCLIDEAN,
    TsneMetric.HAMMING, TsneMetric.L1,
    TsneMetric.L2, TsneMetric.MANHATTAN, TsneMetric.MINKOWSKI,
    TsneMetric.ROGERSTANIMOTO, TsneMetric.RUSSELLRAO, TsneMetric.SOKALMICHENER,
    TsneMetric.SQEUCLIDEAN, TsneMetric.KULSINSKI];

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
      min_grad_norm: []
    });

    this.registerFormChange();
  }
}
