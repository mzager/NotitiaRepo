import { IsoMapConfigModel, IsoMapPathMethod, IsoMapEigenSolver, IsoMapNeighborsAlgorithm } from './isomap.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

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
    IsoMapPathMethod.AUTO,
    IsoMapPathMethod.D,
    IsoMapPathMethod.FW
  ];

  IsoMapNeighborsAlgorithmOpitions = [
    IsoMapNeighborsAlgorithm.AUTO,
    IsoMapNeighborsAlgorithm.BALL_TREE,
    IsoMapNeighborsAlgorithm.KD_TREE,
    IsoMapNeighborsAlgorithm.BRUTE
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
      tol: [],
      n_neighbors: [],
      eigen_solver: [],
      path_method: [],
      neighbors_algorithm: []
    });

    this.registerFormChange();
  }
}
