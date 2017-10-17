import { DimensionEnum } from './../../model/enum.model';
import { FormGroup } from '@angular/forms';
import { GraphConfig } from './../../model/graph-config.model';
import { Input, Output, EventEmitter } from '@angular/core';
import { CollectionTypeEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataTable } from './../../model/data-field.model';
import { DataFieldFactory } from 'app/model/data-field.model';
export class AbstractScatterForm {
    
    @Input() set tables(tables: Array<DataTable>) {
        this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
    }

    @Input() set fields(fields: Array<DataField>) {
        if (fields.length === 0) { return; }
        const defaultDataField: DataField = DataFieldFactory.getUndefined();
        this.colorOptions = DataFieldFactory.getColorFields(fields);
        this.shapeOptions = DataFieldFactory.getShapeFields(fields);
        this.sizeOptions = DataFieldFactory.getSizeFields(fields);
    }

    @Output() configChange = new EventEmitter<GraphConfig>();

    protected form: FormGroup;
    protected colorOptions: Array<DataField>;
    protected shapeOptions: Array<DataField>;
    protected sizeOptions: Array<DataField>;
    protected displayOptions = [EntityTypeEnum.SAMPLE, EntityTypeEnum.GENE];
    protected dataOptions: Array<DataTable>;
    protected dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];

    protected byKey(p1: DataField, p2: DataField) {
        if (p2 === null) { return false; }
        return p1.key === p2.key;
    }

    constructor() {}
}
