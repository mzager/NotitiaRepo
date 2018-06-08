import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollectionTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataTable } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { HeatmapConfigModel, HeatmapDistance, HeatmapMethod } from './heatmap.model';

@Component({
  selector: 'app-heatmap-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]='form' novalidate>
    <mat-form-field class='form-field'>
      <mat-select placeholder='Data' formControlName='table' [compareWith]='byTbl'>
          <mat-option *ngFor='let option of dataOptions' [value]='option'>
              {{ option.label }}
          </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class='form-field'>
      <mat-select placeholder='Method' formControlName='method'>
          <mat-option *ngFor='let option of methodOptions' [value]='option.value'>
              {{ option.label }}
          </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class='form-field'>
      <mat-select placeholder='Distance' formControlName='dist'>
          <mat-option *ngFor='let option of distanceOptions' [value]='option.value'>
              {{ option.label }}
          </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-slide-toggle formControlName='order'>Sort Dendo</mat-slide-toggle>
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
  byTbl(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.tbl === p2.tbl;
  }

  constructor(private fb: FormBuilder) {

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
