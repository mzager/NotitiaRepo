import {
  SpectralEmbeddingConfigModel, SpectralEmbeddingAffinity, SpectralEmbeddingDataModel,
  SpectralEmbeddingEigenSolver
} from './spectralembedding.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

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
    SpectralEmbeddingEigenSolver.NONE,
    SpectralEmbeddingEigenSolver.AMG,
    SpectralEmbeddingEigenSolver.ARPACK,
    SpectralEmbeddingEigenSolver.LOBPCG
  ];

  SpectralEmbeddingAffinityOpitions = [
    SpectralEmbeddingAffinity.NEAREST_NEIGHBORS,
    SpectralEmbeddingAffinity.PRECOMPUTED,
    SpectralEmbeddingAffinity.RBF,
    SpectralEmbeddingAffinity.CALLABLE
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
      eigen_solver: [],
      n_neighbors: [],
      gamma: [],
      affinity: []
    });

    this.registerFormChange();
  }
}
