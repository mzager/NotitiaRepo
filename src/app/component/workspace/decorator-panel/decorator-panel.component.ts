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

  form: FormGroup;
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;

  @Output() decoratorChange: EventEmitter<any> = new EventEmitter();

  // public static GENE_SIGNATURE = 'Gene Signature';
  // public static CLUSTERING_ALGORITHM = 'Clustering Algorithm';
  @Input() config: GraphConfig;
  @Input() set fields(fields: Array<DataField>) {
    this.colorOptions = DataFieldFactory.getColorFields(fields);
    this.shapeOptions = DataFieldFactory.getShapeFields(fields);
    this.sizeOptions = DataFieldFactory.getSizeFields(fields);

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

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
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

        form.markAsPristine();
        this.decoratorChange.emit(data);
    });

  }
}
