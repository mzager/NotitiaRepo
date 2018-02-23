import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaIncrementalConfigModel } from './pcaincremental.model';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcaincremental-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label><span class='form-label'>Table</span>
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
    <label class='center-block'><span class='form-label'>Color</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions'
          formControlName='pointColor'>
          <option *ngFor='let option of colorOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Size</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='sizeOptions'
          formControlName='pointSize'>
          <option *ngFor='let option of sizeOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Shape</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions' formControlName='pointShape'>
          <option *ngFor='let option of shapeOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
   <div class='form-group'>
    <label class='center-block'><span class='form-label'>Dimension</span>
      <select materialize='material_select'
        [materializeSelectOptions]='dimensionOptions'
        formControlName='dimension'>
          <option *ngFor='let options of dimensionOptions'>{{options}}</option>
      </select>
    </label>
  </div>
   <div class='form-group'>
    <div class='switch'>
      <label><span class='form-label'>Whiten</span>
        <input type='checkbox' formControlName='whiten'>
        <span class='lever'></span>
      </label>
    </div>
  </div>
</form>
`
})
export class PcaIncrementalFormComponent extends AbstractScatterForm {

  @Input() set config(v: PcaIncrementalConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
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
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      legend: [],

      n_components: [],
      dimension: [],
      whiten: [],
      batch_size: [],
      copy: []
    } );

    this.registerFormChange();
  }
}
