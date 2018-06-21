import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
// tslint:disable-next-line:max-line-length
import { MiniBatchDictionaryLearningConfigModel, MiniBatchDictionaryLearningFit, MiniBatchDictionaryTransform } from './minibatchdictionarylearning.model';


@Component({
  selector: 'app-minibatchdictionarylearning-form',
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
    <mat-select placeholder='Fit Algorithm' formControlName='fit_algorithm'>
        <mat-option *ngFor='let option of miniBatchDictionaryLearningFitOptions' [value]='option'>
            {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Transform Algorithm' formControlName='transform_algorithm'>
        <mat-option *ngFor='let option of miniBatchDictionaryTransformOptions' [value]='option'>
            {{ option }}
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
