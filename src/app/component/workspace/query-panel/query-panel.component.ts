import { QueryBuilderConfig } from 'app/component/workspace/query-panel/query-builder/query-builder.interfaces';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { EntityTypeEnum, DataTypeEnum } from './../../../model/enum.model';
import { DataField } from './../../../model/data-field.model';
import { Observable } from 'rxjs/Observable';
import {
  Component, OnInit, ViewChild, ElementRef,
  Input, Output, AfterViewInit, EventEmitter
} from '@angular/core';
import * as d3 from 'D3';
import { tree } from 'd3-hierarchy';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-workspace-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.scss']
})
export class QueryPanelComponent implements AfterViewInit {

  @Input() bounds: ElementRef;
  @Output() help: EventEmitter<any> = new EventEmitter();

  private _configA: GraphConfig;
  private _configB: GraphConfig;
  

  helpClick(): void {
    this.help.emit('QueryPanel');
  }

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
      this.showBuilder = true;
    });
  }

  @Input() set configB(config: GraphConfig) {
    this._configB = config;
    // this.dataService.getQueryBuilderConfig(config.database).then(result => {
    //   this.cfg = result;
    //   const fieldKey = Object.keys(this.cfg.fields)[0];
    //   const field = result[fieldKey];
    //   this.query = {
    //     condition: 'and',
    //     rules: [ { field: fieldKey, operator: '<=' } ]
    //   };
    // this.showBuilder = true;
    // });
  }

  showBuilder = false;
  cfg: QueryBuilderConfig;
  query: any;

  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() queryPanelToggle = new EventEmitter();
  @Output() configChange = new EventEmitter<GraphConfig>();

  reset(): void { 
    this._configA.patientFilter = [];
    this._configA.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.next(this._configA);
    this.hide.emit();
  }

  ngAfterViewInit(): void {

  }
  filter(): void {
    
    this.dataService.getPatientIdsWithQueryBuilderCriteria(this._configA.database, this.cfg, this.query).then( pids => {
      this._configA.patientFilter = pids;
      this.dataService.getSampleIdsWithPatientIds( this._configA.database, pids ).then( sids => {
        this._configA.sampleFilter = sids;
        this._configA.dirtyFlag = DirtyEnum.LAYOUT;
        this.configChange.next(this._configA);
        this.hide.emit();
      });
    });
  }
  select(): void {
    console.dir(this.query);
  }
  constructor(private dataService: DataService) {

  }



}
