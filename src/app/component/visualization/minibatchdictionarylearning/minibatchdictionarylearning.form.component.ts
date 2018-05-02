import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
// tslint:disable-next-line:max-line-length
import { MiniBatchDictionaryLearningConfigModel, MiniBatchDictionaryLearningFit, MiniBatchDictionaryTransform } from './minibatchdictionarylearning.model';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { SvmCompleteAction } from '../../../action/compute.action';


@Component({
  selector: 'app-minibatchdictionarylearning-form',
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
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Fit Algorithm</span>
     <select materialize='material_select'
      [materializeSelectOptions]='miniBatchDictionaryLearningFitOptions'
      formControlName='fit_algorithm'>
        <option *ngFor='let options of miniBatchDictionaryLearningFitOptions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>Transform Algorithm</span>
   <select materialize='material_select'
    [materializeSelectOptions]='miniBatchDictionaryTransformOptions'
    formControlName='transform_algorithm'>
      <option *ngFor='let options of miniBatchDictionaryTransformOptions' [ngValue]='options'>{{options}}</option>
    </select>
  </label>
</div>
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
export class MiniBatchDictionaryLearningFormComponent extends AbstractScatterForm {

  @Input() set config(v: MiniBatchDictionaryLearningConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  miniBatchDictionaryLearningFitOptions = [
    MiniBatchDictionaryLearningFit.LARS,
    MiniBatchDictionaryLearningFit.CD
  ];

  miniBatchDictionaryTransformOptions = [
    MiniBatchDictionaryTransform.OMP,
    MiniBatchDictionaryTransform.LASSO_LARS,
    MiniBatchDictionaryTransform.LASSO_CD,
    MiniBatchDictionaryTransform.LARS,
    MiniBatchDictionaryTransform.THRESHOLD
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
      alpha: [],
      n_iter: [],
      fit_algorithm: [],
      batch_size: [],
      shuffle: [],
      transform_algorithm: [],
      split_sign: []
    });

    this.registerFormChange();
  }
}
