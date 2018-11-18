import * as TWEEN from '@tweenjs/tween.js';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Renderer2,
  Input
} from '@angular/core';
import { ModalService } from 'app/service/modal-service';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from '../../../model/graph-config.model';
import { Renderer3 } from '@angular/core/src/render3/interfaces/renderer';
import { WorkspaceConfigModel } from 'app/model/workspace.model';

@Component({
  selector: 'app-workspace-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InfoPanelComponent implements AfterViewInit, OnDestroy {
  static showDefault: EventEmitter<null> = new EventEmitter();
  static showMessage: EventEmitter<Array<{ key: string; value: string }>> = new EventEmitter();

  private _workspaceConfig: WorkspaceConfigModel;
  private _graphAConfig: GraphConfig;
  private _graphBConfig: GraphConfig;
  private _workspaceMessage: Array<{ key: string; value: string }> = [];
  public graphAInfo: Array<{ key: string; value: string }> = [];
  public graphBInfo: Array<{ key: string; value: string }> = [];
  public message: Array<{ key: string; value: string }> = [];

  @Input()
  set workspaceConfig(config: WorkspaceConfigModel) {
    this._workspaceConfig = config;
  }
  @Input()
  set graphAConfig(config: GraphConfig) {
    if (config === null) {
      return;
    }
    // { key: 'Data Set', value: config.datasetName },
    this.message = this.graphAInfo = [
      { key: 'Data Table', value: config.table.label },
      { key: 'Analysis', value: config.label },
      { key: 'Cohort', value: config.cohortName },
      { key: 'Gene Set', value: config.markerName }
    ];
    this._graphAConfig = config;
    this.cd.detectChanges();
  }

  @Input()
  set graphBConfig(config: GraphConfig) {
    if (config === null) {
      return;
    }
    this._graphBConfig = config;
  }

  private onShowDefault(): void {
    this.message = this.graphAInfo;
    this.cd.detectChanges();
  }
  private onShowMessage(value: Array<{ key: string; value: string }>): void {
    this.message = value;
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {}
  constructor(
    private cd: ChangeDetectorRef,
    private dataService: DataService,
    public ms: ModalService,
    public renderer: Renderer2
  ) {
    InfoPanelComponent.showDefault.subscribe(this.onShowDefault.bind(this));
    InfoPanelComponent.showMessage.subscribe(this.onShowMessage.bind(this));
  }
}
