import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
import { PcaConfigModel, PcaSvdSolver } from './pca.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pca-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Data</span>
      <select materialize='material_select'
        [compareWith]='byKey'
        formControlName='table'>
        <option *ngFor='let option of dataOptions'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Display</span>
      <select materialize='material_select'
          formControlName='entity'>
          <option *ngFor='let option of displayOptions'>{{option}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Color</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions'
          formControlName='pointColor'>
          <option *ngFor='let option of colorOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Size</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='sizeOptions'
          formControlName='pointSize'>
          <option *ngFor='let option of sizeOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Shape</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions' formControlName='pointShape'>
          <option *ngFor='let option of shapeOptions'
            [ngValue]='option'>{{option.label}}</option>
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
    <label class='center-block'><span class='form-label'>Svd Solver</span>
      <select materialize='material_select'
        [materializeSelectOptions]='PcaSvdSolverOptions'
        formControlName='svd_solver'>
        <option *ngFor='let options of PcaSvdSolverOptions' [ngValue]='options'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='whiten'>
          <span class='lever'></span>
            Whiten
      </label>
    </div>
  </div>
</form>
  `
})
// if svd_solver = arpack then tol
export class PcaFormComponent extends AbstractScatterForm {

  PcaSvdSolverOptions = [
    PcaSvdSolver.AUTO,
    PcaSvdSolver.ARPACK,
    PcaSvdSolver.RANDOMIZED,
    PcaSvdSolver.FULL
  ];

  PcOptions = [1,2,3,4,5,6,7,8,9,10];

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
          table: [],
          pointColor: [],
          pointShape: [],
          pointSize: [],

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
