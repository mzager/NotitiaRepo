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
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Data</span>
        <select class="browser-default" materialize="material_select"
        [compareWith]="byKey"
        formControlName="table">
        <option *ngFor="let option of dataOptions">{{option.label}}</option>
        </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Point Color</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions"
          formControlName="pointColor">
          <option *ngFor="let option of colorOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Point Size</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="sizeOptions"
          formControlName="pointSize">
          <option *ngFor="let option of sizeOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Point Shape</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions" formControlName="pointShape">
          <option *ngFor="let option of shapeOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Display Dimension</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="dimensionOptions"
        formControlName="dimension">
          <option *ngFor="let options of dimensionOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Metric</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="TsneMetricOptions"
        formControlName="metric">
          <option *ngFor="let options of TsneMetricOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Method</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="TsneMethodOptions"
        formControlName="sk_method">
          <option *ngFor="let options of TsneMethodOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">
      <span class="form-label">Perplexity</span>
        <p class="range-field">
          <input type="range" min="5" max="50" formControlName="perplexity" />
        </p>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">
      <span class="form-label">Early Exaggeration</span>
        <p class="range-field">
          <input type="range" min="3" max="24" step=".1" formControlName="earlyExaggeration" />
        </p>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">
      <span class="form-label">Learning Rate</span>
        <p class="range-field">
          <input type="range" min="1" max="1000" formControlName="learningRate" />
      </p>
    </label>
  </div>
  <div class="form-group">
      <label class="center-block">
        <span class="form-label">Max Iterations</span>
          <p class="range-field">
          <input type="range" min="250" max="2000" formControlName="nIter" />
        </p>
    </label>
  </div>
</form>
  `
})
export class TsneFormComponent extends AbstractScatterForm  {


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

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      pointData: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      n_components: [],
      dimension: [],
      earlyExaggeration: [],
      domain: [],
      perplexity: [], // *>1
      learningRate: [], // 100-1000
      nIter: [], // Maximum Number of itterations >200
      metric: [],
      sk_method: []
    });

    this.registerFormChange();
  }
}
