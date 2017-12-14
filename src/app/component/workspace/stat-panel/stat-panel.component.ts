import { ChartTypeEnum } from './../../../model/enum.model';
import { genericDonut, genericHistogram, genericViolin } from './stats-compute';
import { StatsFactory } from './stats-factory';
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

declare var $: any;
declare var vega: any;
declare var vegaTooltip: any;

@Component({
  selector: 'app-workspace-stat-panel',
  templateUrl: './stat-panel.component.html',
  styleUrls: ['./stat-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatPanelComponent implements AfterViewInit {

    // @ ViewChild means that you can access the html element in the corresponding html template file
    @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
    @ViewChild('tabs') private tabs: ElementRef;

  // @Input() means that you can set the properties in the html reprsentation of this object (eg <app-worspace-stat-pane configA=''>)
  statOption: Stat;
  statOptions = [];
  chartOption: ChartTypeEnum;

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Input() graphBData: GraphData;
  @Input() set graphAData(value: GraphData) {

    // Exit if this is trigger before there is data... Could likely be done better with Rxjs
    if (value === null) { return; }

    this.statOptions = StatFactory.getInstance().getStatObjects( value, this.configA.visualization);
    // option of statOptions = star at first one
    this.statOption = this.statOptions[0];
    this.chartOption = this.statOption.charts[0];
    this.drawGraph();
  }

  drawGraph(): void {
    const vegaJson = VegaFactory.getInstance().getVegaObject(this.statOption, this.chartOption);
    if (vegaJson === null) { console.log(this.chartOption + ' is not yet implmented'); return; }
    const view = new vega.View(vega.parse(vegaJson), {
      
      renderer: ('svg'),
    }).initialize('#stat-panel-chart')
      // .scheme('oncoscape', ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'])
      .hover()
      .run();

      // generate a PNG snapshot and then download the image
// view.toImageURL('png').then(function(url) {
//   const link = document.createElement('a');
//   link.setAttribute('href', url);
//   link.setAttribute('target', '_blank');
//   link.setAttribute('download', 'vega-export.png');
//   link.dispatchEvent(new MouseEvent('click'));
// }).catch(function(error) { /* error handling */ });
}
  // Constructor Called Automatically
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
    $(this.tabs.nativeElement).on('click', 'a', function(e) { });
  }
}
