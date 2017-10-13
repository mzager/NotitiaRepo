import { GraphData } from './../../../model/graph-data.model';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { VegaFactory } from './../../../service/vega.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import { Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
    // // this._clinicalFields = v;
    // const view = new vega.View(vega.parse(this.vegaFactory.createPieChart()), {
    //   renderer: 'canvas'
    // }).initialize('#chart').hover().run();
  // @ViewChild('chart') private chartContainer: ElementRef;

  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
  @ViewChild('tabs') private tabs: ElementRef;

  @Input() private set clinicalFields(v: Array<any>){
    this._clinicalFields = v;
  }

  // @Input() private set graphAData(v: GraphData){
  //   this._graphAData = v;
  // }

  // @Input() private set graphBData(v: GraphData){
  //   this._graphBData = v;
  // }

  // private vegaFactory: VegaFactory;
  private _graphAData: GraphData;
  private _graphBData: GraphData;
  private _clinicalFields: Array<any>;
  private view: any;
  private statComponent: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(PcaStatsComponent);
    // this.chartContainer.clear();
    // this.statComponent = this.chartContainer.createComponent(componentFactory);
    // this.statComponent.instance.setConfig(this._graphAData);
  }

}
