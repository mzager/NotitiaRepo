import { TsneConfigModel, TsneDistanceMeasure, TsneDisplayEnum } from './tsne.model';
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
    <label class="center-block">Data
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
    <label class="center-block"><span class="form-label">Distance Measure</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="distanceOptions"
        formControlName="distance">
          <option *ngFor="let options of distanceOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Data Density</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="densityOptions"
        formControlName="density">
          <option *ngFor="let options of densityOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">
    <span class="form-label">Perplexity</span>
    <p class="range-field">
      <input type="range" min="5" max="50" formControlName="perpexity" />
    </p>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">
    <span class="form-label">Early Exaggeration</span>
    <p class="range-field">
      <input type="range" min="1" max="10" step=".1" formControlName="earlyExaggeration" />
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
      <input type="range" min="50" max="500" formControlName="nIter" />
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



  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      dataKey: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      molecularTable: [],
      pointData: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      dimension: [],
      earlyExaggeration: [],
      domain: [],
      perpexity: [], // *>1
      learningRate: [], // 100-1000
      nIter: [], // Maximum Number of itterations >200
      distance: [],
      density: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
        if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });
  }
}
