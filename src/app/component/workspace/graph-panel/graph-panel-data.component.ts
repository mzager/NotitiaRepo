import { Pathway } from './../../../model/pathway.model';
import { CollectionTypeEnum } from 'app/model/enum.model';
import { GeneSet } from './../../../model/gene-set.model';
import { Cohort } from './../../../model/cohort.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataTable } from 'app/model/data-field.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-graph-panel-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <mat-form-field class='form-field-1-3'>
  <mat-select placeholder='Cohort' (selectionChange)='setLabelOption($event)'
      [(value)]='cohortSelected' [compareWith]='byName'>
      <mat-option *ngFor='let option of cohortOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
  </mat-select>
</mat-form-field>
<mat-form-field class='form-field-1-3'>
  <mat-select placeholder='Geneset' (selectionChange)='setColorOption($event)'
      [(value)]='genesetSelected' [compareWith]='byName'>
      <mat-option *ngFor='let option of genesetOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
  </mat-select>
</mat-form-field>
<mat-form-field class='form-field-1-3' >
  <mat-select placeholder='Pathway' (selectionChange)='setShapeOption($event)'
      [(value)]='pathwaySelected' [compareWith]='byName'>
      <mat-option *ngFor='let option of pathwayOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
  </mat-select>
</mat-form-field>
  `
})
export class GraphPanelDataComponent {

  public cohortOptions = [];
  public genesetOptions = [];
  public pathwayOptions = [];
  public cohortSelected: Cohort;
  public genesetSelected: GeneSet;
  public pathwaySelected: Pathway;
  public cohortOptionsVisible = true;
  public genesetOptionsVisible = true;
  public pathwayOptionsVisible = true;

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
  @Input() set pathways(v: Array<Pathway>) {
    this.pathwayOptions = v;
    this.pathwaySelected = this.pathwayOptions[0];
    this.cd.markForCheck();
  }
  @Input() set cohorts(v: Array<Cohort>) {
    this.cohortOptions = v;
    this.cohortSelected = this.cohortOptions[0];
    this.cd.markForCheck();

  }
  @Input() set genesets(v: Array<GeneSet>) {
    this.genesetOptions = v;
    this.genesetSelected = this.genesetOptions[0];
    this.cd.markForCheck();

  }
  updateFields(): void {
    if (!this._config) { return; }
    this.cd.markForCheck();
  }

  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.n === p2.n;
  }
  constructor(private cd: ChangeDetectorRef) { }
}
