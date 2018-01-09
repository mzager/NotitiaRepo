import { QueryBuilderConfig } from 'app/component/workspace/query-panel/query-builder/query-builder.interfaces';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { GraphEnum } from 'app/model/enum.model';
import { EntityTypeEnum, DataTypeEnum } from './../../../model/enum.model';
import { DataField } from './../../../model/data-field.model';
import { Observable } from 'rxjs/Observable';
import {
  Component, OnInit, ViewChild, ElementRef,
  Input, Output, AfterViewInit, EventEmitter
} from '@angular/core';
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

  @Input() set config(config: GraphConfig) {
    // this.dataService.getDatasetInfo(config.database).then( result => {
    //   debugger;
    // })
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

  showBuilder = false;
  cfg: QueryBuilderConfig;
  query: any;

  @Output() hide: EventEmitter<any> = new EventEmitter();



  @Output() queryPanelToggle = new EventEmitter();

  ngAfterViewInit(): void {

  }
  filter(): void {
    console.dir(this.query);
  }
  select(): void {
    console.dir(this.query);
  }
  constructor(private dataService: DataService) {

  }



}
