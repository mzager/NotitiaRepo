import { SomConfigModel } from './som.model';
import { DimensionEnum, DistanceEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-som-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
<!--
  <div class='form-group'>
    <label class='center-block'>Point Data
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='dataOptions'
          formControlName='molecularTable'>
          <option *ngFor='let option of dataOptions'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Point Color</span>
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
    <label class='center-block'><span class='form-label'>Point Size</span>
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
    <label class='center-block'><span class='form-label'>Point Shape</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions' formControlName='pointShape'>
          <option *ngFor='let option of shapeOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
   <div class='form-group'>
    <label class='center-block'><span class='form-label'>Display Dimension</span>
      <select materialize='material_select'
        [materializeSelectOptions]='dimensionOptions'
        formControlName='dimension'>
          <option *ngFor='let options of dimensionOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>τ (tau)</span>
      <p class='range-field'>
        <input type='range' min='0.01' max='0.1' step='.01' formControlName='tau' />
      </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>Iterations</span>
      <p class='range-field'>
        <input type='range' min='1' max='10' step='1' formControlName='iterations' />
      </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>X Grid Cells</span>
      <p class='range-field'>
        <input type='range' min='1' max='10' step='1' formControlName='xCells' />
      </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>Y Grid Cells</span>
      <p class='range-field'>
        <input type='range' min='1' max='10' step='1' formControlName='yCells' />
      </p>
    </label>
  </div>
  -->
</form>
  `
})
export class SomFormComponent {

  @Input() set molecularData(tables: Array<string>) {
    this.dataOptions = tables.map(v => {
      const rv = { key: v, label: _.startCase(_.toLower(v)) };
      return rv;
    });
  }

  @Input() set clinicalFields(fields: Array<DataField>) {

    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getSampleColorFields(fields);
    this.shapeOptions = DataFieldFactory.getSampleShapeFields(fields);
    this.sizeOptions = DataFieldFactory.getSampleShapeFields(fields);
  }

  @Input() set config(v: SomConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dataOptions: Array<{ key: string, label: string }>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      dataKey: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      molecularTable: [],
      pointData: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      legend: [],
      dimension: [],
      tau: 0.02,
      iterations: 1,
      dist: DistanceEnum.EUCLIDEAN,
      xCells: 2,
      yCells: 1,
      weight: [],
      entity: EntityTypeEnum.SAMPLE
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }
}
