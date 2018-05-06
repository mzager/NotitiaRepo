import { FastIcaConfigModel, FastIcaAlgorithm, FastIcaFunction } from './fastica.model';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';


@Component({
  selector: 'app-fastica-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fastica.form.component.html'
})
export class FastIcaFormComponent extends AbstractScatterForm {

  @Input() set config(v: FastIcaConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  algorithmOptions = [
    FastIcaAlgorithm.PARALLEL,
    FastIcaAlgorithm.DEFLATION
  ];

  functionOptions = [
    FastIcaFunction.LOGCOSH,
    FastIcaFunction.CUBE,
    FastIcaFunction.EXP
  ];

  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      dataOption: [],

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      algorithm: [],
      fun: [],
      whiten: [],
      tol: []
    });

    this.registerFormChange();
  }
}
