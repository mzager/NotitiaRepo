import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
import { PcaConfigModel, PcaSvdSolver } from './pca.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

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
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
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
