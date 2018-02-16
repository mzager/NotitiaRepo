import { NoneAction } from './../../../action/compute.action';
import { Observable } from 'rxjs/Observable';
import { DataService } from './../../../service/data.service';
import { TimelinesConfigModel, TimelinesStyle } from './timelines.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { FormArray, AbstractControl } from '@angular/forms/src/model';
import { Subject } from 'rxjs/subject';
import { Subscription } from 'rxjs/Subscription';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
declare var $: any;
declare var noUiSlider;

@Component({
  selector: 'app-timelines-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Align By</span>
      <select formControlName='align'
        materialize='material_select'>
        <optgroup *ngFor='let group of eventGroups' label='{{group.label}}'>
          <option *ngFor='let evt of group.events'
            [ngValue]='evt.label'>{{evt.label}}</option>
        </optgroup>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Sort By</span>
      <select formControlName='sort' [compareWith]='byLabel'
        materialize='material_select'>
        <optgroup *ngFor='let group of sortOptions' label='{{group.label}}'>
          <option *ngFor='let item of group.items'
            [ngValue]='item'>{{item.label}}</option>
        </optgroup>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Group By</span>
      <select formControlName='group' [compareWith]='byLabel'
        materialize='material_select'>
        <optgroup *ngFor='let group of groupOptions' label='{{group.label}}'>
          <option *ngFor='let item of group.items'
            [ngValue]='item'>{{item.label}}</option>
        </optgroup>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Heat Map</span>
      <select formControlName='attrs' multiple='true'
        materialize='material_select'>
        <option *ngFor='let pa of this.patientAttributes'
          [ngValue]='pa.label'>{{pa.label}}</option>
      </select>
    </label>
  </div>
  <div formArrayName='bars'>
    <div *ngFor='let bar of ctrls; let i=index'>
      <div [formGroupName]='i'>
        <span class='form-label' style='
        text-align:left;width:100%;font-weight:700;padding:10px 0px 0px 0px;font-size:.9rem;'>
          {{ctrls[i].get('label').value}} Events</span>
          <div class='form-group'>
            <label class='center-block'><span class='form-label'>Display</span>
              <select materialize='material_select' formControlName='style'>
                <option *ngFor='let style of styleOptions'
                  [ngValue]='style'>{{style}}</option>
              </select>
            </label>
          </div>
          <div class='form-group'>
            <label class='center-block'><span class='form-label'>Visible</span>
              <select materialize='material_select' formControlName='events'
                multiple>
                <option *ngFor='let item of eventTypes[ctrls[i].get("label").value]'
                  [ngValue]='item.subtype'>{{item.subtype}}</option>
              </select>
          </label>
        </div>
      </div>
    </div>
  </div>
</form>
<div>
  <span class='form-label' style='text-align:left;width:100%;font-weight:700;padding:10px 0px 0px 0px;font-size:.9rem;'>
  Visible Day Range
  </span>
  <div style='padding:0px 6px;'>
    <nouislider [connect]='true' [min]='0' [max]='100' [step]='1' [(ngModel)]='this.rv'
      (change)='rangeChange()'></nouislider>
  </div>
</div>
`
})
export class TimelinesFormComponent implements OnDestroy {

  public rv = [0, 100];
  public styleOptions = [TimelinesStyle.NONE, TimelinesStyle.ARCS,
    TimelinesStyle.TICKS, TimelinesStyle.SYMBOLS];
  public eventGroups = [];
  public eventTypes = {};
  public patientAttributes = [];
  public ctrls = [];
  public alignOptions = [];
  public sortOptions = [];
  public groupOptions = [];
  public $fields: Subject<Array<DataField>> = new Subject();
  public $events: Subject<Array<{type: string, subtype: string}>> = new Subject();
  public $options: Subscription;


  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.patientAttributes = fields;
    this.$fields.next(fields);
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
        events: [],
        row: [],
        track: [],
        z: []
      });
      control.push(fg);
    });
    this.ctrls = control.controls;
    this.eventTypes = groups;
    this.eventGroups = Object.keys(groups).map(lbl => ({
      label: lbl, events: groups[lbl].map(evt => ({label: evt.subtype}))
    }));
    this.$events.next(this.eventGroups);
  }

  @Input() set config(v: TimelinesConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;

  rangeChange(): void {
    this.form.patchValue({range: this.rv}, {onlySelf: true, emitEvent: true});
  }

  setOptions(options: any): void {
    const clinical = options[0];
    const events = options[1];
    options[0].filter(w => w.type === 'NUMBER');
    const sort = options[1].map(v => ({
      label: v.label,
      items: v.events.map(w => ({label: w.label, type: 'event'}))
    }));
    sort.unshift({
      label: 'Patient',
      items: [{label: 'None'}].concat(options[0].filter(w => w.type === 'NUMBER').map(w => Object.assign(w, {type: 'patient'})))
    });
    const group = [{
      label: 'Patient',
      items: [{label: 'None'}].concat(options[0].filter(w => w.type === 'STRING').map(w => Object.assign(w, {type: 'patient'})))
    }];
    this.sortOptions = sort;
    this.groupOptions = group;
  }
  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }
  byLabel(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.label === p2.label;
  }

  ngOnDestroy(): void {
    this.$options.unsubscribe();
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
      group: [],
      align: [],
      attrs: [],
      range: [],

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

      this.$options = Observable.combineLatest(this.$fields, this.$events).subscribe( this.setOptions.bind(this) );

  }
}
