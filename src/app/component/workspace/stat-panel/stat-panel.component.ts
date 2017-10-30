import { explainedVariance, explainedVarianceRatio, genericHistogram } from './stats-compute';
import { StatsFactory } from './stats-factory';
import { GraphData } from './../../../model/graph-data.model';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { VegaFactory } from './../../../service/vega.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild
} from '@angular/core';
import { LegendPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;
declare var vega: any;

@Component({
  selector: 'app-workspace-stat-panel',
  templateUrl: './stat-panel.component.html',
  styleUrls: ['./stat-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatPanelComponent implements AfterViewInit {

  // @Input() means that you can set the properties in the html reprsentation of this object (eg <app-worspace-stat-pane configA=''>)
  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Input() graphBData: GraphData;
  @Input() set graphAData(value: GraphData) {

    // Exit if this is trigger before there is data... Could likely be done better with Rxjs
    if (value === null) {
      return;
    }

    // Save Data Passed In In Local Variable
    this.data = value;

    // Create Array of Possible Stat Types
    this.metrics = [
      { label: 'Histogram', value: genericHistogram( [] )},
      // { label: 'Explained Variance', value: explainedVariance( value.result.explainedVariance )},
      { label: 'Explained Variance Ratio', value: explainedVarianceRatio( value.result.explainedVarianceRatio )},
    ];

    // Set Metric Creates The Vega Visualization and +'s it to The Page 
   this.setMetric(this.metrics[1]);

  }

  // @ ViewChild means that you can access the html element in the corresponding html template file
  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
  @ViewChild('tabs') private tabs: ElementRef;


  // Just some properties
  statOptions = ['Graph A', 'Graph B'];
  metrics = [];
  statsFactory: StatsFactory;
  data = {};

  // Create The Vega + Render It
  setMetric(value: any): void {
    new vega.View(vega.parse(value.value), {
      renderer: 'canvas'
    }).initialize('#stat-panel-chart').run();
  }


  // Constructor Called Automatically 
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.statsFactory = StatsFactory.getInstance();
  }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
  }

}
