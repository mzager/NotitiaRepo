import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
// tslint:disable-next-line:max-line-length
import { LinearDiscriminantAnalysisConfigModel, LinearDiscriminantAnalysisShrinkage, LinearDiscriminantAnalysisSolver } from './lineardiscriminantanalysis.model';

@Component({
  selector: 'app-lineardiscriminantanalysis-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lineardiscriminantanalysis.form.component.html'
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
