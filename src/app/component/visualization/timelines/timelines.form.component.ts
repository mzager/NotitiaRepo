import { DataService } from './../../../service/data.service';
import { TimelinesConfigModel, TimelinesStyle } from './timelines.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { FormArray, AbstractControl } from '@angular/forms/src/model';

@Component({
  selector: 'app-timelines-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Align</span>
      <select formControlName="align" class="browser-default"
        materialize="material_select">
        <optgroup *ngFor="let group of eventGroups" label="{{group.label}}">
          <option *ngFor="let evt of group.events"
            [ngValue]="evt.label">{{evt.label}}</option>
        </optgroup>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Sort</span>
      <select formControlName="sort" class="browser-default"
        materialize="material_select">
        <optgroup *ngFor="let group of eventGroups" label="{{group.label}}">
          <option *ngFor="let evt of group.events"
            [ngValue]="evt.label">{{evt.label}}</option>
        </optgroup>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Attributes</span>
      <select formControlName="attrs" multiple="true"
        materialize="material_select">
        <option *ngFor="let pa of this.patientAttributes"
          [ngValue]="pa.label">{{pa.label}}</option>
      </select>
    </label>
  </div>

  <div formArrayName="bars">
    <div *ngFor="let bar of ctrls; let i=index">
      <div [formGroupName]="i">
        <span class="form-label" style="
        text-align:left;width:100%;font-weight:700;padding:10px 0px 5px 0px;font-size:0.8rem;">
          {{ctrls[i].get('label').value}} Events</span>
          <div class="form-group">
            <label class="center-block"><span class="form-label">Display</span>
              <select class="browser-default" materialize="material_select" formControlName="style">
                <option *ngFor="let style of styleOptions"
                  [ngValue]="style">{{style}}</option>
              </select>
            </label>
          </div>
          <div class="form-group">
            <label class="center-block"><span class="form-label">Visible</span>
              <select materialize="material_select" formControlName="events"
                multiple>
                <option *ngFor="let item of eventTypes[ctrls[i].get('label').value]"
                  [ngValue]="item.subtype">{{item.subtype}}</option>
              </select>
          </label>
        </div>
      </div>
    </div>
  </div>
</form>`
})
export class TimelinesFormComponent {

  public styleOptions = [TimelinesStyle.NONE, TimelinesStyle.ARCS,
    TimelinesStyle.TICKS, TimelinesStyle.SYMBOLS];
  public eventGroups = [];
  public eventTypes = {};
  public patientAttributes = [];
  public ctrls = [];

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.patientAttributes = fields.filter(v => (v.type === 'NUMBER') );
  }

  @Input() set events(events: Array<{type: string, subtype: string}>) {
    if (events === null) { return; }
    if (events.length === 0) { return ; }
    const groups = _.groupBy(events, 'type');

    const control = <FormArray>this.form.controls['bars'];
    Object.keys(groups).forEach( group => {
      const fg = this.fb.group({
        label: [group],
        style: [TimelinesStyle.TICKS],
        events: []
      });
      control.push(fg);
    });
    this.ctrls = control.controls;
    this.eventTypes = groups;
    this.eventGroups = Object.keys(groups).map(lbl => ({
      label: lbl, events: groups[lbl].map(evt => ({label: evt.subtype}))
    }));
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

  constructor(private fb: FormBuilder, private dataService: DataService) {

    // Init Form
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

      sort: [],
      align: [],
      attrs: [],

      bars: this.fb.array([])
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(800)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        console.dir(form);
        // if (form.get('timescale').dirty) { dirty |= DirtyEnum.OPTIONS; }
        // if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });

  }
}
