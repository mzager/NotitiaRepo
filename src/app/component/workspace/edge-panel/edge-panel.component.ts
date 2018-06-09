import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactoryResolver, EventEmitter,
  Input, OnDestroy, Output, ViewEncapsulation
} from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { EdgeConfigModel } from 'app/component/visualization/edges/edges.model';
import { DataField } from 'app/model/data-field.model';
import { GraphEnum } from 'app/model/enum.model';
import { ModalService } from 'app/service/modal-service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
declare var $: any;

@Component({
  selector: 'app-workspace-edge-panel',
  templateUrl: './edge-panel.component.html',
  styleUrls: ['./edge-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EdgePanelComponent implements OnDestroy {

  edgeConfig: EdgeConfigModel = new EdgeConfigModel();
  _graphAConfig: GraphConfig;
  _graphBConfig: GraphConfig;
  $graphAChange: Subject<GraphConfig> = new Subject();
  $graphBChange: Subject<GraphConfig> = new Subject();
  $graphChange: Subscription;
  @Input() set graphAConfig(v: GraphConfig) {
    this._graphAConfig = v;
    this.$graphAChange.next(v);
  }
  @Input() set graphBConfig(v: GraphConfig) {
    this._graphBConfig = v;
    this.$graphBChange.next(v);
  }
  @Input() workspaceConfig: WorkspaceConfigModel;
  @Input() tables: Array<DataTable>;
  @Input() fields: Array<DataField>;
  @Output() workspaceConfigChange: EventEmitter<{ config: WorkspaceConfigModel }> = new EventEmitter();
  @Output() edgeConfigChange: EventEmitter<EdgeConfigModel> = new EventEmitter();
  @Output() decoratorAdd: EventEmitter<{ config: GraphConfig, decorator: DataDecorator }> = new EventEmitter();
  @Output() decoratorDel: EventEmitter<{ config: GraphConfig, decorator: DataDecorator }> = new EventEmitter();

  layoutSelected: string;
  edgeSelected: DataField;
  colorSelected: DataField;
  groupSelected: DataField;
  layoutOptions: Array<string>;
  edgeOptions: Array<DataField>;
  colorOptions: Array<DataField>;
  groupOptions: Array<DataField>;

  @Input() decorators: Array<DataDecorator>;

  // edgePanelSetConfig(value: GraphConfig): void {
  //   const ecm: EdgeConfigModel = (value as EdgeConfigModel);
  //   ecm.database = this.graphAConfig.database;
  //   ecm.entityA = this.graphAConfig.entity;
  //   ecm.entityB = this.graphBConfig.entity;
  //   value.visualization = VisualizationEnum.EDGES;
  //   // this.configChange.emit(value);
  // }

  layoutOptionChange(e: MatSelectChange): void {

  }

  edgeOptionChange(e: MatSelectChange): void {
    const optionLabel = e.value;
    const option = this.edgeOptions.find(v => v.label === optionLabel);
    this.edgeConfig.field = option;
    this.edgeConfig.markerFilterA = this._graphAConfig.markerFilter;
    this.edgeConfig.sampleFitlerA = this._graphAConfig.sampleFilter;
    this.edgeConfig.patientFilterA = this._graphAConfig.patientFilter;
    this.edgeConfig.markerFilterB = this._graphBConfig.markerFilter;
    this.edgeConfig.sampleFitlerB = this._graphBConfig.sampleFilter;
    this.edgeConfig.patientFilterB = this._graphBConfig.patientFilter;
    this.groupOptions = this.colorOptions = DataFieldFactory.getConnectionColorFields(
      this.fields,
      this.tables,
      this._graphAConfig.entity,
      this._graphBConfig.entity);
    this.cd.detectChanges();
    this.edgeConfigChange.emit(this.edgeConfig);
  }

  colorOptionChange(e: MatSelectChange): void {
    const colorLabel = e.value;
    const field = this.colorOptions.find(v => v.label === colorLabel);
    if (field.key === 'None') {
      this.decoratorDel.emit({
        config: this.edgeConfig,
        decorator: { type: DataDecoratorTypeEnum.COLOR, values: null, field: null, legend: null }
      });
    } else {
      this.decoratorAdd.emit({
        config: this.edgeConfig,
        decorator: { type: DataDecoratorTypeEnum.COLOR, field: field, legend: null, values: null }
      });
    }
  }

  groupOptionChange(e: MatSelectChange): void {
    const colorLabel = e.value;
    const field = this.colorOptions.find(v => v.label === colorLabel);
    if (field.key === 'None') {
      this.decoratorDel.emit({
        config: this.edgeConfig,
        decorator: { type: DataDecoratorTypeEnum.GROUP, values: null, field: null, legend: null }
      });
    } else {
      this.decoratorAdd.emit({
        config: this.edgeConfig,
        decorator: { type: DataDecoratorTypeEnum.GROUP, field: field, legend: null, values: null }
      });
    }
  }

  graphConfigChange(graphConfig: GraphConfig): void {
    if (graphConfig.graph === GraphEnum.GRAPH_A) {
      this.edgeConfig.markerFilterA = this._graphAConfig.markerFilter;
      this.edgeConfig.sampleFitlerA = this._graphAConfig.sampleFilter;
      this.edgeConfig.patientFilterA = this._graphAConfig.patientFilter;
      if (this.edgeConfig.entityA !== graphConfig.entity) {
        this.edgeConfig.entityA = graphConfig.entity;
        this.edgeOptions = DataFieldFactory.getConnectionDataFields(this.fields, this.tables,
          this.edgeConfig.entityA, this.edgeConfig.entityB);
        // dispatch hide edges config
        this.edgeConfig.field = DataFieldFactory.defaultDataField;
        this.edgeConfigChange.emit(this.edgeConfig);
      }
    }
    if (graphConfig.graph === GraphEnum.GRAPH_B) {
      this.edgeConfig.markerFilterB = this._graphBConfig.markerFilter;
      this.edgeConfig.sampleFitlerB = this._graphBConfig.sampleFilter;
      this.edgeConfig.patientFilterB = this._graphBConfig.patientFilter;
      if (this.edgeConfig.entityB !== graphConfig.entity) {
        this.edgeConfig.entityB = graphConfig.entity;
        this.edgeOptions = DataFieldFactory.getConnectionDataFields(this.fields, this.tables,
          this.edgeConfig.entityA, this.edgeConfig.entityB);
        // dispatch hide edges config
        this.edgeConfig.field = DataFieldFactory.defaultDataField;
        this.edgeConfigChange.emit(this.edgeConfig);
      }
    }
    this.layoutSelected = this.layoutOptionChange[0];
    this.edgeSelected = this.edgeOptions[0];
    this.colorSelected = this.colorOptions[0];
    this.groupSelected = this.groupOptions[0];
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.$graphChange.unsubscribe();
  }
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
}
