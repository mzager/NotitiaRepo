import { ModalService } from 'app/service/modal-service';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { WorkspaceLayoutEnum, VisualizationEnum } from './../../../model/enum.model';
import { DataTable } from './../../../model/data-field.model';
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
export class EdgePanelComponent implements AfterViewInit, OnDestroy {

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
  @Output() help: EventEmitter<any> = new EventEmitter();

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

  zIndex = 1000;
  focusSubscription: Subscription;
  layoutOptions: Array<string>;
  form: FormGroup;

  helpClick(): void {
    this.help.emit('EdgePanel');
  }

  edgePanelSetConfig(value: GraphConfig): void {
    const ecm: EdgeConfigModel = (value as EdgeConfigModel);
    ecm.database = this.graphAConfig.database;
    ecm.entityA = this.graphAConfig.entity;
    ecm.entityB = this.graphBConfig.entity;
    value.visualization = VisualizationEnum.EDGES;
    this.configChange.emit(value);
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private fb: FormBuilder, public ms: ModalService, private cd: ChangeDetectorRef) {

    this.layoutOptions = [
      WorkspaceLayoutEnum.SINGLE, WorkspaceLayoutEnum.HORIZONTAL, WorkspaceLayoutEnum.VERTICAL, WorkspaceLayoutEnum.OVERLAY
    ];

    this.focusSubscription = this.ms.$focus.subscribe(v => {
      this.zIndex = (v === 'edgePanel') ? 1001 : 1000;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.focusSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
  }
}
