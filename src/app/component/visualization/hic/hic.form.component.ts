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
    <label class='center-block'><span class='form-label'>Gene Color</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions'
          formControlName='pointColor'>
          <option *ngFor='let option of colorOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
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
  <div class='form-group'>
    <div class='switch'>
      <label>
        <input type='checkbox' formControlName='showChromosome'>
        <span class='lever'></span>
        Show CTCF
      </label>
    </div>
  </div>
</form>
  `
})
export class HicFormComponent {

  /*
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Gene(s)</span>
      <input class='browser-default' formControlName='gene'>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Gene Size</span>
       <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='sizeOptions'
          formControlName='pointSize'>
          <option *ngFor='let option of sizeOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Gene Shape</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='sizeOptions'
          formControlName='pointShape'>
          <option *ngFor='let option of shapeOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  */

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getColorFields(fields, EntityTypeEnum.GENE); //.filter( v => v.ctype !== undefined );
    this.shapeOptions = DataFieldFactory.getShapeFields(fields, EntityTypeEnum.GENE); //.filter( v => v.ctype !== undefined );
    this.sizeOptions = DataFieldFactory.getSizeFields(fields, EntityTypeEnum.GENE); //.filter( v => v.ctype !== undefined );
  }

  @Input() set tables(tables: Array<DataTable>) {
    //this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set config(v: HicConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
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
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

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

        let dirty = 0;
        const form = this.form;
        if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
        if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
        if (form.get('showChromosome').dirty) { dirty |= DirtyEnum.OPTIONS; }
        if (form.get('showLabels').dirty) { dirty |= DirtyEnum.OPTIONS; }
        if (form.get('showLinks').dirty) { dirty |= DirtyEnum.OPTIONS; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });
  }

}
