import { TsneConfigModel, TsneMetric, TsneMethod } from './tsne.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-tsne-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <mat-form-field>
    <mat-select placeholder='Data' formControlName='table'>
      <mat-option *ngFor='let option of dataOptions' [value]='option.label'>
          {{ option.label }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='X Axis' formControlName='pcx'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Y Axis' formControlName='pcy'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Z Axis' formControlName='pcz'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Metric' formControlName='metric'>
      <mat-option *ngFor='let option of TsneMetricOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Method' formControlName='sk_method'>
      <mat-option *ngFor='let option of TsneMethodOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>Perplexity</span>
        <p class='range-field'>
          <input type='range' min='5' max='50' formControlName='perplexity' />
        </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>Early Exaggeration</span>
        <p class='range-field'>
          <input type='range' min='3' max='24' step='.1' formControlName='early_exaggeration' />
        </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>Learning Rate</span>
        <p class='range-field'>
          <input type='range' min='1' max='1000' formControlName='learning_rate' />
      </p>
    </label>
  </div>
  <div class='form-group'>
      <label class='center-block'>
        <span class='form-label'>Max Iterations</span>
          <p class='range-field'>
          <input type='range' min='250' max='2000' formControlName='n_iter' />
        </p>
    </label>
  </div>
</form>
  `
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
      min_grad_norm: []
    });

    this.registerFormChange();
  }
}
