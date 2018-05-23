import { Cohort, CohortCondition, CohortField } from './../../../model/cohort.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';

import {
  Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;

@Component({
  selector: 'app-workspace-cohort-panel',
  styleUrls: ['./cohort-panel.component.scss'],
  templateUrl: './cohort-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
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
    // debugger;
    // const me = this;
    // if (!this.isValid()) {
    //   return;
    // }
    if (this.activeCohort.n === '') { alert('Please specify a cohort name'); return; }
    // debugger;
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
