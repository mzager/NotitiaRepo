import { MatSelectChange } from '@angular/material';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataTable } from 'app/model/data-field.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'app-graph-panel-visualization',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <mat-form-field class='form-field-1-3'>
        <mat-select placeholder='Label' (selectionChange)='setLabelOption($event)'
            [(value)]='labelSelected' [compareWith]='byKey'>
            <mat-option *ngFor='let option of labelOptions' [value]='option'>
                {{ option.label }}
            </mat-option>
        </mat-select>
    </mat-form-field>
    <mat-form-field class='form-field-1-3'>
        <mat-select placeholder='Color' (selectionChange)='setColorOption($event)'
            [(value)]='colorSelected' [compareWith]='byKey'>
            <mat-option *ngFor='let option of colorOptions' [value]='option'>
                {{ option.label }}
            </mat-option>
        </mat-select>
    </mat-form-field>
    <mat-form-field class='form-field-1-3'>
        <mat-select placeholder='Shape' (selectionChange)='setShapeOption($event)'
            [(value)]='shapeSelected' [compareWith]='byKey'>
            <mat-option *ngFor='let option of shapeOptions' [value]='option'>
                {{ option.label }}
            </mat-option>
        </mat-select>
    </mat-form-field>
  `
})
export class GraphPanelVisualizationComponent {

    @Output() decoratorAdd: EventEmitter<{ config: GraphConfig, decorator: DataDecorator }> = new EventEmitter();
    @Output() decoratorDel: EventEmitter<{ config: GraphConfig, decorator: DataDecorator }> = new EventEmitter();
    public clinicalColorOptions: Array<DataField>;
    public clinicalShapeOptions: Array<DataField>;
    // public clinicalSizeOptions: Array<DataField>;
    public clinicalLabelOptions: Array<DataField>;
    public molecularColorOptions: Array<DataField>;
    public molecularShapeOptions: Array<DataField>;
    // public molecularSizeOptions: Array<DataField>;
    public molecularLabelOptions: Array<DataField>;
    public colorSelected: DataField;
    public labelSelected: DataField;
    public shapeSelected: DataField;
    public colorOptions: Array<DataField>;
    public shapeOptions: Array<DataField>;
    public sizeOptions: Array<DataField>;
    public labelOptions: Array<DataField>;



    private _decorators: Array<DataDecorator> = [];
    @Input() set decorators(value: Array<DataDecorator>) {
        if (value === null) { return; }
        this._decorators = value;
    }

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
        // this.molecularSizeOptions = DataFieldFactory.getMolecularSizeFields(tables);
        this.molecularLabelOptions = DataFieldFactory.getMolecularLabelOptions(tables);
        this.updateFields();
    }
    @Input() set fields(fields: Array<DataField>) {
        this.clinicalColorOptions = DataFieldFactory.getSampleColorFields(fields);
        this.clinicalShapeOptions = DataFieldFactory.getSampleShapeFields(fields);
        // this.clinicalSizeOptions = DataFieldFactory.getSampleSizeFields(fields);
        this.clinicalLabelOptions = DataFieldFactory.getSampleLabelFields(fields);
        this.updateFields();
    }
    byKey(p1: DataField, p2: DataField) {
        if (p2 === null) { return false; }
        return p1.label === p2.label;
    }
    updateFields(): void {
        if (!this._config || !this.molecularColorOptions || !this.clinicalColorOptions) { return; }
        if (this.config.entity === EntityTypeEnum.GENE) {
            this.colorOptions = this.molecularColorOptions;
            this.shapeOptions = this.molecularShapeOptions;
            // this.sizeOptions = this.molecularSizeOptions;
            this.labelOptions = this.molecularLabelOptions;
        } else {
            this.colorOptions = this.clinicalColorOptions;
            this.shapeOptions = this.clinicalShapeOptions;
            // this.sizeOptions = this.clinicalSizeOptions;
            this.labelOptions = this.clinicalLabelOptions;
        }
        this.colorSelected = DataFieldFactory.getUndefined();
        this.shapeSelected = DataFieldFactory.getUndefined();
        this.labelSelected = DataFieldFactory.getUndefined();
        this.cd.markForCheck();
    }

    setColorOption(event: MatSelectChange): void {
        this.colorSelected = event.value;
        if (this.colorSelected.key === 'None') {
            this.decoratorDel.emit({
                config: this.config,
                decorator: { type: DataDecoratorTypeEnum.COLOR, values: null, field: null, legend: null }
            });
        } else {
            this.decoratorAdd.emit({
                config: this.config,
                decorator: { type: DataDecoratorTypeEnum.COLOR, field: this.colorSelected, legend: null, values: null }
            });
        }
    }
    setShapeOption(event: MatSelectChange): void {
        this.shapeSelected = event.value;
        if (this.shapeSelected.key === 'None') {
            this.decoratorDel.emit({
                config: this.config,
                decorator: { type: DataDecoratorTypeEnum.SHAPE, values: null, field: null, legend: null }
            });
        } else {
            this.decoratorAdd.emit({
                config: this.config,
                decorator: { type: DataDecoratorTypeEnum.SHAPE, field: this.shapeSelected, legend: null, values: null }
            });
        }
    }
    setLabelOption(event: MatSelectChange): void {
        this.labelSelected = event.value;
        if (this.labelSelected.key === 'None') {
            this.decoratorDel.emit({
                config: this.config,
                decorator: { type: DataDecoratorTypeEnum.LABEL, values: null, field: null, legend: null }
            });
        } else {
            this.decoratorAdd.emit({
                config: this.config,
                decorator: { type: DataDecoratorTypeEnum.LABEL, field: this.labelSelected, legend: null, values: null }
            });
        }
    }

    constructor(private cd: ChangeDetectorRef) { }
}
