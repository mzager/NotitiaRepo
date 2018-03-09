import { ChromosomeConfigModel } from './chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-chromosome-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Chromosomes</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='chromosomeOptions'
          formControlName='chromosome'>
          <option *ngFor='let option of chromosomeOptions' [value]='option'>{{option}}</option>
      </select>
    </label>
  </div>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Layout</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='layoutOptions'
          formControlName='layoutOption'>
          <option *ngFor='let option of layoutOptions' [value]='option'>{{option}}</option>
      </select>
    </label>
  </div>
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
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Show</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='geneOptions'
          formControlName='geneOption'>
          <option *ngFor='let option of geneOptions' [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
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
  <label class='center-block'><span class='form-label'>Chords</span>
    <select materialize='material_select'
        [compareWith]='byKey'
        [materializeSelectOptions]='chordOptions'
        formControlName='chordOption'>
        <option *ngFor='let option of chordOptions' [ngValue]='option'>{{option.label}}</option>
    </select>
  </label>
</div>
</form>
  `
})
export class ChromosomeFormComponent {

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getColorFields(fields, EntityTypeEnum.GENE);
    this.shapeOptions = DataFieldFactory.getShapeFields(fields, EntityTypeEnum.GENE);
    this.sizeOptions = DataFieldFactory.getSizeFields(fields, EntityTypeEnum.GENE);
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
  spacingOptions = ['Translational Start Site', 'Linear'];
  chromosomeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', 'X', 'Y'];
  chordOptions = [
    {label: 'None', key: 'none'},
    {label: 'Hi-C', key: 'hic'}
  ];

  geneOptions = [
    {label: 'All Genes', key: 'all'},
    {label: 'Protein Coding', key: 'protein_coding'},
    {label: 'LincRNA', key: 'lincRNA'},
    {label: 'miRNA', key: 'miRNA'},
    {label: 'Misc RNA', key: 'misc_RNA'},
    {label: 'rRNA', key: 'rRNA'},
    {label: 'snRNA', key: 'snRNA'},
    {label: 'snoRNA', key: 'snoRNA'},
    {label: 'vaultRNA', key: 'vaultRNA'},
    {label: 'Antisense', key: 'antisense'},
    {label: 'TEC', key: 'TEC'},
    {label: 'Unprocessed Pseudo', key: 'unprocessed_pseudogene'},
    {label: 'Unprocessed Pseudo T', key: 'transcribed_unprocessed_pseudogene'},
    {label: 'Processed Pseudo', key: 'processed_pseudogene'},
    {label: 'Processed Pseudo T', key: 'transcribed_processed_pseudogene'},
    {label: 'Unitary Pseduo', key: 'unitary_pseudogene'},
    {label: 'Processed Transcript', key: 'processed_transcript'},
    {label: 'Sense Intronic', key: 'sense_intronic'},
    {label: 'Sense Overlapping', key: 'sense_overlapping'},
    {label: 'Unitary Pseudo', key: 'unitary_pseudogene'},
    {label: 'Unitary Pseudo T', key: 'transcribed_unitary_pseudogene'}
];

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
      chromosome: [],
      allowRotation: [],
      layoutOption: [],
      spacingOption: [],
      geneOption: [],
      chordOption: []
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
