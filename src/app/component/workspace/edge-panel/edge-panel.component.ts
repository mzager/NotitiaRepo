import { DataTable } from './../../../model/data-field.model';
import { DataField } from 'app/model/data-field.model';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder } from '@angular/forms';
import { VegaFactory } from './../../../service/vega.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { LegendPanelEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;
declare var vega: any;

@Component({
  selector: 'app-workspace-edge-panel',
  templateUrl: './edge-panel.component.html',
  styleUrls: ['./edge-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EdgePanelComponent implements AfterViewInit {

  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
  @ViewChild('tabs') private tabs: ElementRef;

  @Input() tables: Array<DataTable>;
  @Input() fields: Array<DataField>;
  @Input() graphAConfig: GraphConfig;
  @Input() graphBConfig: GraphConfig;
  @Input() config: GraphConfig;
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();

  edgePanelSetConfig(value: GraphConfig): void {
    this.configChange.emit(value);
  }
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
  }
}
