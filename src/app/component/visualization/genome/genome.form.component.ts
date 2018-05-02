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
<form [formGroup]='form' novalidate>
  <mat-form-field>
    <mat-select placeholder='Alignment' formControlName='alignment'>
      <mat-option *ngFor='let option of alignmentOptions' [value]='option'>
          HG{{ option }}
      </mat-option>
    </mat-select>
  </mat-form-field>
  <div class='form-group'>
    <div class='switch'>
      <label class='center-block'><span class='form-label'>HG19 Tads</span>
        <input type='checkbox' formControlName='showTads'>
        <span class='lever'></span>
      </label>
    </div>
  </div>
  <!--
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Spacing</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='spacingOptions'
          formControlName='spacingOption'>
          <option *ngFor='let option of spacingOptions' [value]='option'>{{option}}</option>
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
    this.colorOptions = DataFieldFactory.getSampleColorFields(fields, EntityTypeEnum.GENE).filter(v => v.ctype !== undefined);
    this.shapeOptions = DataFieldFactory.getSampleShapeFields(fields, EntityTypeEnum.GENE).filter(v => v.ctype !== undefined);
    this.sizeOptions = DataFieldFactory.getSampleSizeFields(fields, EntityTypeEnum.GENE).filter(v => v.ctype !== undefined);
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
  alignmentOptions = ['19', '38'];
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
      patientFilter: [],
      patientSelect: [],
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      dimension: [],
      alignment: [],
      chromosomeOption: [],
      allowRotation: [],
      layoutOption: [],
      spacingOption: [],
      showTads: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        const form = this.form;
        form.markAsPristine();
        this.configChange.emit(data);
      });
  }

}
