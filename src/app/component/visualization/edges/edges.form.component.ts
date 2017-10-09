import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { EdgeConfigModel } from './edges.model';
import { DimensionEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, GraphActionEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-edges-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div>Graph A: {{ graphAConfig.entity }}</div>
  <div>Graph B: {{ graphBConfig.entity }}</div>
  <div class="form-group">
    <div class="switch">
      <label>
        <input type="checkbox" formControlName="visible">
        <span class="lever"></span>
        Visible
      </label>
    </div>
  </div>
  <br />
</form>
  `
})
export class EdgesFormComponent {

  @Input() graphAConfig: GraphConfig;
  @Input() graphBConfig: GraphConfig;


  @Input() set config(v: EdgeConfigModel) {
    // if (v === null) { return; }
    // if (this.form.value.visualization === null) {
    //   this.form.patchValue(v, {emitEvent : false});
    // }
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dataOptions: Array<{key: string, label: string}>;

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      visible: [],
      entityA: [],
      entityB: []
    });

    // // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        data.entityA = this.graphAConfig.entity;
        data.entityB = this.graphBConfig.entity;
        debugger;
        this.configChange.emit(data);
      });
  }
}
