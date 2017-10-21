import { IsoMapConfigModel, IsoMapPathMethod, IsoMapEigenSolver, IsoMapNeighborsAlgorithm } from './isomap.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-isomap-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Data</span>
      <select class="browser-default" materialize="material_select"
        [compareWith]="byKey"
        formControlName="table">
        <option *ngFor="let option of dataOptions">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Display</span>
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
    <label class="center-block"><span class="form-label">Eigen Solver</span>
    <select class="browser-default" materialize="material_select"
      [materializeSelectOptions]="IsoMapEigenSolverOpitions"
      formControlName="eigen_solver">
        <option *ngFor="let options of IsoMapEigenSolverOpitions">{{options}}</option>
    </select>
  </label>
</div>
<div class="form-group">
  <label class="center-block"><span class="form-label">Path Method</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="IsoMapPathMethodOpitions"
        formControlName="path_method">
        <option *ngFor="let options of IsoMapPathMethodOpitions">{{options}}</option>
      </select>
    </label>
  </div>
<div class="form-group">
  <label class="center-block"><span class="form-label">Neighbors Algorithm</span>
      <select class="browser-default" materialize="material_select"
        [materializeSelectOptions]="IsoMapNeighborsAlgorithmOpitions"
        formControlName="neighbors_algorithm">
          <option *ngFor="let options of IsoMapNeighborsAlgorithmOpitions">{{options}}</option>
      </select>
    </label>
  </div>
</form>
  `
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
      tol: [],
      n_neighbors: [],
      eigen_solver: [],
      path_method: [],
      neighbors_algorithm: []
    });

    this.registerFormChange();
  }
}
