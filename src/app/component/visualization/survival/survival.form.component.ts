import { SurvivalConfigModel } from './survival.model';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-survival-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survival.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SurvivalFormComponent implements OnDestroy {


  form: FormGroup;
  @Input() set config(v: SurvivalConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  ngOnDestroy(): void { }

  constructor(private fb: FormBuilder) {


    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      pointData: [],

      censorEvent: [],
      cohorts: []

    });
  }
}
