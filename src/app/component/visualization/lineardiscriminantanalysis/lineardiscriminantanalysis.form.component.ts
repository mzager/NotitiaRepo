import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
// tslint:disable-next-line:max-line-length
import { LinearDiscriminantAnalysisConfigModel, LinearDiscriminantAnalysisSolver, LinearDiscriminantAnalysisShrinkage } from './lineardiscriminantanalysis.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { SvmCompleteAction } from '../../../action/compute.action';

@Component({
  selector: 'app-lineardiscriminantanalysis-form',
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
    <mat-select placeholder='Solver' formControlName='LinearDiscriminantAnalysisSolver'>
      <mat-option *ngFor='let option of LinearDiscriminantAnalysisSolverOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Shrinkage' formControlName='LinearDiscriminantAnalysisShrinkage'>
      <mat-option *ngFor='let option of LinearDiscriminantAnalysisShrinkageOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
</form>
  `
})
export class LinearDiscriminantAnalysisFormComponent extends AbstractScatterForm {

  @Input() set config(v: LinearDiscriminantAnalysisConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  LinearDiscriminantAnalysisSolverOptions = [
    LinearDiscriminantAnalysisSolver.SVD,
    LinearDiscriminantAnalysisSolver.LSQR,
    LinearDiscriminantAnalysisSolver.EIGEN,

  ];

  LinearDiscriminantAnalysisShrinkageOptions = [
    LinearDiscriminantAnalysisShrinkage.NONE,
    LinearDiscriminantAnalysisShrinkage.AUTO,
    LinearDiscriminantAnalysisShrinkage.FLOAT,

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
      solver: [],
      shrinkage: [],
      // priors =
      store_covariance: [],
      tol: []
    });

    this.registerFormChange();
  }
}
