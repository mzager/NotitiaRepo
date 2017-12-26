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

  // @Input() means that you can set the properties in the html reprsentation of this object (eg <app-worspace-stat-pane configA=''>)
  statOption: Stat;
  statOptions: Array<Stat> = [];
  chartOption: ChartTypeEnum;

  @Input() config: GraphConfig;
  @Input() data: GraphData;
  @Input() set graphData(value: GraphData) {
    this.data = value;
    this.statOptions = StatFactory.getInstance().getStatObjects(value, this.config.visualization);
    if (this.statOptions === null) { return; }

    const vegas = this.statOptions.map( stat => {
      return vega.parse(VegaFactory.getInstance().getVegaObject(stat, stat.charts[0]),
        {renderer: ('svg') });
    });

    vegas.forEach( (v, i) => {
      const c = new vega.View(v)
      .initialize('#cc' + i.toString() )
      .hover()
      .run();
    });
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
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() { }
}
