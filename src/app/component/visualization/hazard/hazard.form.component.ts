import { MatCheckboxChange, MatSelectChange } from '@angular/material';
import { HazardConfigModel } from './hazard.model';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChromosomeConfigModel } from './../chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-hazard-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hazard.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HazardFormComponent implements OnDestroy {

  @Input() set config(v: HazardConfigModel) {
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
    this._cohortSelected = e.value;
    this._cohortOptions = this.cohorts.filter(v => v !== this._cohortSelected).map(v => ({ n: v.n, sel: true }));
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }
  compareChange(e: MatCheckboxChange): void {
  }

  constructor(public cd: ChangeDetectorRef) {
  }
}
