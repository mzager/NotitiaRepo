import { DictionaryLearningConfigModel, DictionaryLearningFitAlgorithm,
  DictionaryLearningTransformAlgorithm } from './dictionarylearning.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-dictionarylearning-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block">Data
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          formControlName="table">
          <option *ngFor="let option of dataOptions" [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">Display
      <select class="browser-default" materialize="material_select"
          formControlName="entity">
          <option *ngFor="let option of displayOptions">{{option}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Color</span>
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
    <label class="center-block"><span class="form-label">Size</span>
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
    <label class="center-block"><span class="form-label">Shape</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions" formControlName="pointShape">
          <option *ngFor="let option of shapeOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
   <div class="form-group">
    <label class="center-block"><span class="form-label">Dimension</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="dimensionOptions"
        formControlName="dimension">
          <option *ngFor="let options of dimensionOptions">{{options}}</option>
      </select>
    </label>
  </div>

  <div class="form-group">
  <label class="center-block"><span class="form-label">Fit Algorithem</span>
    <select class="browser-default" materialize="material_select"
      [materializeSelectOptions]="dimensionOptions"
      formControlName="fit_algorithm">
        <option *ngFor="let options of fitAlgorithemOptions">{{options}}</option>
    </select>
  </label>
</div>

<div class="form-group">
<label class="center-block"><span class="form-label">Transform Algorithem</span>
  <select class="browser-default" materialize="material_select"
    [materializeSelectOptions]="dimensionOptions"
    formControlName="transform_algorithm">
      <option *ngFor="let options of transformAlgorithemOptions">{{options}}</option>
  </select>
</label>
</div>
</form>
  `
})
export class DictionaryLearningFormComponent extends AbstractScatterForm {

  @Input() set config(v: DictionaryLearningConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  fitAlgorithemOptions = [
    DictionaryLearningFitAlgorithm.CD, DictionaryLearningFitAlgorithm.LARS
  ];

  transformAlgorithemOptions = [
    DictionaryLearningTransformAlgorithm.LASSO_LARS,
    DictionaryLearningTransformAlgorithm.LASSO_CD,
    DictionaryLearningTransformAlgorithm.LARS,
    DictionaryLearningTransformAlgorithm.OMP,
    DictionaryLearningTransformAlgorithm.THRESHOLD
  ];

  
  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      entity: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      components: [],
      dimension: [],
      alpha: [],
      max_iter: [],
      tol: [],
      fit_algorithm: [],
      transform_algorithm: [],
      split: []
    });

     // Update When Form Changes
     this.form.valueChanges
     .debounceTime(200)
     .distinctUntilChanged()
     .subscribe(data => {
       let dirty = 0;
       const form = this.form;
       if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
       if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
       if (form.get('pointSize').dirty)  { dirty |= DirtyEnum.SIZE; }
       if (dirty === 0 ) { dirty |= DirtyEnum.LAYOUT; }
       form.markAsPristine();
       data.dirtyFlag = dirty;
       this.configChange.emit(data);
     });
  }
}
