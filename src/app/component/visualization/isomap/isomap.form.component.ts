import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { IsoMapConfigModel, IsoMapEigenSolver, IsoMapNeighborsAlgorithm, IsoMapPathMethod } from './isomap.model';

@Component({
  selector: 'app-isomap-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './isomap.form.component.html'
})
export class IsoMapFormComponent extends AbstractScatterForm {

  @Input() set config(v: IsoMapConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  IsoMapEigenSolverOpitions = [
    IsoMapEigenSolver.AUTO,
    IsoMapEigenSolver.DENSE,
    IsoMapEigenSolver.ARPACK,
  ];

  IsoMapPathMethodOpitions = [
    IsoMapPathMethod.AUTO
    // IsoMapPathMethod.D,
    // IsoMapPathMethod.FW
  ];

  IsoMapNeighborsAlgorithmOpitions = [
    IsoMapNeighborsAlgorithm.AUTO
    // IsoMapNeighborsAlgorithm.BALL_TREE,
    // IsoMapNeighborsAlgorithm.KD_TREE,
    // IsoMapNeighborsAlgorithm.BRUTE
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
      tol: [],
      n_neighbors: [],
      eigen_solver: [],
      path_method: [],
      neighbors_algorithm: []
    });

    this.registerFormChange();
  }
}
