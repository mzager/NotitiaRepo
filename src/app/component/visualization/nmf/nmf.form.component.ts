import { NmfConfigModel, NmfInit, NmfSolver, NmfBetaLoss } from './nmf.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-nmf-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block">Data
      <select class="browser-default" materialize="material_select"
      [compareWith]="byKey"
      formControlName="table">
      <option *ngFor="let option of dataOptions">{{option.label}}</option>
    </select>
  </label>
</div>
  <div class="form-group">
    <label class="center-block">Display
      <select class="browser-default" materialize="material_select"
          formControlName="entity">
          <option *ngFor="let option of displayOptions">{{option}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Color</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions"
          formControlName="pointColor">
          <option *ngFor="let option of colorOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Size</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="sizeOptions"
          formControlName="pointSize">
          <option *ngFor="let option of sizeOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Shape</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions" formControlName="pointShape">
          <option *ngFor="let option of shapeOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Dimension</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="dimensionOptions"
        formControlName="dimension">
          <option *ngFor="let options of dimensionOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Initialization</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="initOptions"
        formControlName="init">
        <option *ngFor="let options of initOptions">{{options}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
  <label class="center-block"><span class="form-label">Solver</span>
    <select class="browser-default" materialize="material_select"
      [materializeSelectOptions]="solverOptions"
      formControlName="solver">
      <option *ngFor="let options of solverOptions">{{options}}</option>
    </select>
  </label>
</div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Betaloss</span>
      <select class="browser-default" materialize="material_select"
      [materializeSelectOptions]="betalossOptions"
      formControlName="betaloss">
        <option *ngFor="let options of betalossOptions">{{options}}</option>
      </select>
    </label>
  </div>
</form>
  `
})
export class NmfFormComponent extends AbstractScatterForm {

  @Input() set config(v: NmfConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  initOptions = [
    NmfInit.NNDSVD,
    NmfInit.RANDOM,
    NmfInit.NNDSVDA,
    NmfInit.NNDSVDAR
  ];

  solverOptions = [
    NmfSolver.CD,
    NmfSolver.MU
  ];

  betalossOptions = [
    NmfBetaLoss.FROBENIUS,
    NmfBetaLoss.ITAKURA_SAITO,
    NmfBetaLoss.KULLBACK_LEIBLER
  ];



  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
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
      init: [],
      solver: [],
      beta_loss: [],
      tol: []
    });

    this.registerFormChange();
  }
}
