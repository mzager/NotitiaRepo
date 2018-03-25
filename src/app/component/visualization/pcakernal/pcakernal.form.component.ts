import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaKernalConfigModel, PcaKernalMethods, PcaKernalEigenSolver } from './pcakernal.model';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcakernal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Data</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          formControlName='table'>
          <option *ngFor='let option of dataOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Visualize</span>
      <select materialize='material_select'
          formControlName='entity'>
          <option *ngFor='let option of displayOptions'>{{option}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>X Axis</span>
    <select materialize='material_select'
        [materializeSelectOptions]='PcOptions'
        formControlName='pcx'>
        <option *ngFor='let option of PcOptions' [ngValue]='option'>PC {{option}}</option>
    </select>
  </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>Y Axis</span>
    <select materialize='material_select'
        [materializeSelectOptions]='PcOptions'
        formControlName='pcy'>
        <option *ngFor='let option of PcOptions' [ngValue]='option'>PC {{option}}</option>
    </select>
  </label>
  </div>
  <div class='form-group'>
  <label class='center-block'><span class='form-label'>Z Axis</span>
    <select materialize='material_select'
        [materializeSelectOptions]='PcOptions'
        formControlName='pcz'>
        <option *ngFor='let option of PcOptions' [ngValue]='option'>PC {{option}}</option>
    </select>
  </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Kernal</span>
      <select materialize='material_select'
        [materializeSelectOptions]='dimensionOptions'
        formControlName='kernel'>
          <option *ngFor='let options of kernalOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Eigen Solver</span>
      <select materialize='material_select'
        [materializeSelectOptions]='dimensionOptions'
        formControlName='eigen_solver'>
          <option *ngFor='let options of eigenSolverOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label class='center-block'><span class='form-label'>Fit Inverse</span>
        <input type='checkbox' formControlName='fit_inverse_transform'>
        <span class='lever'></span>
      </label>
    </div>
    <div class='switch'>
      <label class='center-block'><span class='form-label'>Remove 0 Eig</span>
        <input type='checkbox' formControlName='remove_zero_eig'>
        <span class='lever'></span>
      </label>
    </div>
  </div>
</form>`
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
