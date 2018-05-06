import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaKernalConfigModel, PcaKernalMethods, PcaKernalEigenSolver } from './pcakernal.model';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

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
      remove_zero_eig: []
    });

    this.registerFormChange();
  }
}
