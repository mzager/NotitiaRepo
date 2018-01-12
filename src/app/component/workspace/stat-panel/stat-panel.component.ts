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
import { LegendPanelEnum, VisualizationEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { values } from 'd3';
import { VegaFactory, StatFactory, Stat } from 'app/model/stat.model';
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

  // // @ ViewChild means that you can access the html element in the corresponding html template file
  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;

  // @Input() means that you can set the properties in the html reprsentation of this object (eg <app-worspace-stat-pane configA=''>)

  container: any;
  chartStats: Array<Stat> = [];

  $configChange: Subject<GraphConfig> = new Subject();
  $dataChange: Subject<GraphData> = new Subject();
  $statsChange: Subscription;

  _config: GraphConfig;
  _data: GraphData;

  @Input() data: GraphData;
  @Input() set config(value: GraphConfig) { this._config = value; this.$configChange.next(); }
  @Input() set graphData(value: GraphData) { this._data = value; this.$dataChange.next(); }

  update(value: [GraphConfig, GraphData]): void {

    // Ensure everything is ready to go... This could be cleaned up.
    if (this.elementRef === undefined) { return; }
    if (this.elementRef.nativeElement === undefined) { return; }
    if (this.container === undefined) {
      this.container = $(this.elementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild);
    }
    if (this._config === null || this._data === null) { return; }


    // Get Instance Of Stat Factory
    const sf = StatFactory.getInstance();
    this.chartStats = sf.getStatObjects(this._data, this._config);

    // Ensure Everything ... Bad Code
    if (this.chartStats === null) { return; }
    
    this.container.empty();
    sf.getPopulationStats(this._config, this.dataService).then( populationStats => {

      this.chartStats.concat(populationStats).forEach((stat, i) => {

        // Create A div To hold the stat
        const div = this.container.append('<div id="cc' + i.toString() + '" class="stat-col col ' +
        ((stat.columns === StatRendererColumns.SIX) ? 's12' : 's12')
        + '"></div>');

        // Process Stat Types
        switch (stat.renderer) {
          case StatRendererEnum.VEGA:
        
            const v = vega.parse(VegaFactory.getInstance().getChartObject(stat, stat.charts[0]), { renderer: ('svg') });
            const c = new vega.View(v)
              .initialize('#cc' + i.toString())
              .hover()
              .renderer('svg')
              .run();
            break;
          case StatRendererEnum.HTML:
            div.append(VegaFactory.getInstance().getChartObject(stat, stat.charts[0]).toString());
            break;
        }
      });
    });
  }

  // Constructor Called Automatically
  constructor(public elementRef: ElementRef, public dataService: DataService) { }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    this.$statsChange = Observable.combineLatest(this.$configChange, this.$dataChange).subscribe(this.update);
    this.update(null);
  }

  ngOnDestroy() {
    this.$dataChange.complete();
    this.$configChange.complete();
    this.$statsChange.unsubscribe();
  }
}
