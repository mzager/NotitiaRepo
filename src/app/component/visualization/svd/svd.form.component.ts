import { SvdConfigModel } from './svd.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-svd-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'>Point Data
      <select class='browser-default' materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='dataOptions'
          formControlName='molecularTable'>
          <option *ngFor='let option of dataOptions'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Point Color</span>
      <select class='browser-default' materialize='material_select'
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
      <select class='browser-default' materialize='material_select'
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
      <select class='browser-default' materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions' formControlName='pointShape'>
          <option *ngFor='let option of shapeOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Display Dimension</span>
      <select class='browser-default' materialize='material_select'
        [materializeSelectOptions]='dimensionOptions'
        formControlName='dimension'>
          <option *ngFor='let options of dimensionOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Distance Measure</span>
      <select class='browser-default' materialize='material_select'
        [materializeSelectOptions]='distanceOptions'
        formControlName='distance'>
          <option *ngFor='let options of distanceOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Data Density</span>
      <select class='browser-default' materialize='material_select'
        [materializeSelectOptions]='densityOptions'
        formControlName='density'>
          <option *ngFor='let options of densityOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
    <span class='form-label'>Perplexity</span>
    <p class='range-field'>
      <input type='range' min='5' max='50' />
    </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
    <span class='form-label'>Early Exaggeration</span>
    <p class='range-field'>
      <input type='range' min='1' max='10' step='.1' />
    </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
    <span class='form-label'>Learning Rate</span>
    <p class='range-field'>
      <input type='range' min='1' max='1000' />
    </p>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
    <span class='form-label'>Max Iterations</span>
    <p class='range-field'>
      <input type='range' min='50' max='500' />
    </p>
    </label>
  </div>

</form>
  `
})
export class SvdFormComponent {

  @Input() set molecularData(tables: Array<string>) {
    this.dataOptions = tables.map(v => {
      const rv = { key: v, label: _.startCase(_.toLower(v)) };
      return rv;
    });
  }

  @Input() set clinicalFields(fields: Array<DataField>) {

    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getColorFields(fields);
    this.shapeOptions = DataFieldFactory.getShapeFields(fields);
    this.sizeOptions = DataFieldFactory.getShapeFields(fields);
  }

  @Input() set config(v: SvdConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dataOptions: Array<{ key: string, label: string }>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];
  distanceOptions = [ DistanceEnum.EUCLIDEAN, DistanceEnum.MANHATTAN, DistanceEnum.JACCARD, DistanceEnum.DICE];
  densityOptions = [ DenseSparseEnum.DENSE, DenseSparseEnum.SPARSE ];

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
      molecularTable: [],
      pointData: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      dimension: [],
      domain: 5,
      perpexity: 10, // *>1
      learningRate: 500, // 100-1000
      nIter: 200, // Maximum Number of itterations >200
      density: DenseSparseEnum.DENSE
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
