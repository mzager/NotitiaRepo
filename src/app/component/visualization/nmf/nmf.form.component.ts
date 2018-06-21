import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { NmfBetaLoss, NmfConfigModel, NmfInit, NmfSolver } from './nmf.model';

@Component({
  selector: 'app-nmf-form',
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
  <mat-form-field class='form-field-1-3'>
    <mat-select placeholder='X Axis' formControlName='pcx'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field-1-3'>
    <mat-select placeholder='Y Axis' formControlName='pcy'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field-1-3'>
    <mat-select placeholder='Z Axis' formControlName='pcz'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Initialization' formControlName='init'>
      <mat-option *ngFor='let option of NmfInitOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Solver' formControlName='solver'>
      <mat-option *ngFor='let option of NmFSolverOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
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
