import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaSparseConfigModel, PcaSparseSkMethod } from './pcasparse.model';
import { DimensionEnum, EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcasparse-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pcasparse.form.component.html'
})
export class PcaSparseFormComponent extends AbstractScatterForm {

  @Input() set config(v: PcaSparseConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  PcaSparseSkMethodOptions = [
    PcaSparseSkMethod.CD,
    PcaSparseSkMethod.LARS];


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
      sk_method: [],
      dimension: [],
      alpha: [],
      ridge_alpha: [],
      max_iter: [],
      tol: [],
      method: []
    });

    this.registerFormChange();
  }
}
