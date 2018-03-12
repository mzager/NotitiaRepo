import { FastIcaConfigModel, FastIcaAlgorithm, FastIcaFunction } from './fastica.model';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum  } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';


@Component({
  selector: 'app-fastica-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
<div class='form-group'>
<label class='center-block'><span class='form-label'>Data</span>
  <select materialize='material_select'
      [compareWith]='byKey'
      formControlName='table'>
      <option *ngFor='let option of dataOptions'>{{option.label}}</option>
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
    <label class='center-block'><span class='form-label'>Algorithm</span>
      <select materialize='material_select'
        [materializeSelectOptions]='algorithmOptions'
        formControlName='algorithm'>
          <option *ngFor='let options of algorithmOptions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Function</span>
      <select materialize='material_select'
      [materializeSelectOptions]='functionOptions'
      formControlName='fun'>
        <option *ngFor='let options of functionOptions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='whiten'>
        <span class='lever'></span>
      Whiten
      </label>
    </div>
</div>
</form>
  `
})
export class FastIcaFormComponent extends AbstractScatterForm {

  @Input() set config(v: FastIcaConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  algorithmOptions = [
    FastIcaAlgorithm.PARALLEL,
    FastIcaAlgorithm.DEFLATION
  ];

  functionOptions = [
    FastIcaFunction.LOGCOSH,
    FastIcaFunction.CUBE,
    FastIcaFunction.EXP
  ];

  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      dataOption: [],

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      algorithm: [],
      fun: [],
      whiten: [],
      tol: []
    });

    this.registerFormChange();
  }
}
