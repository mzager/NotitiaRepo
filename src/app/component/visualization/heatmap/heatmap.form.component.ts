import { HeatmapAction } from './../../../action/compute.action';
import { HeatmapConfigModel, HeatmapMethod, HeatmapDistance, HeatmapDataModel } from './heatmap.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum, HClustMethodEnum, HClustDistanceEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-heatmap-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form" novalidate>
    <div class="form-group">
      <label class="center-block"><span class="form-label">Data</span>
        <select class="browser-default" materialize="material_select"
            [materializeSelectOptions]="dataOptions"
            formControlName="table">
            <option *ngFor="let option of dataOptions" [value]="option">{{option.label}}</option>
        </select>
      </label>
    </div>
    <div class="form-group">
    <label class="center-block"><span class="form-label">Affinity</span>
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="dataOptions"
          formControlName="dist">
          <option *ngFor="let option of distanceOptions" [value]="option.value">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Linkage</span>
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="dataOptions"
          formControlName="method">
          <option *ngFor="let option of distanceOptions" [value]="option.value">{{option.label}}</option>
      </select>
    </label>
  </div>
  </form>
  `
})
export class HeatmapFormComponent {


  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set config(v: HeatmapConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  dataOptions: Array<DataTable>;
  methodOptions = [HeatmapMethod.AVERAGE, HeatmapMethod.CENTROID, HeatmapMethod.COMPLETE, HeatmapMethod.SINGLE];
  distanceOptions = [HeatmapDistance.CORRELATION, HeatmapDistance.ABS_CORRELATION,
    HeatmapDistance.UNCENTERED, HeatmapDistance.ABS_UNCENTERED,
    HeatmapDistance.EUCLIDEAN, HeatmapDistance.MANHATTEN, HeatmapDistance.KENDALL, HeatmapDistance.SPEARMANS]

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {


    this.form = this.fb.group({
      visualization: [],
      graph: [],
      entity: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      dataOption: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      method: [],
      dist: [],
      transpose: []
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
