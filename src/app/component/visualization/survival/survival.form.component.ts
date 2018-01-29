import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-survival-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'>Data
      <select class='browser-default' materialize='material_select'
          [materializeSelectOptions]='dataOptions'
          formControlName='molecularTable'>
          <option *ngFor='let option of dataOptions' [value]='option'>{{option}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Point Color</span>
      <select class='browser-default' materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions'
          formControlName='pointColor'>
          <option *ngFor='let option of colorOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Point Size</span>
       <select class='browser-default' materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='sizeOptions'
          formControlName='pointSize'>
          <option *ngFor='let option of sizeOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='showCytobands'>
        <span class='lever'></span>
        Cytobands
      </label>
    </div>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='showCytobands'>
        <span class='lever'></span>
        Rotation
      </label>
    </div>
  </div>
</form>
  `
})
export class SurvivalFormComponent {

  @Input() set molecularData(tables: Array<string>){
    this.dataOptions = tables;
    

     // Init Form
     this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      dataKey: [],
      markerList: [],
      sampleList: [],
      molecularTable: this.dataOptions[0],
      pointColor: this.colorOptions[0],
      pointSize: this.sizeOptions[0],
      dimension: [],
      showCytobands: [],
      allowRotation: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }

  @Input() set config(v: ChromosomeConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, {emitEvent : false});
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dataOptions: Array<string>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

  }
}
