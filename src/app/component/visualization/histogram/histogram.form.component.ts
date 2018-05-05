import { HistogramConfigModel } from './histogram.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-histogram-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Data' formControlName='table'>
      <mat-option *ngFor='let option of dataOptions' [value]='option.label'>
          {{ option.label }}
      </mat-option>
    </mat-select>
  </mat-form-field>
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
export class HistogramFormComponent {

  @Input() set molecularData(tables: Array<string>) {
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
      dimension: [],

    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }

  @Input() set config(v: HistogramConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  dataOptions: Array<string>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

  }
}
