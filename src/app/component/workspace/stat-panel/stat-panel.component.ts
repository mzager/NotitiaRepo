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

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Input() set graphAData(value: GraphData){
    this.data = value;

  }
  @Input() graphBData: GraphData;

  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
  @ViewChild('tabs') private tabs: ElementRef;

  statOptions = ['Graph A', 'Graph B'];

  data = {};

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
  }

}
