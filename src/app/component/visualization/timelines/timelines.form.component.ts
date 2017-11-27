import { TimelinesConfigModel } from './timelines.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-timelines-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Align</span>
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="subtypeOptions" formControlName="align">
          <option *ngFor="let option of subtypeOptions"
            [ngValue]="option">{{option}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Sort</span>
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="subtypeOptions" formControlName="sort">
          <option *ngFor="let option of subtypeOptions"
            [ngValue]="option">{{option}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Time Scale</span>
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="timescaleOptions" formControlName="timescale">
          <option *ngFor="let option of timescaleOptions"
            [ngValue]="option">{{option}}</option>
      </select>
    </label>
  </div>
</form>`
})
export class TimelinesFormComponent {

  public alignOptions = [];
  public typeOptions: Array<string>;
  public subtypeOptions: Array<string>;
  public timescaleOptions = ['Linear', 'Log'];

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    // this.colorOptions = DataFieldFactory.getColorFields(fields);
    // this.shapeOptions = DataFieldFactory.getShapeFields(fields);
    // this.sizeOptions = DataFieldFactory.getSizeFields(fields);
  }

  @Input() set events(events: Array<{type: string, subtype: string}>) {
    if (events === null) { return; }
    if (events.length === 0) { return ; }
    this.typeOptions = ['None'].concat(Array.from(new Set( events.map(v => v.type ))));
    this.subtypeOptions = ['None'].concat(Array.from(new Set( events.map(v => v.subtype ))));
  }

  @Input() set config(v: TimelinesConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;


  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    // Init Form
    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      entity: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      sort: [],
      align: [],
      timescale: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        if (form.get('sort').dirty) { dirty |= DirtyEnum.LAYOUT; }
        if (form.get('align').dirty) { dirty |= DirtyEnum.LAYOUT; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });
  }



}
