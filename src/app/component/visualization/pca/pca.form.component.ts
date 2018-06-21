import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaConfigModel, PcaSvdSolver } from './pca.model';

@Component({
  selector: 'app-pca-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'pca.form.component.html'
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
