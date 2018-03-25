import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaSparseConfigModel, PcaSparseSkMethod } from './pcasparse.model';
import { DimensionEnum, EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcasparse-form',
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
    <label class='center-block'><span class='form-label'>Visualize</span>
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
    <label class='center-block'><span class='form-label'>Method</span>
      <select materialize='material_select'
        [materializeSelectOptions]='PcaSparseSkMethodOptions'
        [compareWith]='byKey'
        formControlName='sk_method'>
          <option *ngFor='let options of PcaSparseSkMethodOptions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
</form>
  `
})
export class PcaSparseFormComponent extends AbstractScatterForm {

  @Input() set config(v: PcaSparseConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  PcaSparseSkMethodOptions = [
    PcaSparseSkMethod.CD,
    PcaSparseSkMethod.LARS];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

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
      sk_method: [],
      dimension: [],
      alpha: [],
      ridge_alpha: [],
      max_iter: [],
      tol: [],
      method: []
    });

    this.registerFormChange();
  }
}
