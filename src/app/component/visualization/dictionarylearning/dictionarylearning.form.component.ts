import {
  DictionaryLearningConfigModel, DictionaryLearningFitAlgorithm,
  DictionaryLearningTransformAlgorithm
} from './dictionarylearning.model';
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
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Data</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          formControlName='table'>
          <option *ngFor='let option of dataOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Display</span>
      <select materialize='material_select'
          formControlName='entity'>
          <option *ngFor='let option of displayOptions'>{{option}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>X Axis</span>
    <select materialize='material_select'
        [materializeSelectOptions]='PcOptions'
        formControlName='pcx'>
        <option *ngFor='let option of PcOptions' [ngValue]='option'>PC {{option}}</option>
    </select>
  </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>Y Axis</span>
    <select materialize='material_select'
        [materializeSelectOptions]='PcOptions'
        formControlName='pcy'>
        <option *ngFor='let option of PcOptions' [ngValue]='option'>PC {{option}}</option>
    </select>
  </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>Z Axis</span>
    <select materialize='material_select'
        [materializeSelectOptions]='PcOptions'
        formControlName='pcz'>
        <option *ngFor='let option of PcOptions' [ngValue]='option'>PC {{option}}</option>
    </select>
  </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>Fit Algo</span>
    <select materialize='material_select'
      [materializeSelectOptions]='dimensionOptions'
      formControlName='fit_algorithm'>
        <option *ngFor='let options of fitAlgorithemOptions' [ngValue]='options'>{{options}}</option>
    </select>
  </label>
</div>
<div class='form-group'>
  <label class='center-block'><span class='form-label'>Transform Algo</span>
    <select materialize='material_select'
      [materializeSelectOptions]='dimensionOptions'
      formControlName='transform_algorithm'>
      <option *ngFor='let options of transformAlgorithemOptions' [ngValue]='options'>{{options}}</option>
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
      database: [],
      entity: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      table: [],

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      alpha: [],
      max_iter: [],
      tol: [],
      fit_algorithm: [],
      transform_algorithm: [],
      split_sign: []
    });

    this.registerFormChange();
  }
}
