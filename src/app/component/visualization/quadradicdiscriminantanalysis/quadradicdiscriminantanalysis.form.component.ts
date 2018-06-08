import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { QuadradicDiscriminantAnalysisConfigModel } from './quadradicdiscriminantanalysis.model';

@Component({
  selector: 'app-quadradicdiscriminantanalysis-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <!--
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
  -->
</form>
  `
})
export class QuadradicDiscriminantAnalysisFormComponent extends AbstractScatterForm {

  @Input() set config(v: QuadradicDiscriminantAnalysisConfigModel) {
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
      // priors
      // reg_param
      store_covariance: [],
      tol: [],

      enableCohorts: [],
      enableGenesets: [],
      enablePathways: [],
      enableSupplemental: [],
      enableLabel: [],
      enableColor: [],
      enableShape: []
    });
    this.registerFormChange();
  }
}
