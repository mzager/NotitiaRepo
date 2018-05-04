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
  <mat-menu #visualizationLabelsMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of colorOptions' (click)='setColorOption(option)'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #visualizationColorsMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of shapeOptions' (click)='setShapeOption(option)'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #visualizationShapesMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of labelOptions' (click)='setLabelOption(option)'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #analysisMenu='matMenu'>
    <button mat-menu-item [matMenuTriggerFor]='visualizationLabelsMenu'>Labels</button>
    <button mat-menu-item [matMenuTriggerFor]='visualizationColorsMenu'>Colors</button>
    <button mat-menu-item [matMenuTriggerFor]='visualizationShapesMenu'>Shapes</button>
  </mat-menu>
  <button mat-button color='primary' [matMenuTriggerFor]='analysisMenu' style='width: 118px;'>Visualization</button>
  `
})
export class GraphPanelVisualizationComponent {

    @Output() decoratorAdd: EventEmitter<DataDecorator> = new EventEmitter();
    @Output() decoratorDel: EventEmitter<DataDecorator> = new EventEmitter();
    public clinicalColorOptions: Array<DataField>;
    public clinicalShapeOptions: Array<DataField>;
    // public clinicalSizeOptions: Array<DataField>;
    public clinicalLabelOptions: Array<DataField>;
    public molecularColorOptions: Array<DataField>;
    public molecularShapeOptions: Array<DataField>;
    // public molecularSizeOptions: Array<DataField>;
    public molecularLabelOptions: Array<DataField>;

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
        this.cd.markForCheck();
    }
    setColorOption(field: DataField): void {
        if (field.key === 'None') {
            this.decoratorDel.emit({ type: DataDecoratorTypeEnum.COLOR, values: null, field: null, legend: null });
        } else {
            this.decoratorAdd.emit({ type: DataDecoratorTypeEnum.COLOR, field: field, legend: null, values: null });
        }
    }
    setShapeOption(field: DataField): void {
        if (field.key === 'None') {
            this.decoratorDel.emit({ type: DataDecoratorTypeEnum.SHAPE, values: null, field: null, legend: null });
        } else {
            this.decoratorAdd.emit({ type: DataDecoratorTypeEnum.SHAPE, field: field, legend: null, values: null });
        }
    }
    setLabelOption(field: DataField): void {
        if (field.key === 'None') {
            this.decoratorDel.emit({ type: DataDecoratorTypeEnum.LABEL, values: null, field: null, legend: null });
        } else {
            this.decoratorAdd.emit({ type: DataDecoratorTypeEnum.LABEL, field: field, legend: null, values: null });
        }
    }

    constructor(private cd: ChangeDetectorRef) { }
}
