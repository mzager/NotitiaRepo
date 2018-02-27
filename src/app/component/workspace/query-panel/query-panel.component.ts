import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalService } from './../../../service/modal-service';
import { QueryBuilderConfig } from 'app/component/workspace/query-panel/query-builder/query-builder.interfaces';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { EntityTypeEnum, DataTypeEnum } from './../../../model/enum.model';
import { DataField } from './../../../model/data-field.model';
import { Observable } from 'rxjs/Observable';
import {
  Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef,
  Input, Output, AfterViewInit, EventEmitter
} from '@angular/core';
import * as d3 from 'D3';
import { tree } from 'd3-hierarchy';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-workspace-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.scss']
})
export class QueryPanelComponent implements AfterViewInit, OnDestroy {

  form: FormGroup;

  @Input() set configA(config: GraphConfig) {
    this._configA = config;
    this.dataService.getQueryBuilderConfig(config.database).then(result => {
      this.cfg = result;
      const fieldKey = Object.keys(this.cfg.fields)[0];
      const field = result[fieldKey];
      this.query = {
        condition: 'and',
        rules: [ { field: fieldKey, operator: '<=' } ]
      };
    });
  }

  // @Input() set configB(config: GraphConfig) {
  //   this._configB = config;
  //   this.dataService.getQueryBuilderConfig(config.database).then(result => {
  //     this.cfg = result;
  //     const fieldKey = Object.keys(this.cfg.fields)[0];
  //     const field = result[fieldKey];
  //     this.query = {
  //       condition: 'and',
  //       rules: [ { field: fieldKey, operator: '<=' } ]
  //     };
  //   });
  // }

  private _configA: GraphConfig;
  // private _configB: GraphConfig;
  cfg: QueryBuilderConfig;
  query: any;
  // options = [];

  // @Output() configChange = new EventEmitter<GraphConfig>();

  // reset(): void {
  //   this._configA.patientFilter = [];
  //   this._configA.dirtyFlag = DirtyEnum.LAYOUT;
  //   this.configChange.next(this._configA);
  // }
  // save(): void {

  // }

  // filter(): void {
  //   this.dataService.getPatientIdsWithQueryBuilderCriteria(this._configA.database, this.cfg, this.query).then( pids => {
  //     this._configA.patientFilter = pids;
  //     this.dataService.getSampleIdsWithPatientIds( this._configA.database, pids ).then( sids => {
  //       this._configA.sampleFilter = sids;
  //       this._configA.dirtyFlag = DirtyEnum.LAYOUT;
  //       this.configChange.next(this._configA);
  //     });
  //   });
  // }
  // select(): void {
  //   // console.dir(this.query);
  // }

  // Life Cycle
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {  }
  constructor(private dataService: DataService, public ms: ModalService, private cd: ChangeDetectorRef, private fb: FormBuilder) {
    this.form =  this.fb.group({
      cohortName: []
    });
  }
}
