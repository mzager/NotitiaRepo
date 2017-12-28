import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { GraphEnum } from 'app/model/enum.model';
import { ConditionModel } from './query-panel.model';
import { EntityTypeEnum, DataTypeEnum } from './../../../model/enum.model';
import { DataField } from './../../../model/data-field.model';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, ElementRef,
   Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import * as d3 from 'D3';
import { tree } from 'd3-hierarchy';
import * as Tree from 'angular-tree-component';
import * as _ from 'lodash';
declare var $: any;

@Component({
  selector: 'app-workspace-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.scss']
})
export class QueryPanelComponent implements AfterViewInit {

  public static genesetsInCategory: Array<any> = [];

  @Input() set config(config: GraphConfig){
    this.dataService.getDatasetInfo(config.database).then( result => {
      debugger;
    })
  };
  @Input() set molecularData(tables: Array<string>){
   
  }
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() hide: EventEmitter<any> = new EventEmitter();
  
  query: Array<any> = [];
  operators: Array<string> = ['And', 'Or'];
  conditions: Array<string> = ['=', '≠', '<', '<=', '>', '>='];

  @Input()
  set clinicalFields(data: Array<DataField>) {
    if (data.length === 0 ) { return; }
    
  }

  @Output() queryPanelToggle = new EventEmitter();

  ngAfterViewInit(): void {
  
  }

  constructor(private dataService: DataService) {
   
  }



}
