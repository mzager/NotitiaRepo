import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaKernalConfigModel, PcaKernalMethods, PcaKernalEigenSolver } from './pcakernal.model';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcakernal-form',
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
  <mat-form-field class='form-field'>
    <mat-select placeholder='Visualize' formControlName='entity'>
      <mat-option *ngFor='let option of displayOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='X Axis' formControlName='pcx'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Y Axis' formControlName='pcy'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Z Axis' formControlName='pcz'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Kernal' formControlName='kernel'>
        <mat-option *ngFor='let option of kernalOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Eigen Solver' formControlName='eigen_solver'>
        <mat-option *ngFor='let option of eigenSolverOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <div class='form-group'>
    <div class='switch'>
      <label class='center-block'><span class='form-label'>Fit Inverse</span>
        <input type='checkbox' formControlName='fit_inverse_transform'>
        <span class='lever'></span>
      </label>
    </div>
    <div class='switch'>
      <label class='center-block'><span class='form-label'>Remove 0 Eig</span>
        <input type='checkbox' formControlName='remove_zero_eig'>
        <span class='lever'></span>
      </label>
    </div>
  </div>
</form>`
})
export class PcaKernalFormComponent extends AbstractScatterForm {

  @Input() set config(v: PcaKernalConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  eigenSolverOptions = [
    PcaKernalEigenSolver.AUTO,
    PcaKernalEigenSolver.ARPACK,
    PcaKernalEigenSolver.DENSE
  ];

  kernalOptions = [
    PcaKernalMethods.LINEAR,
    PcaKernalMethods.POLY,
    PcaKernalMethods.RBF,
    PcaKernalMethods.SIGMOID,
    PcaKernalMethods.COSINE
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
      kernel: [],
      degree: [],
      coef0: [],
      alpha: [],
      fit_inverse_transform: [],
      eigen_solver: [],
      tol: [],
      remove_zero_eig: []
    });

    this.registerFormChange();
  }
}
