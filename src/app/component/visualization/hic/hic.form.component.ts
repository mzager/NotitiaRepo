import { HicConfigModel } from './hic.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-hic-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Dimensions</span>
      <select materialize='material_select'
        [materializeSelectOptions]='dimensionOptions'
        formControlName='dimensions'>
          <option *ngFor='let options of dimensionOptions'>{{options}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='showLinks'>
        <span class='lever'></span>
        Show Links
      </label>
    </div>
  </div>
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='showChromosome'>
        <span class='lever'></span>
        Show Chromosome
      </label>
    </div>
  </div>
</form>
  `
})
export class HicFormComponent {


  @Input() set config(v: HicConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;

  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];

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
      database: [],
      entity: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      table: [],

      gene: [],
      dimensions: [],
      allowRotation: [],
      showLabels: [],
      showLinks: [],
      showChromosome: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(data => {
        const form = this.form;
        form.markAsPristine();
        data.dirtyFlag = DirtyEnum.NO_COMPUTE;
        this.configChange.emit(data);
      });
  }

}
