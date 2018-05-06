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
  <mat-menu #dataVisualizeMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of visualizationOptions'>{{option}}</button>
  </mat-menu>
  <mat-menu #dataTableMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of tableOptions'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #dataCohortsMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of cohortOptions'>{{option.n}}</button>
  </mat-menu>
  <mat-menu #dataGenesetsMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of genesetOptions'>{{option.n}}</button>
  </mat-menu>
  <mat-menu #dataPathwaysMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of pathwayOptions'>{{option.n}}</button>
  </mat-menu>
  <mat-menu #analysisMenu='matMenu'>
    <button mat-menu-item [matMenuTriggerFor]='dataTableMenu'>Table</button>
    <button mat-menu-item [matMenuTriggerFor]='dataVisualizeMenu'>Visualize</button>
    <button mat-menu-item [matMenuTriggerFor]='dataCohortsMenu'>Cohort</button>
    <button mat-menu-item [matMenuTriggerFor]='dataGenesetsMenu'>Gene Set</button>
    <button mat-menu-item [matMenuTriggerFor]='dataPathwaysMenu'>Pathway</button>
  </mat-menu>
  <button mat-button [matMenuTriggerFor]='analysisMenu' style='width: 118px;'>Data</button>
  `
})
export class GraphPanelDataComponent {
  public visualizationOptions = [EntityTypeEnum.SAMPLE, EntityTypeEnum.GENE];
  public tableOptions = [];
  public cohortOptions = [];
  public genesetOptions = [];
  public pathwayOptions = [];
  @Input() set config(v: GraphConfig) {
  }
  @Input() set tables(tbls: Array<DataTable>) {
    this.tableOptions = tbls.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }
  @Input() set pathways(v: Array<Pathway>) {
    this.pathwayOptions = v;
  }
  @Input() set fields(v: Array<DataField>) {

  }
  @Input() set cohorts(v: Array<Cohort>) {
    this.cohortOptions = v;
  }
  @Input() set genesets(v: Array<GeneSet>) {
    this.genesetOptions = v;
  }
  constructor(private cd: ChangeDetectorRef) { }
}
