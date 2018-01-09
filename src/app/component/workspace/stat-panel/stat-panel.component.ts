import { ChartTypeEnum, StatRendererEnum, StatRendererColumns } from './../../../model/enum.model';
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

    // Parent Container As JQuery Object + Empty
    const container: any = $(this.elementRef.nativeElement.firstElementChild.firstElementChild.firstElementChild);
    container.empty();

    // Loop through the stats
    this.statOptions.forEach( (stat, i) => {

      // Create A div To hold the stat
      const div = container.append('<div id="cc' + i.toString() + '" class="col ' +
        ( (stat.columns === StatRendererColumns.SIX) ? 's6' : 's12' )
      + '"></div>');

      // Process Stat Types
      switch (stat.renderer) {
        case StatRendererEnum.VEGA:
          const v = vega.parse(VegaFactory.getInstance().getChartObject(stat, stat.charts[0]), {renderer: ('svg') });
          const c = new vega.View(v)
            .initialize('#cc' + i.toString() )
            .hover()
            .renderer('svg')
            .run();
          break;
        case StatRendererEnum.HTML:
          div.append( VegaFactory.getInstance().getChartObject(stat, stat.charts[0]).toString() );
          break;
      }
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
  constructor(private componentFactoryResolver: ComponentFactoryResolver, public elementRef: ElementRef) { }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() { }
}
