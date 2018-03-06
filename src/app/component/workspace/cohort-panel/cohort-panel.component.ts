import { Cohort, CohortCondition } from './../../../model/cohort.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
  Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;

@Component({
  selector: 'app-workspace-cohort-panel',
  styleUrls: ['./cohort-panel.component.scss'],
  template: `<div>
  <a href='#' class='modalClose' (click)='closeClick()'></a>
  <h1>Cohorts</h1>
  <h2>Create, Manage and Apply custom cohorts to your visualizations <a href='' target='_blank'><i class='small material-icons modalWatchVideoIcon'>ondemand_video</i>Watch Tutorial</a></h2>
  <div class='row'>
    <!-- My Cohorts -->
    <div class='col s3' style='border: 0px solid #EEE; border-right-width: 1px;padding-left: 0px;padding-right: 30px;'>
      <span class='cohortHeader'>My Cohorts</span>
      <div *ngFor='let myCohort of cohorts'>
      <div class='cohortMyRow' (click)='removeClick(myCohort)'>
        <i class='material-icons cohortMyRowDelete'>remove_circle_outline</i>
        <span class='cohortMyRowname'>{{myCohort.n}}</span>
      </div>
      </div>
    </div>
    <div class='col s9' style='padding-left:30px;padding-right:30px;'>
      <span class='cohortHeader' style='padding-bottom:20px;'>Build A Cohort</span>
      <div class='cohortField'>
        <label for='cohortName'>Create</label>
        <input id='cohortName' type='text' placeholder='Enter Cohort Name'
          style='margin-bottom:5px;border-color:#EEE;width:293px;padding-left: 6px;'>
      </div>

      <div class='cohortField' [class.cohortFieldOr]='condition.condition==="or"' *ngFor='let condition of activeCohort.conditions'>
        <label>{{condition.condition}}</label>
        <select class='cohortFieldDropdown browser-default' [(ngModel)]='condition.field' materialize='material_select'>
          <option *ngFor='let option of fields' [ngValue]='option'>{{option.name}}</option>
        </select>
        <select *ngIf='condition.field.type==="category"'
          class='cohortFieldDropdown browser-default' [(ngModel)]='condition.value' materialize='material_select'>
          <option *ngFor='let option of condition.field.options' [ngValue]='option.value'>{{option.name}}</option>
        </select>
        <span *ngIf='condition.field.type==="number"'>
          <input type='number' [(ngModel)]='condition.min'
            placeholder='Min'
            style='margin-bottom:5px;border-color:#EEE;width:65px;padding-left: 6px;'>
          <input type='number' [(ngModel)]='condition.max'
            placeholder='Max'
            style='margin-bottom:5px;border-color:#EEE;width:65px;padding-left: 6px;'>
        </span>

        <div class='cohortFieldButtons'>
          <a href='#' (click)='fieldAnd(condition)'>And</a> |
          <a href='#' (click)='fieldOr(condition)'>Or</a>
          <span *ngIf='condition.condition !== "where"'> | 
            <a href='#' (click)='fieldDel(condition)'>Remove</a>
          </span>
        </div>

      </div>

      <div>
        <a class='cohortFieldLabel' style='border: 2px solid #039be5; margin-top: 10px;' href='#'
          (click)='saveClick()'>Save</a>
      </div>

    </div>
  </div>
</div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CohortPanelComponent implements AfterViewInit {

  @Input() cohorts: Array<Cohort> = [];
  @Output() addCohort: EventEmitter<{ database: string, cohort: Cohort }> = new EventEmitter();
  @Output() delCohort: EventEmitter<{ database: string, cohort: Cohort }> = new EventEmitter();
  @Output() queryCohort: EventEmitter<{ database: string, cohort: Cohort }> = new EventEmitter();
  
  fields: Array<{ name: string, type: 'number' | 'category', options?: Array<{ name: string, value?: string, min?: number, max?: number }> }>;
  defaultField: CohortCondition;
  activeCohort: Cohort;
  @Output() hide: EventEmitter<any> = new EventEmitter();

  private _config: GraphConfig;
  get config():GraphConfig { return this._config; }
  @Input() set config(config: GraphConfig) {
    this.dataService.getQueryBuilderConfig(config.database).then(result => {
      this.fields = Object.keys(result.fields).map(v => result.fields[v]);
      if (this.fields[0].type === 'category') {
        this.defaultField = { field: this.fields[0], value: this.fields[0].options[0].value, condition: 'where' };
      }
      if (this.fields[0].type === 'number') {
        this.defaultField = { field: this.fields[0], min: null, max: null, condition: 'where' };
      }
      this.resetForm();
    });
  }

  ngAfterViewInit(): void { }

  closeClick() {
    this.hide.emit();
  }

  isValid(): boolean { 
    return true;
  }

  saveClick() { 
    if (!this.isValid()) { 
      return;
    }
    this.addCohort.emit({cohort: this.activeCohort, database: this.config.database});
  }
  removeClick(cohort: Cohort):void { 
    this.delCohort.emit({database: this.config.database, cohort: cohort});
  }
  resetForm(): void {
    this.activeCohort.name = '';
    this.activeCohort.conditions.push(this.defaultField);
    this.cd.markForCheck();
  }

  fieldAnd(item: any): void {
    const newField = Object.assign({}, item);
    newField.condition = 'and';
    this.activeCohort.conditions.push(newField);
    this.cd.markForCheck();
  }

  fieldOr(item: any): void {
    const insIndex = this.activeCohort.conditions.indexOf(item);
    const newField = Object.assign({}, item);
    newField.condition = 'or';
    this.activeCohort.conditions.splice(insIndex + 1, 0, newField);
    this.cd.markForCheck();
  }

  fieldDel(item: any): void {
    const delIndex = this.activeCohort.conditions.indexOf(item);
    this.activeCohort.conditions.splice(delIndex, 1);
    this.cd.markForCheck();
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {
    this.activeCohort = { name: '', patientIds: [], sampleIds: [], conditions: [] };
  }

}
