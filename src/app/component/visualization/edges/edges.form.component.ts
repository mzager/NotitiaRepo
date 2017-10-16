import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { EdgeConfigModel } from './edges.model';
import { DimensionEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, GraphActionEnum, VisualizationEnum, CollectionTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
/*
// <div class="form-group">
  //   <label>{{ graphAConfig.entity }} to {{ graphBConfig.entity }}</label>
  // </div>
*/
@Component({
  selector: 'app-edges-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <div class="switch">
      <label>
        <input type="checkbox" formControlName="isVisible">
        <span class="lever"></span>
        Visible
      </label>
    </div>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Intersection</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions" formControlName="pointIntersect">
          <option *ngFor="let option of intersectOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Color</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions"
          formControlName="pointColor">
          <option *ngFor="let option of colorOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Size</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="sizeOptions"
          formControlName="pointSize">
          <option *ngFor="let option of sizeOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>

  <br />
</form>
  `
})
export class EdgesFormComponent {

  @Input() graphAConfig: GraphConfig;
  @Input() graphBConfig: GraphConfig;

  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set fields(fields: Array<DataField>) {
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.intersectOptions = DataFieldFactory.getIntersectFields(fields);
    this.colorOptions = DataFieldFactory.getColorFields(fields);
    this.sizeOptions = DataFieldFactory.getSizeFields(fields);
  }


  @Input() set config(v: EdgeConfigModel) {
    if (v === null) { return; }

    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  intersectOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dataOptions: Array<DataTable>;

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({

      visualization: [],
      graph: [],
      isVisible: [],
      entityA: [],
      entityB: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      pointIntersect: []

    });

    // // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        if (form.get('pointIntersect').dirty) { dirty |= DirtyEnum.INTERSECT; }
        if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit( data );
      });
  }
}
