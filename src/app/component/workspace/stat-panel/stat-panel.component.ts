import { Stat } from './../../../model/stat.model';
import { StatFactory } from './../../../service/stat.factory';
import { StatVegaFactory } from './../../../service/stat.vega.factory';
import { DataService } from './../../../service/data.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { ChartTypeEnum, StatRendererEnum, StatRendererColumns, Colors } from './../../../model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild
} from '@angular/core';
import { VisualizationEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { values } from 'd3';
import { Element } from '@angular/compiler';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

declare var $: any;
declare var vega: any;
declare var vegaTooltip: any;

@Component({
  selector: 'app-workspace-stat-panel',
  templateUrl: './stat-panel.component.html',
  styleUrls: ['./stat-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatPanelComponent implements AfterViewInit, OnDestroy {

  container: any;
  chartStats: Array<Stat> = [];
  statFactory: StatFactory;
  statVegaFactory: StatVegaFactory;

  $configChange: Subject<GraphConfig> = new Subject();
  $dataChange: Subject<GraphData> = new Subject();
  $statsChange: Subscription;

  _config: GraphConfig;
  _data: GraphData;

  @Input() set config(value: GraphConfig) {
    if (value === null) { return; }
    this._config = value; this.$configChange.next();
  }
  @Input() set graphData(value: GraphData) {
    if (value === null) { return; }
    this._data = value; this.$dataChange.next();
  }

  update(): void {

    if (this._config === null || this._data === null) { return; }

    this.container.empty();
    this.statFactory.getComputeStats(this._data, this._config).then(stats => {
      stats.forEach((stat) => {
        const id = 'cc' + Math.random().toString(36).substring(7);
        const div = this.container.append('<div id="' + id + '" class="statItemContainer" style="padding-bottom:20px;"></div>');
        this.statVegaFactory.drawChartObject(stat, stat.charts[0], id, div);
      });
    });
  }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    this.statFactory = StatFactory.getInstance(this.dataService);
    this.statVegaFactory = StatVegaFactory.getInstance();
    this.container = $(this.elementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild);
    this.$statsChange = Observable.combineLatest(this.$configChange, this.$dataChange)
      .debounceTime(300).subscribe(this.update.bind(this));
    this.update();
  }

  ngOnDestroy() {
    this.$dataChange.complete();
    this.$configChange.complete();
    this.$statsChange.unsubscribe();
  }

  constructor(public elementRef: ElementRef, public dataService: DataService) { }
}
