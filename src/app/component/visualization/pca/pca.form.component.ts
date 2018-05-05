import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
import { PcaConfigModel, PcaSvdSolver } from './pca.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pca-form',
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
    <mat-select placeholder='Svd Solver' formControlName='svd_solver'>
        <mat-option *ngFor='let option of PcaSvdSolverOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <div class='form-group'>
    <div class='switch'>
    <label class='center-block'><span class='form-label'>Whiten</span>
        <input type='checkbox' formControlName='whiten'>
            <span class='lever'></span>
      </label>
    </div>
  </div>
</form>
  `
})
// if svd_solver = arpack then tol
export class PcaFormComponent extends AbstractScatterForm {

  PcaSvdSolverOptions = [
    PcaSvdSolver.AUTO,
    PcaSvdSolver.ARPACK,
    PcaSvdSolver.RANDOMIZED,
    PcaSvdSolver.FULL
  ];

  @Input() set config(v: PcaConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

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

      n_components: [],
      dimension: [],
      svd_solver: [],
      tol: [],
      whiten: [],
      copy: [],
      iterated_power: [],
      random_state: [],
      pcx: [],
      pcy: [],
      pcz: []
    });

    this.registerFormChange();
  }
}
