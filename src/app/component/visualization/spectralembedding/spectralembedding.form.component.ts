import {
  SpectralEmbeddingConfigModel, SpectralEmbeddingAffinity, SpectralEmbeddingDataModel,
  SpectralEmbeddingEigenSolver
} from './spectralembedding.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-spectralembedding-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <mat-form-field>
    <mat-select placeholder='Data' formControlName='table'>
      <mat-option *ngFor='let option of dataOptions' [value]='option.label'>
          {{ option.label }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Visualize' formControlName='entity'>
      <mat-option *ngFor='let option of displayOptions' [value]='option'>
          {{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='X Axis' formControlName='pcx'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Y Axis' formControlName='pcy'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field>
    <mat-select placeholder='Z Axis' formControlName='pcz'>
        <mat-option *ngFor='let option of PcOptions' [value]='option'>
            PC {{ option }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Eigen Solver</span>
        <select materialize='material_select'
        [materializeSelectOptions]='SpectralEmbeddingEigenSolverOpitions'
        formControlName='eigen_solver'>
        <option *ngFor='let options of SpectralEmbeddingEigenSolverOpitions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Affinity</span>
      <select materialize='material_select'
        [materializeSelectOptions]='SpectralEmbeddingAffinityOpitions'
        formControlName='affinity'>
        <option *ngFor='let options of SpectralEmbeddingAffinityOpitions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'>
      <span class='form-label'>Neighbors</span>
        <p class='range-field'>
          <input type='range' min='1' max='20' formControlName='n_neighbors' />
        </p>
    </label>
  </div>
</form>
  `
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
