import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollectionTypeEnum, DimensionEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { ParallelCoordsConfigModel } from './parallelcoords.model';


@Component({
  selector: 'app-parallelcoords-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
<!--
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
    <label class='center-block'><span class='form-label'>Gene Size</span>
       <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='sizeOptions'
          formControlName='pointSize'>
          <option *ngFor='let option of sizeOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  -->
</form>`
})
export class ParallelCoordsFormComponent {

  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set fields(fields: Array<DataField>) {
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();

    this.colorOptions = DataFieldFactory.getSampleColorFields(fields);
    this.shapeOptions = DataFieldFactory.getSampleShapeFields(fields);
  }

  @Input() set config(v: ParallelCoordsConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  dataOptions: Array<DataTable>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];

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
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      dimension: [],
      chromosome: [],
      allowRotation: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        // if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
        if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });
  }

}
