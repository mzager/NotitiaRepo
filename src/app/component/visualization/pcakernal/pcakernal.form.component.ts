import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaKernalConfigModel, PcaKernalEigenSolver, PcaKernalMethods } from './pcakernal.model';

@Component({
  selector: 'app-pcakernal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pcakernal.form.component.html'
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
      remove_zero_eig: [],

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
