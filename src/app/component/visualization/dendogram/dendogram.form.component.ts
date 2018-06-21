import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollectionTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataTable } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { HeatmapDistance, HeatmapMethod } from './../heatmap/heatmap.model';
import { DendogramConfigModel } from './dendogram.model';

@Component({
  selector: 'app-dendogram-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]='form' novalidate>
    <div class='form-group'>
      <label class='center-block'><span class='form-label'>Data</span>
        <select materialize='material_select'
            formControlName='table'>
            <option *ngFor='let option of dataOptions' [value]='option'>{{option.label}}</option>
        </select>
      </label>
    </div>
    <div class='form-group'>
    <label class='center-block'><span class='form-label'>Method</span>
      <select materialize='material_select'
          formControlName='method'>
          <option *ngFor='let option of methodOptions' [value]='option.value'>{{option.label}}</option>
      </select>
    </label>
  </div>
    <div class='form-group'>
    <label class='center-block'><span class='form-label'>Distance</span>
      <select materialize='material_select'
          formControlName='dist'>
          <option *ngFor='let option of distanceOptions' [value]='option.value'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label class='center-block'><span class='form-label'>Sort Dendo</span>
        <input type='checkbox' formControlName='order'>
        <span class='lever'></span>
      </label>
    </div>
  </div>
  </form>
  `
})
export class DendogramFormComponent {


  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set config(v: DendogramConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  dataOptions: Array<DataTable>;

  methodOptions = [
    HeatmapMethod.SINGLE,
    HeatmapMethod.COMPLETE,
    HeatmapMethod.AVERAGE,
    HeatmapMethod.WEIGHTED,
    HeatmapMethod.CENTROID,
    HeatmapMethod.MEDIAN,
    HeatmapMethod.WARD];

  distanceOptions = [
    HeatmapDistance.BRAYCURTIS,
    HeatmapDistance.CANBERRA,
    HeatmapDistance.CHEBYSHEV,
    HeatmapDistance.CITYBLOCK,
    HeatmapDistance.CORRELATION,
    HeatmapDistance.COSINE,
    HeatmapDistance.DICE,
    HeatmapDistance.EUCLIDEAN,
    HeatmapDistance.HAMMING,
    HeatmapDistance.JACCARD,
    HeatmapDistance.KULSINSKI,
    HeatmapDistance.MAHALANOBIS,
    HeatmapDistance.MATCHING,
    HeatmapDistance.MINKOWSKI,
    HeatmapDistance.ROGERSTANIMOTO,
    HeatmapDistance.RUSSELLRAO,
    HeatmapDistance.SEUCLIDEAN,
    HeatmapDistance.SOKALMICHENER,
    HeatmapDistance.SOKALSNEATH,
    HeatmapDistance.SQEUCLIDEAN,
    HeatmapDistance.YULE
  ];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      method: [],
      dist: [],
      transpose: [],
      order: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(data => {
        const form = this.form;
        form.markAsPristine();
        data.dirtyFlag = DirtyEnum.LAYOUT;
        this.configChange.emit(data);
      });
  }
}
