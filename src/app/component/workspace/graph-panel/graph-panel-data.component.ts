import { Preprocessing } from './../../../model/preprocessing.model';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material';
import { GraphConfig } from 'app/model/graph-config.model';
import { DirtyEnum, PanelEnum } from '../../../model/enum.model';
import { Cohort } from './../../../model/cohort.model';
import { GeneSet } from './../../../model/gene-set.model';
import { Pathway } from './../../../model/pathway.model';

@Component({
  selector: 'app-graph-panel-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-form-field class="form-field" *ngIf="config.enableCohorts">
      <mat-select
        #cohortSelectComponent
        placeholder="Cohort"
        (selectionChange)="setCohortOption($event)"
        [value]="cohortSelected"
        [compareWith]="byName"
      >
        <button mat-button style="color:#1e88e5;width:100%;" (click)="customizeCohorts($event)">
          <mat-icon class="material-icons md-18" style="transform:translate(0px, 2px);margin-right:0px;"
            >settings</mat-icon
          >Modify List
        </button>
        <mat-option *ngFor="let option of cohortOptions" [value]="option"> {{ option.n }} </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="form-field" *ngIf="config.enableGenesets">
      <mat-select
        #genesetSelectComponent
        placeholder="Geneset"
        (selectionChange)="setGenesetOption($event)"
        [value]="genesetSelected"
        [compareWith]="byName"
      >
        <button mat-button style="color:#1e88e5;width:100%;" (click)="customizeGenesets()">
          <mat-icon class="material-icons md-18" style="transform:translate(0px, 2px);margin-right:0px;"
            >settings</mat-icon
          >Modify List
        </button>
        <mat-option *ngFor="let option of genesetOptions" [value]="option"> {{ option.n }} </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="form-field" *ngIf="config.enablePathways">
      <mat-select
        #pathwaySelectComponent
        placeholder="Pathway"
        (selectionChange)="setPathwayOption($event)"
        [value]="pathwaySelected"
        [compareWith]="byName"
      >
        <button mat-button style="color:#1e88e5;width:100%;" (click)="customizePathways()">
          <mat-icon class="material-icons md-18" style="transform:translate(0px, 2px);margin-right:0px;"
            >settings</mat-icon
          >Modify List
        </button>
        <mat-option *ngFor="let option of pathwayOptions" [value]="option"> {{ option.n }} </mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field class="form-field" *ngIf="config.enablePreprocessing">
      <mat-select
        #preprocessingSelectComponent
        placeholder="Data Pipeline"
        (selectionChange)="setPreprocessingOption($event)"
        [value]="preprocessingSelected"
        [compareWith]="byName"
      >
        <button mat-button style="color:#1e88e5;width:100%;" (click)="customizePreprocessing()">
          <mat-icon class="material-icons md-18" style="transform:translate(0px, 2px);margin-right:0px;"
            >settings</mat-icon
          >Modify List
        </button>
        <mat-option *ngFor="let option of preprocessingOptions" [value]="option"> {{ option.n }} </mat-option>
      </mat-select>
    </mat-form-field>
  `
})
export class GraphPanelDataComponent {
  @ViewChild('cohortSelectComponent')
  cohortSelectComponent: MatSelect;
  @ViewChild('genesetSelectComponent')
  genesetSelectComponent: MatSelect;
  @ViewChild('preprocessingSelectComponent')
  preprocessingSelectComponent: MatSelect;
  @ViewChild('pathwaySelectComponent')
  pathwaySelectComponent: MatSelect;

  @Output()
  showPanel: EventEmitter<PanelEnum> = new EventEmitter();
  @Output()
  configChange: EventEmitter<GraphConfig> = new EventEmitter();
  public cohortOptions = [];
  public genesetOptions = [];
  public preprocessingOptions = [];
  public pathwayOptions = [];
  // public proteinOptions = [];
  public cohortSelected: Cohort;
  public genesetSelected: GeneSet;
  public preprocessingSelected: Preprocessing;
  public pathwaySelected: Pathway;
  public cohortOptionsVisible = true;
  public genesetOptionsVisible = true;
  public pathwayOptionsVisible = true;

  private _config: GraphConfig;
  public get config(): GraphConfig {
    return this._config;
  }
  @Input()
  public set config(config: GraphConfig) {
    this._config = config;
  }
  @Input()
  set pathways(v: Array<Pathway>) {
    this.pathwayOptions = v;
    this.pathwaySelected = this.pathwayOptions[1];
  }
  // @Input()
  // set proteins(v: Array<Protei>) {
  //   this.proteinOptions = v;
  //   this.proteinSelected = this.proteinOptions[0];
  // }
  @Input()
  set cohorts(v: Array<Cohort>) {
    this.cohortOptions = v;
    this.cohortSelected = this.cohortOptions[0];
  }
  @Input()
  set genesets(v: Array<GeneSet>) {
    this.genesetOptions = [{ n: 'All Genes', g: [] }, ...v];
    this.genesetSelected = this.genesetOptions[1];
  }
  @Input()
  set preprocessings(v: Array<GeneSet>) {
    this.preprocessingOptions = [Preprocessing.getUndefined(), ...v];
    this.preprocessingSelected = this.preprocessingOptions[0];
  }

  public customizeCohorts(e: any): void {
    if (this.cohortSelectComponent.panelOpen) {
      this.cohortSelectComponent.toggle();
    }
    this.showPanel.emit(PanelEnum.COHORT);
  }
  public customizeGenesets(): void {
    if (this.genesetSelectComponent.panelOpen) {
      this.genesetSelectComponent.toggle();
    }
    this.showPanel.emit(PanelEnum.GENESET);
  }
  public customizePathways(): void {
    if (this.pathwaySelectComponent.panelOpen) {
      this.pathwaySelectComponent.toggle();
    }
    this.showPanel.emit(PanelEnum.PATHWAYS);
  }
  public customizePreprocessing(): void {
    if (this.preprocessingSelectComponent.panelOpen) {
      this.preprocessingSelectComponent.toggle();
    }
    this.showPanel.emit(PanelEnum.PREPROCESSING);
  }

  byName(p1: any, p2: any) {
    if (p2 === null) {
      return false;
    }
    return p1.n === p2.n;
  }

  public setPathwayOption(e: MatSelectChange): void {
    if (this.config.pathwayName === e.value.n) {
      return;
    }
    this.config.pathwayUri = e.value.uri;
    this.config.pathwayName = e.value.n;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  public setGenesetOption(e: MatSelectChange): void {
    if (this.config.markerName === e.value.n) {
      return;
    }
    this.config.markerName = e.value.n;
    this.config.markerFilter = e.value.g;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  public setCohortOption(e: MatSelectChange): void {
    if (this.config.cohortName === e.value.n) {
      return;
    }
    this.config.cohortName = e.value.n;
    this.config.patientFilter = e.value.pids;
    this.config.sampleFilter = e.value.sids;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }

  public setPreprocessingOption(e: MatSelectChange): void {
    if (this.config.preprocessing.n === e.value.n) {
      return;
    }
    this.config.preprocessing = e.value;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  constructor(private cd: ChangeDetectorRef) {}
}
