import { Cohort, CohortCondition, CohortField } from './../../../model/cohort.model';
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
  template: `
  <div class='cohort-modal-panel'>
    <div class='row'>
        <a href='#' class='modalClose' (click)='closeClick()'></a>
        <div class="col s12">
        <h1 class='cohort-h1'>Cohorts</h1>
        <h2 class='cohort-h2'>Create, Manage and Apply custom cohorts to your visualizations
            <a href='https://www.youtube.com/embed/XQu8TTBmGhA' target='_blank'>
                <i class='small material-icons modalWatchVideoIcon'>ondemand_video</i>Watch Tutorial</a>
        </h2>
        </div>
    </div>
    <div class='row'>
        <!-- My Cohorts -->
        <div class='col s12 l3 cohort-my-list'>
            <span>My Cohorts</span>
            <div *ngFor='let myCohort of cohorts'>
                <div class='cohort-myRow' (click)='deleteClick(myCohort)'>
                    <i class='material-icons cohort-myRow-delete'>remove_circle_outline</i>
                    <span>{{myCohort.n}}</span>
                </div>
            </div>
        </div>
        <div class='col s12 l9 cohort-container'>
            <span class='cohort-span'>Build A Cohort</span>
            <div class='col s12 cohort-field '>
                <label for='cohortName'>Create</label>
                <input id='cohortName' type='text' placeholder='Enter Cohort Name' [(ngModel)]='activeCohort.n'>
            </div>
            <div class='col s12 cohort-field' [class.cohort-field-or]='condition.condition==="or"'
            *ngFor='let condition of activeCohort.conditions'>
                <label>{{condition.condition}}</label>
                <select class='cohort-field-dropdown browser-default' [(ngModel)]='condition.field' materialize='material_select'>
                    <option *ngFor='let option of fields' [ngValue]='option'>{{option.name}}</option>
                </select>
                <select *ngIf='condition.field.type==="category"' class='cohort-field-dropdown browser-default'
                [(ngModel)]='condition.value'
                    materialize='material_select'>
                    <option *ngFor='let option of condition.field.options' [ngValue]='option.value'>{{option.name}}</option>
                </select>
                <span  *ngIf='condition.field.type==="number"' class='cohort-minMax'>
                    <input type='number' [(ngModel)]='condition.min' placeholder='Min'
                    style='margin-bottom:5px;border-color:#EEE;width:65px;padding-left: 6px;'>
                    <input type='number' [(ngModel)]='condition.max' placeholder='Max'
                    style='margin-bottom:5px;border-color:#EEE;width:65px;padding-left: 6px;'>
                </span>
                <div class='cohort-field-buttons'>
                    <a href='#' (click)='fieldAnd(condition)'>And</a> |
                    <a href='#' (click)='fieldOr(condition)'>Or</a>
                    <span *ngIf='condition.condition !== "where"'> |
                        <a href='#' (click)='fieldDel(condition)'>Remove</a>
                    </span>
                </div>
            </div>
            <div class=' col s12 cohort-button'>
                <a class='cohort-save' href='#' (click)='saveClick()'>Save</a>
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
  @Output() hide: EventEmitter<any> = new EventEmitter();

  fields: Array<CohortField>;
  defaultCondition: CohortCondition;
  activeCohort: Cohort;

  private _config: GraphConfig;
  get config(): GraphConfig { return this._config; }
  @Input() set config(config: GraphConfig) {
    if (config === null) { return; }
    this._config = config;
    this.dataService.getQueryBuilderConfig(config.database).then(result => {
      const fields = result.fields;
      this.fields = Object.keys(fields).map(key => (fields[key].type === 'number') ?
        { key: key, name: fields[key].name, type: fields[key].type } :
        { key: key, name: fields[key].name, type: fields[key].type, options: fields[key].options }
      );
      const field = this.fields[0];
      this.defaultCondition = {
        field: field,
        pids: [],
        condition: 'where',
        min: null,
        max: null,
        value: (field.type === 'category') ? field.options[0] : null
      };
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
    this.addCohort.emit({ cohort: this.activeCohort, database: this.config.database });
  }
  deleteClick(cohort: Cohort): void {
    this.delCohort.emit({ database: this.config.database, cohort: cohort });
  }
  resetForm(): void {
    this.activeCohort.n = '';
    this.activeCohort.conditions.push(this.defaultCondition);
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
    this.activeCohort = { n: '', pids: [], sids: [], conditions: [] };
  }

}
