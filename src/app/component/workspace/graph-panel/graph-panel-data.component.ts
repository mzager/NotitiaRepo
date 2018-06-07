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
  <mat-form-field class='form-field' *ngIf='config.enableCohorts'>
  <mat-select placeholder='Cohort' (selectionChange)='setCohortOption($event)'
      [value]='cohortSelected' [compareWith]='byCohortName'>
      <mat-option value='CUSTOM' class='os-link'>
        <mat-icon class='material-icons md-18' style='transform:translate(0px, 2px);margin-right:0px;'>settings</mat-icon>Create Cohort
      </mat-option>
      <mat-option *ngFor='let option of cohortOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
  </mat-select>
</mat-form-field>
<mat-form-field class='form-field' *ngIf='config.enableGenesets'>
  <mat-select placeholder='Geneset' (selectionChange)='setGenesetOption($event)'
      [value]='genesetSelected' [compareWith]='byName'>
      <mat-option value='CUSTOM' class='os-link'>
        <mat-icon class='material-icons md-18' style='transform:translate(0px, 2px);margin-right:0px;'>settings</mat-icon>Customize List
      </mat-option>
      <mat-option *ngFor='let option of genesetOptions' [value]='option'>
          {{ option.n }}
      </mat-option>
  </mat-select>
</mat-form-field>
<mat-form-field class='form-field' *ngIf='config.enablePathways'>
  <mat-select placeholder='Pathway' (selectionChange)='setPathwayOption($event)'
      [value]='pathwaySelected' [compareWith]='byName'>
      <mat-option value='CUSTOM' class='os-link'>
      <mat-icon class='material-icons md-18' style='transform:translate(0px, 2px);margin-right:0px;'>settings</mat-icon>Customize List
      </mat-option>
      <mat-option *ngFor='let option of pathwayOptions' [value]='option'>
          {{ option.n }}
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
    this._config = config;
  }
  @Input() set pathways(v: Array<Pathway>) {
    this.pathwayOptions = v;
    this.pathwaySelected = this.pathwayOptions[0];
  }
  @Input() set cohorts(v: Array<Cohort>) {
    this.cohortOptions = v;
    this.cohortSelected = this.cohortOptions[0];
  }
  @Input() set genesets(v: Array<GeneSet>) {
    this.genesetOptions = v;
    this.genesetSelected = this.genesetOptions[0];
  }

  byCohortName(p1: any, p2: any) {
    // debugger;
    if (p2 === null) { return false; }
    return p1.n === p2.n;
  }
  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.n === p2.n;
  }
  public customClick(): void {
    console.log("CC");
  }
  public setPathwayOption(e: MatSelectChange): void {
    if (e.value === 'CUSTOM') {

      this.pathwaySelected = this.pathwayOptions.find(v => v.n === this.config.pathwayName);
      this.cd.detectChanges();

      this.showPanel.emit(PanelEnum.PATHWAYS);
      return;
    }
    if (this.config.pathwayName === e.value.n) {
      return;
    }
    this.config.pathwayUri = e.value.uri;
    this.config.pathwayName = e.value.n;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  public setGenesetOption(e: MatSelectChange): void {
    if (e.value === 'CUSTOM') {
      this.genesetSelected = this.genesetOptions.find(v => v.n === this.config.markerName);
      this.cd.detectChanges();
      this.showPanel.emit(PanelEnum.GENESET);
      return;
    }
    if (this.config.markerName === e.value.n) {
      return;
    }
    this.config.markerName = e.value.n;
    this.config.markerFilter = e.value.g;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);

  }
  public setCohortOption(e: MatSelectChange): void {
    if (e.value === 'CUSTOM') {

      this.cohortSelected = this.cohortOptions.find(v => v.n === this.config.cohortName);
      // this.cd.detectChanges();
      this.cd.markForCheck();


      this.showPanel.emit(PanelEnum.COHORT);
      return;
    }
    if (this.config.cohortName === e.value.n) {
      return;
    }
    console.log('Config Change');
    this.config.cohortName = e.value.n;
    this.config.patientFilter = e.value.pids;
    this.config.sampleFilter = e.value.sids;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  constructor(private cd: ChangeDetectorRef) { }
}
