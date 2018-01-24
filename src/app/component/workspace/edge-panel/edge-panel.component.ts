import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { DataTable } from './../../../model/data-field.model';
import { DataField } from 'app/model/data-field.model';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { LegendPanelEnum, GraphEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;

@Component({
  selector: 'app-workspace-edge-panel',
  templateUrl: './edge-panel.component.html',
  styleUrls: ['./edge-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EdgePanelComponent implements AfterViewInit {

  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
  @ViewChild('tabs') private tabs: ElementRef;
  @Input() bounds: ElementRef;
  @Input() tables: Array<DataTable>;
  @Input() fields: Array<DataField>;
  @Input() graphAConfig: GraphConfig;
  @Input() graphBConfig: GraphConfig;
  @Input() config: GraphConfig;
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() workspaceConfigChange: EventEmitter<WorkspaceConfigModel> = new EventEmitter();
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Input() set workspaceConfig(value: WorkspaceConfigModel) {
    this.layoutOptions = [
      WorkspaceLayoutEnum.SINGLE, WorkspaceLayoutEnum.HORIZONTAL, WorkspaceLayoutEnum.VERTICAL, WorkspaceLayoutEnum.OVERLAY
    ];
    this.form = this.fb.group({
      layout: value.layout,
    });
      // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.workspaceConfigChange.emit(data);
      });
  }

  layoutOptions: Array<string>;
  form: FormGroup;

  edgePanelSetConfig(value: GraphConfig): void {
    this.configChange.emit(value);
  }
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private fb: FormBuilder) {
    this.layoutOptions = [
      WorkspaceLayoutEnum.SINGLE, WorkspaceLayoutEnum.HORIZONTAL, WorkspaceLayoutEnum.VERTICAL, WorkspaceLayoutEnum.OVERLAY
    ];
  }

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
  }
}