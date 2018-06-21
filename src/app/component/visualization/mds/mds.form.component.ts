import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { MdsConfigModel, MdsDissimilarity } from './mds.model';

@Component({
  selector: 'app-mds-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Data' formControlName='table' [compareWith]='byTbl'>
      <mat-option *ngFor='let option of dataOptions' [value]='option'>
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
  <!--
  <mat-form-field class='form-field'>
    <mat-select placeholder='Dissimilarity' formControlName='dissimilarity'>
        <mat-option *ngFor='let option of MdsDissimilarityOpitions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <div class="form-group">
    <div class="switch">
      <label>
        <input type="checkbox" formControlName="metric">
        <span class="lever"></span>
        Metric
      </label>
    </div>
  </div>
  -->
</form>
  `
})
export class MdsFormComponent extends AbstractScatterForm {

  @Input() set config(v: MdsConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  MdsDissimilarityOpitions = [
    MdsDissimilarity.ECULIDEAN,
    MdsDissimilarity.PRECOMPUTED
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
      metric: [],
      eps: [],
      dimension: [],
      dissimilarity: []
    });

    this.registerFormChange();
  }
}
