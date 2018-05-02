import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
import { MiniBatchSparsePcaConfigModel, MiniBatchSparsePcaMethod } from './minibatchsparsepca.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { SvmCompleteAction } from '../../../action/compute.action';

@Component({
  selector: 'app-minibatchsparsepca-form',
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
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Method</span>
     <select materialize='material_select'
      [materializeSelectOptions]='MiniBatchSparsePcaMethodOpitions'
      formControlName='sk_method'>
        <option *ngFor='let options of MiniBatchSparsePcaMethodOpitions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
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
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='shuffle'>
        <span class='lever'></span>
        Shuffle
      </label>
    </div>
  </div>
</form>
  `
})
export class MiniBatchSparsePcaFormComponent extends AbstractScatterForm {

  @Input() set config(v: MiniBatchSparsePcaConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  MiniBatchSparsePcaMethodOpitions = [
    MiniBatchSparsePcaMethod.LARS,
    MiniBatchSparsePcaMethod.CD
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
      alpha: [],
      ridge_alpha: [],
      n_iter: [],
      batch_size: [],
      shuffle: [],
      sk_method: []
    });

    this.registerFormChange();
  }
}
