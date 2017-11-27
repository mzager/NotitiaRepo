import {explainedVarianceRatio, genericDonut,  genericHistogram,  genericViolin} from './stats-compute';
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
declare var vegaTooltip: any;



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
    const componentMap = value.markerIds.reduce((p, c, i) => {
        p[c] = value.result.components.map(v => v[i]);
        return p;
    }, {});
    const componentArray = Object.keys(componentMap).map(key => {
        const item = componentMap[key];
        return {
            marker: key,
            pc1: item[0],
            pc2: item[1],
            pc3: item[2]
        };
    }, {}).sort((a, b) =>
        (a.pc1 > b.pc1) ? -1 :
            (a.pc1 < b.pc1) ? 1 :
                (a.pc2 > b.pc2) ? -1 :
                    (a.pc2 < b.pc2) ? 1 :
                        (a.pc3 > b.pc3) ? -1 :
                            (a.pc3 < b.pc3) ? 1 : 0
    ).filter( (v, i) => i < 20)
    .map( v => ({ label: v.marker, value: v.pc1.toFixed(2) }));



    this.metrics = [
      { label: 'Histogram', value: genericHistogram( componentArray )},
      // { label: 'Histogram', value: genericHistogram( value.result.explainedVarianceRatio  )},
      // { label: 'Violin', value: genericViolin( value.result.explainedVarianceRatio  )},
      // { label: 'Donut', value: genericDonut( value.result.explainedVariance )}
      // { label: 'Explained Variance Ratio', value: explainedVarianceRatio( value.result.explainedVarianceRatio )}
    ];

    // debugger;
    // Set Metric Creates The Vega Visualization and +'s it to The Page
   this.setMetric(this.metrics[0]);
// debugger;

  }

  // @ ViewChild means that you can access the html element in the corresponding html template file
  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
  @ViewChild('tabs') private tabs: ElementRef;


  // Just some properties
  statOptions = ['Graph A', 'Graph B'];
  metrics = [];
  statsFactory: StatsFactory;
  data = {};

  // https://www.npmjs.com/package/vega-tooltip
  // options =
  // {
  //   showAllFields: false,
  //   fields: [
  //     {
  //       field: 'field',
  //       title: 'PC',
  //       formatType: 'number'
  //     }
  //   ]};

     options =
    {
      showAllFields: false,
      fields: [
        {
          field: 'field1',
          title: 'Field One',
          formatType: 'number',
          delay: 250,
          colorTheme: 'dark'
        },
      ]
    };

  // Create The Vega + Render It
    setMetric(value: any): void {
      new vega.View(vega.parse(value.value), {
          renderer: 'svg'
        }).initialize('#stat-panel-chart')
          .hover()
          .run();

          // To further customize, overwrite the .vg-tooltip class in your CSS
          // below needs work, https://www.npmjs.com/package/vega-tooltip
          // vegaTooltip.vega(vega[, this.options]); // pass in options
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
