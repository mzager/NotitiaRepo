import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef, Component, EventEmitter,
  Input, Output, ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Cohort, CohortCondition, CohortField } from './../../../model/cohort.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataService } from './../../../service/data.service';

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
    if (this.activeCohort.n === '') { alert('Please specify a cohort name'); return; }
    if (this.cohorts.find(v => v.n === this.activeCohort.n)) { alert('Please specify a unique cohort name'); return; }
    this.addCohort.emit({ cohort: this.activeCohort, database: this.config.database });
  }

  deleteClick(cohort: Cohort): void {
    this.delCohort.emit({ database: this.config.database, cohort: cohort });
  }

  resetForm(): void {
    this.activeCohort.n = '';
    this.activeCohort.conditions.push(this.defaultCondition);
    this.cd.detectChanges();
  }

  fieldAnd(item: any): void {
    const newField = Object.assign({}, item);
    newField.condition = 'and';
    this.activeCohort.conditions.push(newField);
    this.cd.detectChanges();
  }

  fieldOr(item: any): void {
    const insIndex = this.activeCohort.conditions.indexOf(item);
    const newField = Object.assign({}, item);
    newField.condition = 'or';
    this.activeCohort.conditions.splice(insIndex + 1, 0, newField);
    this.cd.detectChanges();
  }

  fieldDel(item: any): void {
    const delIndex = this.activeCohort.conditions.indexOf(item);
    this.activeCohort.conditions.splice(delIndex, 1);
    this.cd.detectChanges();
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {
    this.activeCohort = { n: '', pids: [], sids: [], conditions: [] };
  }

}
