import { GraphConfig } from './../../../../model/graph-config.model';
import { StatFactory } from './../../../../model/stat.model';
import { DataService } from './../../../../service/data.service';
import { DataTypeEnum, CollectionTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
declare var $: any;
declare var vega: any;
declare var vegaTooltip: any;


@Component({
  selector: 'app-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
 <div>
  <div #container></div>
 </div>
  `
})
export class SummaryComponent {

  @ViewChild('container') container: ElementRef;

  statFactory: StatFactory;
  private _config: GraphConfig;

  // @Input() set tables(tables: Array<DataTable>) {
  //   this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  // }

  @Input() set config(value: GraphConfig) {
    // if (value === null) { return; }
    // this._config = value;
    // this.dataService.getDatasetInfo(this._config.database).then(this.datasetInfoLoaded);
    // this.statFactory.getPopulationStats(this._config, this.dataService).then(this.populationStatsLoaded);
  }

  populationStatsLoaded(v: any): void {
  }


  datasetInfoLoaded(v: any): void {

  }

  constructor(public dataService: DataService) {
    this.statFactory = StatFactory.getInstance();
  }


}
