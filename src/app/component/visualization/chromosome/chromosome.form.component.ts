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
<mat-form-field class='form-field'>
  <mat-select placeholder='Data' formControlName='table'>
      <mat-option *ngFor='let option of dataOptions' [value]='option.label'>
          {{ option.label }}
      </mat-option>
  </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
      <mat-select placeholder='Chromosomes' formControlName='chromosome'>
          <mat-option *ngFor='let option of chromosomeOptions' [value]='option.label'>
              {{ option.label }}
          </mat-option>
      </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
      <mat-select placeholder='Layout' formControlName='layoutOption'>
          <mat-option *ngFor='let option of layoutOptions' [value]='option'>
              {{ option }}
          </mat-option>
      </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
      <mat-select placeholder='Spacing' formControlName='spacingOption'>
          <mat-option *ngFor='let option of spacingOptions' [value]='option'>
              {{ option }}
          </mat-option>
      </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Show' formControlName='geneOption'>
        <mat-option *ngFor='let option of geneOptions' [value]='option'>
            {{ option.label }}
        </mat-option>
    </mat-select>
  </mat-form-field>
  <mat-form-field class='form-field'>
    <mat-select placeholder='Chords' formControlName='chordOption'>
        <mat-option *ngFor='let option of chordOptions' [value]='option'>
            {{ option.label }}
        </mat-option>
    </mat-select>
  </mat-form-field>
</form>
  `
})
export class ChromosomeFormComponent {

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getSampleColorFields(fields, EntityTypeEnum.GENE);
    this.shapeOptions = DataFieldFactory.getSampleShapeFields(fields, EntityTypeEnum.GENE);
    this.sizeOptions = DataFieldFactory.getSampleSizeFields(fields, EntityTypeEnum.GENE);
  }
  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
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
  dataOptions: Array<DataTable>;
  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D];
  layoutOptions = ['Circle', 'Line'];
  spacingOptions = ['Translational Start Site', 'Linear'];
  chromosomeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
    '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', 'X', 'Y'];
  chordOptions = [
    { label: 'None', key: 'none' },
    { label: 'Hi-C', key: 'hic' }
  ];

  geneOptions = [
    { label: 'All Genes', key: 'all' },
    { label: 'Protein Coding', key: 'protein_coding' },
    { label: 'LincRNA', key: 'lincRNA' },
    { label: 'miRNA', key: 'miRNA' },
    { label: 'Misc RNA', key: 'misc_RNA' },
    { label: 'rRNA', key: 'rRNA' },
    { label: 'snRNA', key: 'snRNA' },
    { label: 'snoRNA', key: 'snoRNA' },
    { label: 'vaultRNA', key: 'vaultRNA' },
    { label: 'Antisense', key: 'antisense' },
    { label: 'TEC', key: 'TEC' },
    { label: 'Unprocessed Pseudo', key: 'unprocessed_pseudogene' },
    { label: 'Unprocessed Pseudo T', key: 'transcribed_unprocessed_pseudogene' },
    { label: 'Processed Pseudo', key: 'processed_pseudogene' },
    { label: 'Processed Pseudo T', key: 'transcribed_processed_pseudogene' },
    { label: 'Unitary Pseduo', key: 'unitary_pseudogene' },
    { label: 'Processed Transcript', key: 'processed_transcript' },
    { label: 'Sense Intronic', key: 'sense_intronic' },
    { label: 'Sense Overlapping', key: 'sense_overlapping' },
    { label: 'Unitary Pseudo', key: 'unitary_pseudogene' },
    { label: 'Unitary Pseudo T', key: 'transcribed_unitary_pseudogene' }
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
        const form = this.form;
        form.markAsPristine();
        this.configChange.emit(data);
      });
  }

}
