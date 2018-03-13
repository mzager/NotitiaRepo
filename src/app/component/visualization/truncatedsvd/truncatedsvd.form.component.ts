import { TruncatedSvdConfigModel, TruncatedSvdAlgorithem } from './truncatedsvd.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { TruncatedSvdAction } from '../../../action/compute.action';

@Component({
  selector: 'app-truncatedsvd-form',
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
  <label class='center-block'><span class='form-label'>SVD Solver</span>
    <select materialize='material_select'
      [materializeSelectOptions]='TruncatedSvdAlgorithemOptions'
      formControlName='algorithm'>
        <option *ngFor='let options of TruncatedSvdAlgorithemOptions' [ngValue]='options'>{{options}}</option>
    </select>
  </label>
</div>
</form>
  `
})
export class TruncatedSvdFormComponent extends AbstractScatterForm {


  @Input() set config(v: TruncatedSvdConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  TruncatedSvdAlgorithemOptions = [
    TruncatedSvdAlgorithem.RANDOMIZED,
    TruncatedSvdAlgorithem.ARPACK
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
      algorithm: [],
      tol: [],
      n_iter: []
    });

    this.registerFormChange();
  }
}
