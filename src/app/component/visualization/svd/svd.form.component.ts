import { SvdConfigModel } from './svd.model';
import { DimensionEnum, DistanceEnum, DenseSparseEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-svd-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './svd.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SvdFormComponent {

  @Input() set molecularData(tables: Array<string>) {
    this.dataOptions = tables.map(v => {
      const rv = { key: v, label: _.startCase(_.toLower(v)) };
      return rv;
    });
  }

  @Input() set clinicalFields(fields: Array<DataField>) {

    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getSampleColorFields(fields);
    this.shapeOptions = DataFieldFactory.getSampleShapeFields(fields);
    this.sizeOptions = DataFieldFactory.getSampleShapeFields(fields);
  }

  @Input() set config(v: SvdConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dataOptions: Array<{ key: string, label: string }>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];
  distanceOptions = [DistanceEnum.EUCLIDEAN, DistanceEnum.MANHATTAN, DistanceEnum.JACCARD, DistanceEnum.DICE];
  densityOptions = [DenseSparseEnum.DENSE, DenseSparseEnum.SPARSE];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      dataKey: [],

      molecularTable: [],
      pointData: [],

      dimension: [],
      domain: 5,
      perpexity: 10, // *>1
      learningRate: 500, // 100-1000
      nIter: 200, // Maximum Number of itterations >200
      density: DenseSparseEnum.DENSE
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }
}
