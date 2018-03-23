import { Observable } from 'rxjs/Rx';
import { CollectionTypeEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataTable } from './../../../model/data-field.model';
import { DataTypeEnum } from './../../../model/enum.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';
import { AfterViewInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-workspace-decorator-panel',
  templateUrl: './decorator-panel.component.html',
  styleUrls: ['./decorator-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecoratorPanelComponent implements AfterViewInit, OnDestroy {

  public clinicalColorOptions: Array<DataField>;
  public clinicalShapeOptions: Array<DataField>;
  public clinicalSizeOptions: Array<DataField>;
  public molecularColorOptions: Array<DataField>;
  public molecularShapeOptions: Array<DataField>;
  public molecularSizeOptions: Array<DataField>;
  public colorOptions: Array<DataField>;
  public shapeOptions: Array<DataField>;
  public sizeOptions: Array<DataField>;
  public form: FormGroup;



  @Output() decoratorAdd: EventEmitter<DataDecorator> = new EventEmitter();
  @Output() decoratorDel: EventEmitter<DataDecorator> = new EventEmitter();


  // public static GENE_SIGNATURE = 'Gene Signature';
  // public static CLUSTERING_ALGORITHM = 'Clustering Algorithm';
  private _config: GraphConfig;
  public get config(): GraphConfig { return this._config; }
  @Input() public set config(config: GraphConfig) {
    if (!this._config) {
      this._config = config;
      this.updateFields();
    } else if (this._config.entity !== config.entity) {
      this._config = config;
      this.updateFields();
    }
  }
  @Input() set tables(tables: Array<DataTable>) {
    this.molecularColorOptions = DataFieldFactory.getMolecularColorFields(tables);
    this.molecularShapeOptions = DataFieldFactory.getMolecularShapeFields(tables);
    this.molecularSizeOptions = DataFieldFactory.getMolecularSizeFields(tables);
    this.updateFields();
  }
  @Input() set fields(fields: Array<DataField>) {
    this.clinicalColorOptions = DataFieldFactory.getSampleColorFields(fields);
    this.clinicalShapeOptions = DataFieldFactory.getSampleShapeFields(fields);
    this.clinicalSizeOptions = DataFieldFactory.getSampleSizeFields(fields);
    this.updateFields();
    //     if (fields.length === 0) { return; }
    //     const defaultDataField: DataField = DataFieldFactory.getUndefined();

    //     // Gene Signature Color
    //     const signatureField = DataFieldFactory.getUndefined();
    //     signatureField.ctype = CollectionTypeEnum.UNDEFINED;
    //     signatureField.type = DataTypeEnum.FUNCTION;
    //     signatureField.label = DecoratorPanelComponent.GENE_SIGNATURE;

    //     // Clustering Algorithm Color
    //     const clusterField = DataFieldFactory.getUndefined();
    //     clusterField.ctype = CollectionTypeEnum.UNDEFINED;
    //     clusterField.type = DataTypeEnum.FUNCTION;
    //     clusterField.label = DecoratorPanelComponent.CLUSTERING_ALGORITHM;

    //     const colorOptions = DataFieldFactory.getColorFields(fields);
    //     colorOptions.push(...[signatureField, clusterField]);

    //     this.colorOptions = colorOptions;
    //     this.shapeOptions = DataFieldFactory.getShapeFields(fields);
    //     this.sizeOptions = DataFieldFactory.getSizeFields(fields);
    // }
    //   if (form.get('pointColor').dirty) {
    //     const pointColor = form.getRawValue().pointColor.label;
    //     if (pointColor === AbstractScatterForm.CLUSTERING_ALGORITHM) {
    //         this.selectClusteringAlgorithm.emit(data);
    //         return;
    //     }
    //     if (pointColor === AbstractScatterForm.GENE_SIGNATURE) {
    //         this.selectGeneSignature.emit(data);
    //         return;
    //     }
    //     dirty |= DirtyEnum.COLOR; }
    // if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
    // if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
  }

  private _decorators: Array<DataDecorator> = [];
  @Input() set decorators(value: Array<DataDecorator>) {
    if (value === null) { return; }
    this._decorators = value;
  }

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  updateFields(): void {
    if (!this._config || !this.molecularColorOptions || !this.clinicalColorOptions) { return; }
    if (this.config.entity === EntityTypeEnum.GENE) {
      this.colorOptions = this.molecularColorOptions;
      this.shapeOptions = this.molecularShapeOptions;
      this.sizeOptions = this.molecularSizeOptions;
    } else {
      this.colorOptions = this.clinicalColorOptions;
      this.shapeOptions = this.clinicalShapeOptions;
      this.sizeOptions = this.clinicalSizeOptions;
    }
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
  }
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {

    this.form = this.fb.group({
      colorOption: [],
      shapeOption: [],
      sizeOption: []
    });

    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(data => {
        const form = this.form;
        const opts: Array<DataField> = [];
        let value;

        if (form.get('colorOption').dirty) {
          value = form.get('colorOption').value;
          if (value.key === 'None') {
            this.decoratorDel.emit({ type: DataDecoratorTypeEnum.COLOR, values: null, field: null, legend: null });
          } else {
            this.decoratorAdd.emit({ type: DataDecoratorTypeEnum.COLOR, field: value, legend: null, values: null });
          }
        }
        if (form.get('shapeOption').dirty) {
          value = form.get('shapeOption').value;
          if (value.key === 'None') {
            this.decoratorDel.emit({ type: DataDecoratorTypeEnum.SHAPE, values: null, field: null, legend: null });
          } else {
            this.decoratorAdd.emit({ type: DataDecoratorTypeEnum.SHAPE, field: value, legend: null, values: null });
          }
        }
        if (form.get('sizeOption').dirty) {
          value = form.get('sizeOption').value;
          if (value.key === 'None') {
            this.decoratorDel.emit({ type: DataDecoratorTypeEnum.SIZE, values: null, field: null, legend: null });
          } else {
            this.decoratorAdd.emit({ type: DataDecoratorTypeEnum.SIZE, field: value, legend: null, values: null });
          }
        }

        form.markAsPristine();
      });

  }
}
