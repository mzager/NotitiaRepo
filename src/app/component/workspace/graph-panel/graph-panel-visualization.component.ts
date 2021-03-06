import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { DataTable } from 'app/model/data-field.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { EntityTypeEnum, DataTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';

@Component({
  selector: 'app-graph-panel-visualization',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-form-field class="form-field" *ngIf="config.enableLabel">
      <mat-select
        placeholder="Label Options"
        (selectionChange)="setLabelOption($event)"
        [(value)]="labelSelected"
        [compareWith]="byKey"
      >
        <mat-option *ngFor="let option of labelOptions" [value]="option"> {{ option.label }} </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="form-field" *ngIf="config.enableColor">
      <mat-select
        placeholder="Color Options"
        (selectionChange)="setColorOption($event)"
        [(value)]="colorSelected"
        [compareWith]="byKey"
      >
        <button mat-button style="color:#1e88e5;width:100%;" (click)="customizeColorOptions()">
          <mat-icon class="material-icons md-18" style="transform:translate(0px, 2px);margin-right:0px;"
            >settings</mat-icon
          >Modify List
        </button>
        <mat-option *ngFor="let option of colorOptions" [value]="option"> {{ option.label }} </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="form-field" *ngIf="config.enableShape">
      <mat-select
        placeholder="Shape Options"
        (selectionChange)="setShapeOption($event)"
        [(value)]="shapeSelected"
        [compareWith]="byKey"
      >
        <mat-option *ngFor="let option of shapeOptions" [value]="option"> {{ option.label }} </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="form-field" *ngIf="config.enableSize">
      <mat-select
        placeholder="Size Options"
        (selectionChange)="setSizeOption($event)"
        [(value)]="sizeSelected"
        [compareWith]="byKey"
      >
        <mat-option *ngFor="let option of sizeOptions" [value]="option"> {{ option.label }} </mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class GraphPanelVisualizationComponent {
  @Output()
  decoratorAdd: EventEmitter<{
    config: GraphConfig;
    decorator: DataDecorator;
  }> = new EventEmitter();

  @Output()
  decoratorDel: EventEmitter<{
    config: GraphConfig;
    decorator: DataDecorator;
  }> = new EventEmitter();

  public nClusters = 3;
  public clinicalColorOptions: Array<DataField>;
  public clinicalShapeOptions: Array<DataField>;
  public clinicalSizeOptions: Array<DataField>;
  public clinicalLabelOptions: Array<DataField>;
  public molecularColorOptions: Array<DataField>;
  public molecularShapeOptions: Array<DataField>;
  public molecularSizeOptions: Array<DataField>;
  public molecularLabelOptions: Array<DataField>;
  public colorSelected: DataField;
  public labelSelected: DataField;
  public shapeSelected: DataField;
  public sizeSelected: DataField;
  public colorOptions: Array<DataField>;
  public shapeOptions: Array<DataField>;
  public sizeOptions: Array<DataField>;
  public labelOptions: Array<DataField>;

  private _decorators: Array<DataDecorator> = [];
  @Input()
  set decorators(value: Array<DataDecorator>) {
    if (value === null) {
      return;
    }
    this._decorators = value;
  }

  private _config: GraphConfig;
  public get config(): GraphConfig {
    return this._config;
  }
  @Input()
  public set config(config: GraphConfig) {
    if (!this._config) {
      this._config = config;
      this.updateFields();
    } else if (this._config.entity !== config.entity) {
      this._config = config;
      this.updateFields();
    }
  }
  @Input()
  set tables(tables: Array<DataTable>) {
    this.molecularColorOptions = DataFieldFactory.getMolecularColorFields(tables);
    this.molecularShapeOptions = DataFieldFactory.getMolecularShapeFields(tables);
    this.molecularSizeOptions = DataFieldFactory.getMolecularSizeFields(tables);
    this.molecularLabelOptions = DataFieldFactory.getMolecularLabelOptions(tables);
    this.updateFields();
  }
  @Input()
  set fields(fields: Array<DataField>) {
    this.clinicalColorOptions = DataFieldFactory.getSampleColorFields(fields);
    this.clinicalShapeOptions = DataFieldFactory.getSampleShapeFields(fields);
    this.clinicalSizeOptions = DataFieldFactory.getSampleSizeFields(fields);
    this.clinicalLabelOptions = DataFieldFactory.getSampleLabelFields(fields);
    this.updateFields();
  }
  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) {
      return false;
    }
    return p1.label === p2.label;
  }
  customizeColorOptions(): void {
    alert('hi');
  }
  updateFields(): void {
    if (!this._config || !this.molecularColorOptions || !this.clinicalColorOptions) {
      return;
    }
    if (this.config.entity === EntityTypeEnum.GENE) {
      this.colorOptions = this.molecularColorOptions;
      this.shapeOptions = this.molecularShapeOptions;
      this.sizeOptions = this.molecularSizeOptions;
      this.labelOptions = this.molecularLabelOptions;
    } else {
      this.colorOptions = this.clinicalColorOptions;
      this.shapeOptions = this.clinicalShapeOptions;
      this.sizeOptions = this.clinicalSizeOptions;
      this.labelOptions = this.clinicalLabelOptions;
    }
    this.colorSelected = DataFieldFactory.getUndefined();
    this.shapeSelected = DataFieldFactory.getUndefined();
    this.sizeSelected = DataFieldFactory.getUndefined();
    this.labelSelected = DataFieldFactory.getUndefined();
  }

  setColorOption(event: MatSelectChange): void {
    this.colorSelected = event.value;
    if (this.colorSelected.key === 'None') {
      this.decoratorDel.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.COLOR,
          values: null,
          field: null,
          legend: null
        }
      });
    } else {
      this.decoratorAdd.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.COLOR,
          field: this.colorSelected,
          legend: null,
          values: null
        }
      });
    }
  }
  setShapeOption(event: MatSelectChange): void {
    this.shapeSelected = event.value;
    if (this.shapeSelected.key === 'None') {
      this.decoratorDel.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.SHAPE,
          values: null,
          field: null,
          legend: null
        }
      });
    } else {
      this.decoratorAdd.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.SHAPE,
          field: this.shapeSelected,
          legend: null,
          values: null
        }
      });
    }
  }
  setSizeOption(event: MatSelectChange): void {
    this.sizeSelected = event.value;
    if (this.sizeSelected.key === 'None') {
      this.decoratorDel.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.SIZE,
          values: null,
          field: null,
          legend: null
        }
      });
    } else {
      this.decoratorAdd.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.SIZE,
          field: this.sizeSelected,
          legend: null,
          values: null
        }
      });
    }
  }
  setLabelOption(event: MatSelectChange): void {
    this.labelSelected = event.value;
    if (this.labelSelected.key === 'None') {
      this.decoratorDel.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.LABEL,
          values: null,
          field: null,
          legend: null
        }
      });
    } else {
      this.decoratorAdd.emit({
        config: this.config,
        decorator: {
          type: DataDecoratorTypeEnum.LABEL,
          field: this.labelSelected,
          legend: null,
          values: null
        }
      });
    }
  }

  setNClusters(num: number) {
    this.nClusters = num;
  }
  applyCluster(type: string) {
    this.decoratorAdd.emit({
      config: this.config,
      decorator: {
        type: DataDecoratorTypeEnum.CLUSTER_MINIBATCHKMEANS,
        field: {
          key: this.nClusters.toString(),
          label: this.nClusters.toString(),
          type: DataTypeEnum.FUNCTION,
          tbl: 'na',
          values: 'na',
          ctype: CollectionTypeEnum.UNDEFINED
        },
        legend: null,
        values: null
      }
    });
  }
  constructor(private cd: ChangeDetectorRef) {}
}
