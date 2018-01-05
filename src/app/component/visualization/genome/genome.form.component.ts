import { EntityTypeEnum } from './../../../model/enum.model';
import { GenomeConfigModel } from './genome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-genome-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Gene Color</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions"
          formControlName="pointColor">
          <option *ngFor="let option of colorOptions" [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <!--
  <div class="form-group">
    <label class="center-block"><span class="form-label">Spacing</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="spacingOptions"
          formControlName="spacingOption">
          <option *ngFor="let option of spacingOptions" [value]="option">{{option}}</option>
      </select>
    </label>
  </div>
  -->
</form>
  `
})
export class GenomeFormComponent {

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getColorFields(fields, EntityTypeEnum.GENE).filter( v => v.ctype !== undefined );
    this.shapeOptions = DataFieldFactory.getShapeFields(fields, EntityTypeEnum.GENE).filter( v => v.ctype !== undefined );
    this.sizeOptions = DataFieldFactory.getSizeFields(fields, EntityTypeEnum.GENE).filter( v => v.ctype !== undefined );
  }

  @Input() set config(v: GenomeConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  layoutOptions = ['Circle', 'Line'];
  spacingOptions = ['Actual', 'Optimized'];
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];
  chromosomeOptions = ['Cytobands', 'Centromeres & Telemeres', 'None'];

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

      dimension: [],
      chromosomeOption: [],
      allowRotation: [],
      layoutOption: [],
      spacingOption: []
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
