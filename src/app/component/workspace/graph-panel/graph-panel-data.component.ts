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
  <!--<mat-menu #dataCohortsMenu='dataTablesMenu'></mat-menu>-->
  <mat-menu #dataCohortsMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of colorOptions' (click)='setColorOption(option)'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #dataGenesetsMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of shapeOptions' (click)='setShapeOption(option)'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #dataPathwaysMenu='matMenu'>
    <button mat-menu-item *ngFor='let option of labelOptions' (click)='setLabelOption(option)'>{{option.label}}</button>
  </mat-menu>
  <mat-menu #analysisMenu='matMenu'>
    <button mat-menu-item [matMenuTriggerFor]='dataCohortsMenu'>Cohorts</button>
    <button mat-menu-item [matMenuTriggerFor]='dataGenesetsMenu'>Gene Ses</button>
    <button mat-menu-item [matMenuTriggerFor]='dataPathwaysMenu'>Pathways</button>
    <!--<button mat-menu-item [matMenuTriggerFor]='dataTablesMenu'>Data Tables</button>-->
    <button mat-menu-item>Data Sets</button>
  </mat-menu>
  <button mat-raised-button [matMenuTriggerFor]='analysisMenu' style='width: 118px;'>Data</button>
  `
})
export class GraphPanelDataComponent {
  public colorOptions = [];
  public shapeOptions = [];
  public labelOptions = [];

  constructor(private cd: ChangeDetectorRef) { }
}
