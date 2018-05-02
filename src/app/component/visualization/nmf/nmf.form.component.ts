import { NmfConfigModel, NmfInit, NmfSolver, NmfBetaLoss } from './nmf.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-nmf-form',
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
    <mat-select placeholder='Initialization' formControlName='init'>
      <mat-option *ngFor='let option of NmfInitOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Solver' formControlName='solver'>
      <mat-option *ngFor='let option of NmFSolverOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Betaloss' formControlName='beta_loss'>
      <mat-option *ngFor='let option of NmfBetalossOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
</form>
  `
})
export class NmfFormComponent extends AbstractScatterForm {

  @Input() set config(v: NmfConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  NmfInitOptions = [
    NmfInit.NNDSVD,
    NmfInit.RANDOM,
    NmfInit.NNDSVDA,
    NmfInit.NNDSVDAR
  ];

  NmFSolverOptions = [
    NmfSolver.CD,
    NmfSolver.MU
  ];

  NmfBetalossOptions = [
    NmfBetaLoss.FROBENIUS,
    NmfBetaLoss.ITAKURA_SAITO,
    NmfBetaLoss.KULLBACK_LEIBLER
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
      init: [],
      solver: [],
      beta_loss: [],
      tol: []
    });

    this.registerFormChange();
  }
}
