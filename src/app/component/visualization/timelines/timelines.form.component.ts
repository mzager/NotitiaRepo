
import {combineLatest as observableCombineLatest,  Subject ,  Subscription } from 'rxjs';

import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Rx';
import { DataField } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { TimelinesConfigModel, TimelinesStyle } from './timelines.model';

@Component({
  selector: 'app-timelines-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timelines.form.component.html'
})
export class TimelinesFormComponent implements OnDestroy {
  public rv = [0, 100];
  public styleOptions = [
    TimelinesStyle.NONE,
    TimelinesStyle.ARCS,
    TimelinesStyle.TICKS,
    TimelinesStyle.SYMBOLS
  ];
  public eventGroups = [];
  public eventTypes = {};
  public patientAttributes = [];
  public ctrls = [];
  public alignOptions = [];
  public sortOptions = [];
  public groupOptions = [];
  public $fields: Subject<Array<DataField>> = new Subject();
  public $events: Subject<
    Array<{ type: string; subtype: string }>
  > = new Subject();
  public $options: Subscription;

  @Input()
  set fields(fields: Array<DataField>) {
    if (fields === null) {
      return;
    }
    if (fields.length === 0) {
      return;
    }
    this.patientAttributes = fields;
    this.$fields.next(fields);
  }

  @Input()
  set events(events: Array<{ type: string; subtype: string }>) {
    if (events === null) {
      return;
    }
    if (events.length === 0) {
      return;
    }
    const groups = _.groupBy(events, 'type');
    const control = <FormArray>this.form.controls['bars'];
    Object.keys(groups).forEach(group => {
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
      label: lbl,
      events: groups[lbl].map(evt => ({ label: evt.subtype }))
    }));
    this.$events.next(this.eventGroups);
  }

  @Input()
  set config(v: TimelinesConfigModel) {
    if (v === null) {
      return;
    }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output()
  configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;

  rangeChange(): void {
    this.form.patchValue(
      { range: this.rv },
      { onlySelf: true, emitEvent: true }
    );
  }

  setOptions(options: any): void {
    options[0].filter(w => w.type === 'NUMBER');
    const sort = options[1].map(v => ({
      label: v.label,
      items: v.events.map(w => ({ label: w.label, type: 'event' }))
    }));
    sort.unshift({
      label: 'Patient',
      items: [{ label: 'None' }].concat(
        options[0]
          .filter(w => w.type === 'NUMBER')
          .map(w => Object.assign(w, { type: 'patient' }))
      )
    });
    const group = [
      {
        label: 'Patient',
        items: [{ label: 'None' }].concat(
          options[0]
            .filter(w => w.type === 'STRING')
            .map(w => Object.assign(w, { type: 'patient' }))
        )
      }
    ];
    this.sortOptions = sort;
    this.groupOptions = group;
  }
  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) {
      return false;
    }
    return p1.key === p2.key;
  }
  byLabel(p1: any, p2: any) {
    if (p2 === null) {
      return false;
    }
    return p1.label === p2.label;
  }

  ngOnDestroy(): void {
    this.$options.unsubscribe();
  }

  constructor(private fb: FormBuilder) {
    // Init Form
    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],

      sort: [],
      group: [],
      align: [],
      attrs: [],
      range: [],

      bars: this.fb.array([])
    });

    // // Update When Form Changes
    // this.form.valueChanges
    //   .debounceTime(800)
    //   .distinctUntilChanged()
    //   .subscribe(data => {
    //     let dirty = 0;
    //     const form = this.form;

    //     // if (form.get('timescale').dirty) { dirty |= DirtyEnum.OPTIONS; }
    //     // if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
    //     if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
    //     form.markAsPristine();
    //     data.dirtyFlag = dirty;
    //     this.configChange.emit(data);
    //   });

    // Update When Form Changes
    this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),)
      .subscribe(data => {
        const form = this.form;
        if (form.dirty) {
          form.markAsPristine();
          this.configChange.emit(data);
        }
      });

    this.$options = observableCombineLatest(
      this.$fields,
      this.$events
    ).subscribe(this.setOptions.bind(this));
  }
}
