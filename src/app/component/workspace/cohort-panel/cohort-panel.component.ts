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
  <h1>Cohorts</h1>
  <h2>Create, Manage and Apply custom cohorts to your visualizations - <a href='' target='_blank'>Watch Tutorial</a></h2>
  <div class='row'>
    <!-- My Cohorts -->
    <div class='col s3' style='border: 0px solid #EEE; border-right-width: 1px;padding-left: 0px;padding-right: 30px;'>
      <span class='cohortHeader'>My Cohorts</span>
      <div *ngFor='let myCohort of myCohorts'>
        <div class='cohortMyRow'><span class='cohortMyRowname'>{{myCohort.name}}</span> (33 patients / 66 samples)<i class='material-icons cohortMyRowDelete'>delete</i></div>
      </div>
    </div>
    <div class='col s6' style='padding-left:30px;padding-right:30px;'>
      <span class='cohortHeader' style='padding-bottom:20px;'>Build A Cohort</span>
      

      <div class='cohortField'>
        <label for='cohortName'>Create</label>
        <input id='cohortName' type='text' placeholder='Enter Cohort Name'
          style='margin-bottom:5px;border-color:#EEE;width:293px;padding-left: 6px;'>
      </div>

      <div class='cohortField' [class.cohortFieldOr]='condition.condition==="or"' *ngFor='let condition of activeCohort.conditions'>
        <label>{{condition.condition}}</label>
        <select class='cohortFieldDropdown browser-default' materialize='material_select'><option>Gender</option></select>
        <select class='cohortValueDropdown browser-default'materialize='material_select'><option>Female</option></select>
        <div class='cohortFieldButtons'>
          <button class='waves-effect waves-light btn btn-small white cohortBtn' (click)='fieldAnd(condition)'>And</button>
          <button class='waves-effect waves-light btn btn-small white cohortBtn' (click)='fieldOr(condition)'>Or</button>
          <button class='waves-effect waves-light btn btn-small white cohortBtn' (click)='fieldDel(condition)'><i class="material-icons">delete</i></button>
        </div>
      </div>
      

    </div>
    <div class='col s3' style='border: 0px solid #EEE; border-left-width: 1px; padding-left:30px; padding-right:0px; '>
      <div style='width:100%; height:150px; background:#eee; text-align: center; padding-top: 40px;'>
        <i class="material-icons large">play_circle_outline</i>
      </div>
    </div>
  </div>
</div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CohortPanelComponent implements AfterViewInit {

  myCohorts: Array<{name:string, patients:Array<string>, query:any}> = [];
  fields: Array<{name: string, type: 'number' | 'category', options?: Array<{name: string, value: string}>}>;
  defaultField: {field: string, value: string | [number, number], condition: string};
  activeCohort: {
    name: string,
    conditions: Array<{field: string, value: string | [number, number], condition: string}>;
  }

  @Input() set config(config: GraphConfig) {
    this.dataService.getQueryBuilderConfig(config.database).then(result => {
      this.fields = Object.keys(result.fields).map( v => result.fields[v]);
      if (this.fields[0].type === 'category') {
        this.defaultField = { field: this.fields[0].name, value: this.fields[0].options[0].value, condition: 'where' };
      }
      if (this.fields[0].type === 'number') {
        this.defaultField = {field: this.fields[0].name, value: [0,0], condition: 'where' };
      }
      this.resetForm();
    });
    this.dataService.getCustomCohorts(config.database).then(v => { 
      this.myCohorts = [
        { name: 'All Patients', patients: [], query: {} },
        { name: 'Over 55', patients: ['a','b','c'], query: {} },
        { name: 'IDH1', patients: ['a','b','c'], query: {} }
      ];
      this.cd.markForCheck();
    })
  }
  
  ngAfterViewInit(): void { }

  resetForm(): void { 
    this.activeCohort.name = '';
    this.activeCohort.conditions.push(this.defaultField);
    this.cd.markForCheck();
  }

  fieldAnd(item: any) : void { 
    const newField = Object.assign({}, item);
    newField.condition = 'and';
    this.activeCohort.conditions.push(newField);
    this.cd.markForCheck();
  }

  fieldOr(item: any) : void { 
    const newField = Object.assign({}, item);
    newField.condition = 'or';
    this.activeCohort.conditions.push(newField);
    this.cd.markForCheck();
  }

  fieldDel(item: any) : void { 
    const delIndex = this.activeCohort.conditions.indexOf(item);
    this.activeCohort.conditions.splice(delIndex, 1);
    this.cd.markForCheck();
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {
    this.activeCohort = { name:'', conditions:[] };
  }

}
