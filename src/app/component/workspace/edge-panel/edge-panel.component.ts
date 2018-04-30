import { GraphColorAction } from './../../../action/compute.action';
import { Subject } from 'rxjs/Subject';
import { ModalService } from 'app/service/modal-service';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { WorkspaceLayoutEnum, VisualizationEnum, ConnectionTypeEnum } from './../../../model/enum.model';
import { DataTable, DataFieldFactory } from './../../../model/data-field.model';
import { DataField } from 'app/model/data-field.model';
import { INSERT_ANNOTATION } from './../../../action/graph.action';
import { StatsInterface } from './../../../model/stats.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import {
  Component, ComponentFactoryResolver, Input, Output, ViewContainerRef,
  ChangeDetectionStrategy, EventEmitter, AfterViewInit, ElementRef, ViewChild,
  OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { GraphEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { Subscription } from 'rxjs/Subscription';
import { EdgeConfigModel } from 'app/component/visualization/edges/edges.model';
declare var $: any;

@Component({
  selector: 'app-workspace-edge-panel',
  templateUrl: './edge-panel.component.html',
  styleUrls: ['./edge-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EdgePanelComponent implements OnDestroy {

  edgeConfig: EdgeConfigModel = new EdgeConfigModel();
  _graphAConfig: GraphConfig;
  _graphBConfig: GraphConfig;
  $graphAChange: Subject<GraphConfig> = new Subject();
  $graphBChange: Subject<GraphConfig> = new Subject();
  $graphChange: Subscription;
  @Input() set graphAConfig(v: GraphConfig) {
    console.log('G A');
    this._graphAConfig = v;
    this.$graphAChange.next(v);
  }
  @Input() set graphBConfig(v: GraphConfig) {
    console.log('G B');
    this._graphBConfig = v;
    this.$graphBChange.next(v);
  }
  @Input() workspaceConfig: WorkspaceConfigModel;
  @Input() tables: Array<DataTable>;
  @Input() fields: Array<DataField>;
  @Output() workspaceConfigChange: EventEmitter<{ config: WorkspaceConfigModel }> = new EventEmitter();
  @Output() edgeConfigChange: EventEmitter<EdgeConfigModel> = new EventEmitter();


  // focusSubscription: Subscription;
  layoutOptions: Array<string>;
  edgeOptions: Array<DataField>;
  colorOptions: Array<DataField>;
  groupOptions: Array<DataField>;


  // edgePanelSetConfig(value: GraphConfig): void {
  //   const ecm: EdgeConfigModel = (value as EdgeConfigModel);
  //   ecm.database = this.graphAConfig.database;
  //   ecm.entityA = this.graphAConfig.entity;
  //   ecm.entityB = this.graphBConfig.entity;
  //   value.visualization = VisualizationEnum.EDGES;
  //   // this.configChange.emit(value);
  // }

  layoutOptionChange(e: CustomEvent): void {

  }
  edgeOptionChange(e: any): void {
    const optionLabel = e.target.value;
    const option = this.edgeOptions.find(v => v.label === optionLabel);
    this.edgeConfig.field = option;
    this.edgeConfig.markerFilterA = this._graphAConfig.markerFilter;
    this.edgeConfig.sampleFitlerA = this._graphAConfig.sampleFilter;
    this.edgeConfig.patientFilterA = this._graphAConfig.patientFilter;
    this.edgeConfig.markerFilterB = this._graphBConfig.markerFilter;
    this.edgeConfig.sampleFitlerB = this._graphBConfig.sampleFilter;
    this.edgeConfig.patientFilterB = this._graphBConfig.patientFilter;
    this.colorOptions = DataFieldFactory.getConnectionColorFields(
      this.fields,
      this.tables,
      this._graphAConfig.entity,
      this._graphBConfig.entity);
    debugger;
    this.cd.markForCheck();

    this.edgeConfigChange.emit(this.edgeConfig);
    console.dir(option);
  }
  colorOptionChange(e: any): void { }
  groupOptionChange(e: any): void { }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    public ms: ModalService, private cd: ChangeDetectorRef) {
    this.layoutOptions = [
      WorkspaceLayoutEnum.HORIZONTAL, WorkspaceLayoutEnum.VERTICAL, WorkspaceLayoutEnum.OVERLAY
    ];
    this.colorOptions = [
      DataFieldFactory.defaultDataField
    ];
    this.groupOptions = [
      DataFieldFactory.defaultDataField
    ];

    this.$graphChange = this.$graphAChange.merge(
      this.$graphBChange).subscribe(this.graphConfigChange.bind(this));
  }
  graphConfigChange(graphConfig: GraphConfig): void {
    // DataFieldFactory.getMolecularColorFields(tables);
    if (graphConfig.graph === GraphEnum.GRAPH_A) {
      this.edgeConfig.markerFilterA = this._graphAConfig.markerFilter;
      this.edgeConfig.sampleFitlerA = this._graphAConfig.sampleFilter;
      this.edgeConfig.patientFilterA = this._graphAConfig.patientFilter;
      if (this.edgeConfig.entityA !== graphConfig.entity) {
        console.log('type change A');
        this.edgeConfig.entityA = graphConfig.entity;
        this.edgeOptions = DataFieldFactory.getConnectionDataFields(this.fields, this.tables,
          this.edgeConfig.entityA, this.edgeConfig.entityB);
        // dispatch hide edges config
        this.edgeConfig.field = DataFieldFactory.defaultDataField;
        this.edgeConfigChange.emit(this.edgeConfig);
        this.cd.markForCheck();
      }
    }
    if (graphConfig.graph === GraphEnum.GRAPH_B) {
      this.edgeConfig.markerFilterB = this._graphBConfig.markerFilter;
      this.edgeConfig.sampleFitlerB = this._graphBConfig.sampleFilter;
      this.edgeConfig.patientFilterB = this._graphBConfig.patientFilter;
      if (this.edgeConfig.entityB !== graphConfig.entity) {
        console.log('type change B');
        this.edgeConfig.entityB = graphConfig.entity;
        this.edgeOptions = DataFieldFactory.getConnectionDataFields(this.fields, this.tables,
          this.edgeConfig.entityA, this.edgeConfig.entityB);
        // dispatch hide edges config
        this.edgeConfig.field = DataFieldFactory.defaultDataField;
        this.edgeConfigChange.emit(this.edgeConfig);
        this.cd.markForCheck();
      }
    }
  }

  ngOnDestroy() {
    // this.focusSubscription.unsubscribe();
    this.$graphChange.unsubscribe();
  }
}
