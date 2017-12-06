import { ChromosomeConfigModel } from './chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-chromosome-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Chromosomes</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="chromosomeOptions"
          formControlName="chromosome">
          <option *ngFor="let option of chromosomeOptions" [value]="option">{{option}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Layout</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="layoutOptions"
          formControlName="layoutOption">
          <option *ngFor="let option of layoutOptions" [value]="option">{{option}}</option>
      </select>
    </label>
  </div>
  <!--
  <div class="form-group">
    <label class="center-block"><span class="form-label">Gene Color</span>
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="colorOptions"
          formControlName="pointColor">
          <option *ngFor="let option of colorOptions" [ngValue]="option">{{option}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Flare Size</span>
       <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="sizeOptions"
          formControlName="pointSize">
          <option *ngFor="let option of sizeOptions" [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  -->
  <div class="form-group"  *ngFor="let item of geneOptions; let i = index">
    <div class="switch">
      <label>
        <input type="checkbox" checked (change)="visibilityToggle(item.value)">
          <span class="lever"></span>
            {{item.label}}
      </label>
    </div>
  </div>
</form>
  `
})
export class ChromosomeFormComponent {

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getColorFields(fields);
    this.shapeOptions = DataFieldFactory.getShapeFields(fields);
    this.sizeOptions = DataFieldFactory.getSizeFields(fields);
  }

  @Input() set config(v: ChromosomeConfigModel) {
    if (v === null) { return; }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];
  layoutOptions = ['Circle', 'Line'];
  chromosomeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', 'X', 'Y'];
  geneOptions = [
    {label: 'Protein Coding', value: 'protein_coding'},
    {label: 'LincRNA', value: 'lincRNA'},
    {label: 'miRNA', value: 'miRNA'},
    {label: 'Misc RNA', value: 'misc_RNA'},
    {label: 'rRNA', value: 'rRNA'},
    {label: 'snRNA', value: 'snRNA'},
    {label: 'snoRNA', value: 'snoRNA'},
    {label: 'vaultRNA', value: 'vaultRNA'},
    {label: 'Antisense', value: 'antisense'},
    {label: 'TEC', value: 'TEC'},
    {label: 'Unprocessed Pseudo', value: 'unprocessed_pseudogene'},
    {label: 'Unprocessed Pseudo T', value: 'transcribed_unprocessed_pseudogene'},
    {label: 'Processed Pseudo', value: 'processed_pseudogene'},
    {label: 'Processed Pseudo T', value: 'transcribed_processed_pseudogene'},
    {label: 'Unitary Pseduo', value: 'unitary_pseudogene'},
    {label: 'Processed Transcript', value: 'processed_transcript'},
    {label: 'Sense Intronic', value: 'sense_intronic'},
    {label: 'Sense Overlapping', value: 'sense_overlapping'},
    {label: 'Unitary Pseudo', value: 'unitary_pseudogene'},
    {label: 'Unitary Pseudo T', value: 'transcribed_unitary_pseudogene'}
];

  visibilityToggle(item) {

  }

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
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      dimension: [],
      chromosome: [],
      allowRotation: [],
      layoutOption: []
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
