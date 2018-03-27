import { BoxWhiskersConfigModel } from './../boxwhiskers/boxwhiskers.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-boxwhiskers-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
<div class='form-group'>
  <label class='center-block'><span class='form-label'>Continuous Variable</span>
    <select materialize='material_select'
        [compareWith]='byKey'
        [materializeSelectOptions]='continuousOptions' formControlName='continuousVariable'>
        <option *ngFor='let option of continuousOptions'
          [ngValue]='option'>{{option.label}}</option>
    </select>
  </label>
</div>
<div class='form-group'>
<label class='center-block'><span class='form-label'>Sort</span>
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
  <div class='switch'>
    <label>
      <input type='checkbox' formControlName='scatter'>
        <span class='lever'></span>
          Scatter
    </label>
  </div>
</div>
<div class='form-group'>
  <div class='switch'>
    <label>
      <input type='checkbox' formControlName='outliers'>
        <span class='lever'></span>
          Outliers
    </label>
  </div>
</div>
<div class='form-group'>
  <div class='switch'>
    <label>
      <input type='checkbox' formControlName='average'>
        <span class='lever'></span>
          Average
    </label>
  </div>
</div>
<div class='form-group'>
  <div class='switch'>
    <label>
      <input type='checkbox' formControlName='standardDeviation'>
        <span class='lever'></span>
          Standard Deviation
    </label>
  </div>
</div>
</form>
  `
})
export class BoxWhiskersFormComponent {

  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set fields(fields: Array<DataField>) {
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.continuousOptions = DataFieldFactory.getContinuousFields(fields);
    this.categoricalOptions = DataFieldFactory.getCategoricalFields(fields);
    this.continuousOptions.unshift(defaultDataField);
    this.categoricalOptions.unshift(defaultDataField);
    this.colorOptions = DataFieldFactory.getSampleColorFields(fields);
  }

  @Input() set config(v: BoxWhiskersConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  continuousOptions: Array<DataField>;
  categoricalOptions: Array<DataField>;
  colorOptions: Array<DataField>;
  dataOptions: Array<DataTable>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    // Init Form
    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],     // *
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      continuousVariable: [],
      categoricalVariable1: [],
      categoricalVariable2: [],
      pointColor: [],
      sort: [],
      scatter: [],
      outliers: [],
      average: [],
      standardDeviation: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });
  }

}
