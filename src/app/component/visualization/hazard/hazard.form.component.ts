import { HazardConfigModel } from './hazard.model';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-hazard-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
</form>
  `
})
export class HazardFormComponent implements OnDestroy {


  form: FormGroup;
  @Input() set config(v: HazardConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();


  _cohorts: Array<any>;
  public get cohorts(): Array<any> { return this._cohorts; }
  @Input() public set cohorts(value: Array<any>) {
    this._cohorts = value;
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }

  ngOnDestroy(): void { }

  constructor(private fb: FormBuilder, public cd: ChangeDetectorRef) {


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
