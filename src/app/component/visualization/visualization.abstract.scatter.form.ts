import { AbstractScatterVisualization } from './visualization.abstract.scatter.component';
import { DimensionEnum } from './../../model/enum.model';
import { FormGroup } from '@angular/forms';
import { GraphConfig } from './../../model/graph-config.model';
import { Input, Output, EventEmitter } from '@angular/core';
import { CollectionTypeEnum, EntityTypeEnum, DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataTable } from './../../model/data-field.model';
import { DataFieldFactory } from 'app/model/data-field.model';
export class AbstractScatterForm {

    public static GENE_SIGNATURE = 'Gene Signature';
    public static CLUSTERING_ALGORITHM = 'Clustering Algorithm';

    @Input() set tables(tables: Array<DataTable>) {
        this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
    }

    @Input() set fields(fields: Array<DataField>) {
        if (fields.length === 0) { return; }
        const defaultDataField: DataField = DataFieldFactory.getUndefined();

        // Gene Signature Color
        const signatureField = DataFieldFactory.getUndefined();
        signatureField.ctype = CollectionTypeEnum.UNDEFINED;
        signatureField.type = DataTypeEnum.FUNCTION;
        signatureField.label = AbstractScatterForm.GENE_SIGNATURE;

        // Clustering Algorithm Color
        const clusterField = DataFieldFactory.getUndefined();
        clusterField.ctype = CollectionTypeEnum.UNDEFINED;
        clusterField.type = DataTypeEnum.FUNCTION;
        clusterField.label = AbstractScatterForm.CLUSTERING_ALGORITHM;

        const colorOptions = DataFieldFactory.getColorFields(fields);
        colorOptions.push(...[signatureField, clusterField]);

        this.colorOptions = colorOptions;
        this.shapeOptions = DataFieldFactory.getShapeFields(fields);
        this.sizeOptions = DataFieldFactory.getSizeFields(fields);
    }

    @Output() configChange = new EventEmitter<GraphConfig>();
    @Output() selectGeneSignature = new EventEmitter<GraphConfig>();
    @Output() selectClusteringAlgorithm = new EventEmitter<GraphConfig>();

    form: FormGroup;
    colorOptions: Array<DataField>;
    shapeOptions: Array<DataField>;
    sizeOptions: Array<DataField>;
    displayOptions = [EntityTypeEnum.SAMPLE, EntityTypeEnum.GENE];
    dataOptions: Array<DataTable>;
    dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];

    byKey(p1: DataField, p2: DataField) {
        if (p2 === null) { return false; }
        return p1.key === p2.key;
    }

    registerFormChange(): void {
        // Update When Form Changes
        this.form.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(data => {
                let dirty = 0;
                const form = this.form;
                if (form.get('pointColor').dirty) {
                    const pointColor = form.getRawValue().pointColor.label;
                    if (pointColor === AbstractScatterForm.CLUSTERING_ALGORITHM) {
                        this.selectClusteringAlgorithm.emit(data);
                        return;
                    }
                    if (pointColor === AbstractScatterForm.GENE_SIGNATURE) {
                        this.selectGeneSignature.emit(data);
                        return;
                    }
                    dirty |= DirtyEnum.COLOR; }
                if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
                if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
                if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
                form.markAsPristine();
                data.dirtyFlag = dirty;
                this.configChange.emit(data);
            });
    }
    constructor() {}
}
