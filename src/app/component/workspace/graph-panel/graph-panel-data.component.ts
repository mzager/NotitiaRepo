import { MatSelectChange } from '@angular/material';
import { Pathway } from './../../../model/pathway.model';
import { CollectionTypeEnum, DirtyEnum, PanelEnum } from 'app/model/enum.model';
import { GeneSet } from './../../../model/gene-set.model';
import { Cohort } from './../../../model/cohort.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataTable } from 'app/model/data-field.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-graph-panel-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
  <mat-form-field class='form-field-1-2'>
  <mat-select placeholder='Cohort' (selectionChange)='setCohortOption($event)'
      [value]='cohortSelected' [compareWith]='byName'>
      <mat-option *ngFor='let option of cohortOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
      <mat-option [value]='customize'>
        Customize List
      </mat-option>
  </mat-select>
</mat-form-field>
<mat-form-field class='form-field-1-2'>
  <mat-select placeholder='Geneset' (selectionChange)='setGenesetOption($event)'
      [value]='genesetSelected' [compareWith]='byName'>
      <mat-option *ngFor='let option of genesetOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
      <mat-option [value]='customize'>
        Customize List
      </mat-option>
  </mat-select>
</mat-form-field>
<mat-form-field class='form-field' >
  <mat-select placeholder='Pathway' (selectionChange)='setPathwayOption($event)'
      [value]='pathwaySelected' [compareWith]='byName'>
      <mat-option *ngFor='let option of pathwayOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
      <mat-option [value]='customize'>
        Customize List
      </mat-option>
  </mat-select>
</mat-form-field>
  `
})
export class GraphPanelDataComponent {

  @Output() showPanel: EventEmitter<PanelEnum> = new EventEmitter();
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();
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

  public setPathwayOption(e: MatSelectChange): void {
    if (e.value === undefined) {
      this.showPanel.emit(PanelEnum.PATHWAYS);
      return;
    }
  }
  public setGenesetOption(e: MatSelectChange): void {
    if (e.value === undefined) {
      this.showPanel.emit(PanelEnum.GENESET);
      return;
    }
    this.config.markerFilter = e.value.g;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);

  }
  public setCohortOption(e: MatSelectChange): void {
    if (e.value === undefined) {
      this.showPanel.emit(PanelEnum.COHORT);
      return;
    }
    this.config.patientFilter = e.value.pids;
    this.config.sampleFilter = e.value.sids;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  constructor(private cd: ChangeDetectorRef) { }
}
