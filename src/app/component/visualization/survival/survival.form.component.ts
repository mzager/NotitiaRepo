import { SurvivalConfigModel } from './survival.model';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { MatCheckboxChange, MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-survival-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survival.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SurvivalFormComponent implements OnDestroy {


  form: FormGroup;
  @Input() set config(v: SurvivalConfigModel) {
    // if (v === null) { return; }
    // this.form.patchValue(v, { emitEvent: false });
  }




  @Output() configChange = new EventEmitter<GraphConfig>();

  _cohortSelected: any;
  _cohortOptions: Array<any>;

  _cohorts: Array<any>;
  public get cohorts(): Array<any> { return this._cohorts; }
  @Input() public set cohorts(value: Array<any>) {
    this._cohorts = value;
    this._cohortSelected = this._cohorts[0];
    this._cohortOptions = this.cohorts.filter(v => v !== this._cohortSelected).map(v => ({ n: v.n, sel: true }));

    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }

  ngOnDestroy(): void { }
  cohortChange(e: MatSelectChange): void {
    this._cohortOptions = this.cohorts.filter(v => v !== this._cohortSelected).map(v => ({ n: v.n, sel: true }));
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
    console.log("RE RUN");
  }
  compareChange(e: MatCheckboxChange): void {
    debugger
  }

  constructor(private fb: FormBuilder, public cd: ChangeDetectorRef) {


    // this.form = this.fb.group({
    //   visualization: [],
    //   graph: [],
    //   database: [],
    //   table: [],
    //   markerFilter: [],
    //   markerSelect: [],
    //   sampleFilter: [],
    //   sampleSelect: [],
    //   patientFilter: [],
    //   patientSelect: [],
    //   pointData: [],

    //   censorEvent: [],
    //   cohorts: []

    // });
  }
}
