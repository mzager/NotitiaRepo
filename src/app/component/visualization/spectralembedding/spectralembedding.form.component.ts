import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { SpectralEmbeddingAffinity, SpectralEmbeddingConfigModel, SpectralEmbeddingEigenSolver } from './spectralembedding.model';

@Component({
  selector: 'app-spectralembedding-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spectralembedding.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SpectralEmbeddingFormComponent extends AbstractScatterForm {


  @Input() set config(v: SpectralEmbeddingConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  SpectralEmbeddingEigenSolverOpitions = [
    SpectralEmbeddingEigenSolver.NONE
    // SpectralEmbeddingEigenSolver.AMG,
    // SpectralEmbeddingEigenSolver.ARPACK,
    // SpectralEmbeddingEigenSolver.LOBPCG
  ];

  SpectralEmbeddingAffinityOpitions = [
    SpectralEmbeddingAffinity.NEAREST_NEIGHBORS
    // SpectralEmbeddingAffinity.PRECOMPUTED,
    // SpectralEmbeddingAffinity.RBF,
    // SpectralEmbeddingAffinity.CALLABLE
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
      eigen_solver: [],
      n_neighbors: [],
      gamma: [],
      affinity: []
    });

    this.registerFormChange();
  }
}
