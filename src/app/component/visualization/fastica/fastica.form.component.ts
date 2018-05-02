import { FastIcaConfigModel, FastIcaAlgorithm, FastIcaFunction } from './fastica.model';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
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
  <mat-form-field>
    <mat-select placeholder='Data' formControlName='table'>
        <mat-option *ngFor='let option of dataOptions' [value]='option.label'>
            {{ option.label }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Visualize' formControlName='entity'>
        <mat-option *ngFor='let option of displayOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='X Axis' formControlName='pcx'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Y Axis' formControlName='pcy'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Z Axis' formControlName='pcz'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Algorithm' formControlName='algorithm'>
      <mat-option *ngFor='let option of algorithmOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Function' formControlName='fun'>
      <mat-option *ngFor='let option of functionOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
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
