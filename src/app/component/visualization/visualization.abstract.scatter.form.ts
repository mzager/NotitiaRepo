import { AbstractScatterVisualization } from './visualization.abstract.scatter.component';
import { DimensionEnum } from './../../model/enum.model';
import { FormGroup } from '@angular/forms';
import { GraphConfig } from './../../model/graph-config.model';
import { Input, Output, EventEmitter } from '@angular/core';
import { CollectionTypeEnum, EntityTypeEnum, DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataTable } from './../../model/data-field.model';
import { DataFieldFactory } from 'app/model/data-field.model';
export class AbstractScatterForm {

    PcOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    @Input() fields: Array<DataField>;
    @Input() set tables(tables: Array<DataTable>) {
        this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
    }

    @Output() configChange = new EventEmitter<GraphConfig>();
    @Output() selectGeneSignature = new EventEmitter<GraphConfig>();
    @Output() selectClusteringAlgorithm = new EventEmitter<GraphConfig>();

    form: FormGroup;
    displayOptions = [EntityTypeEnum.SAMPLE, EntityTypeEnum.GENE];
    dataOptions: Array<DataTable>;
    dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];

    byTbl(p1: any, p2: any) {
        if (p2 === null) { return false; }
        return p1.tbl === p2.tbl;
    }
    byKey(p1: DataField, p2: DataField) {
        if (p2 === null) { return false; }
        return p1.key === p2.key;
    }
    byLbl(p1: DataField, p2: DataField) {
        if (p2 === null) { return false; }
        return p1.label === p2.label;
    }

    registerFormChange(): void {
        this.form.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(data => {
                const form = this.form;
                form.markAsPristine();
                this.configChange.emit(data);
            });
    }
    constructor() { }
}
