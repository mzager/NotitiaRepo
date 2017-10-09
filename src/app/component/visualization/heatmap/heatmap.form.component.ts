import { HeatmapConfigModel } from './heatmap.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum, HClustMethodEnum, HClustDistanceEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-heatmap-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form" novalidate>
    <div class="form-group">
      <label class="center-block">Data
        <select class="browser-default" materialize="material_select"
            [materializeSelectOptions]="dataOptions"
            formControlName="molecularTable">
            <option *ngFor="let option of dataOptions" [value]="option">{{option.label}}</option>
        </select>
      </label>
    </div>
    <div class="form-group">
      <label class="center-block"><span class="form-label">Clustering Method</span>
        <select class="browser-default" materialize="material_select"
            [compareWith]="byKey"
            [materializeSelectOptions]="colorOptions"
            formControlName="method">
            <option *ngFor="let option of methodOptions" [ngValue]="option">{{option}}</option>
        </select>
      </label>
    </div>
    <div class="form-group">
      <label class="center-block"><span class="form-label">Clustering Method</span>
        <select class="browser-default" materialize="material_select"
            [compareWith]="byKey"
            [materializeSelectOptions]="colorOptions"
            formControlName="distance">
            <option *ngFor="let option of distanceOptions" [ngValue]="option">{{option}}</option>
        </select>
      </label>
    </div>
  </form>
  `
})
export class HeatmapFormComponent {

  @Input() set molecularData(tables: Array<string>) {
    this.dataOptions = tables.map(v => {
      const rv = { key: v, label: _.startCase(_.toLower(v)) };
      return rv;
    });
  }

  @Input() set clinicalFields(fields: Array<DataField>) {


  }

  @Input() set config(v: HeatmapConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  dataOptions: Array<{ key: string, label: string }>;
  methodOptions = [HClustMethodEnum.AGNES, HClustMethodEnum.DIANA];
  distanceOptions = [HClustDistanceEnum.SINGLE,
    HClustDistanceEnum.COMPLETE, HClustDistanceEnum.AVERAGE,
    HClustDistanceEnum.CENTROID, HClustDistanceEnum.WARD];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {


    this.form = this.fb.group({
      visualization: [],
      graph: [],
      dataKey: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      molecularTable: [],
      method: this.methodOptions[0],
      distance: this.distanceOptions[0]
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }
}
