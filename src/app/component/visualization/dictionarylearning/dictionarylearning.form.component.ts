import {
  DictionaryLearningConfigModel, DictionaryLearningFitAlgorithm,
  DictionaryLearningTransformAlgorithm
} from './dictionarylearning.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-dictionarylearning-form',
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
    <mat-select placeholder='Fit Algo' formControlName='fit_algorithm'>
        <mat-option *ngFor='let option of fitAlgorithemOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Transform Algo' formControlName='fit_algorithm'>
        <mat-option *ngFor='let option of transformAlgorithemOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
</form>
  `
})
export class DictionaryLearningFormComponent extends AbstractScatterForm {

  @Input() set config(v: DictionaryLearningConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  fitAlgorithemOptions = [
    DictionaryLearningFitAlgorithm.CD, DictionaryLearningFitAlgorithm.LARS
  ];

  transformAlgorithemOptions = [
    DictionaryLearningTransformAlgorithm.LASSO_LARS,
    DictionaryLearningTransformAlgorithm.LASSO_CD,
    DictionaryLearningTransformAlgorithm.LARS,
    DictionaryLearningTransformAlgorithm.OMP,
    DictionaryLearningTransformAlgorithm.THRESHOLD
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
      max_iter: [],
      tol: [],
      fit_algorithm: [],
      transform_algorithm: [],
      split_sign: []
    });

    this.registerFormChange();
  }
}
