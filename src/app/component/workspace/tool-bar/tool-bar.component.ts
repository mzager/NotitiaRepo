import { WorkspaceConfigModel } from 'app/model/workspace.model';
import {
  ChangeDetectionStrategy, OnInit, EventEmitter, Input, Output,
  Component, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
import { GraphEnum, GraphActionEnum, ToolEnum, WorkspaceLayoutEnum } from 'app/model/enum.model';
import { ElementRef } from '@angular/core/src/linker/element_ref';
import { ViewChild } from '@angular/core/src/metadata/di';
// import * as dat from 'dat.gui';
declare var dat: any;

@Component({
  selector: 'app-workspace-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ToolBarComponent implements OnInit {

  hideButtons = false;
  // @Input() selectedTool: ToolEnum;
  // @Input() selectedGraph: GraphEnum;
  // @Output() selectTool = new EventEmitter();
  // @Output() selectGraph = new EventEmitter();
  // @Output() graphAction = new EventEmitter();
  @Input() set workspaceConfig(value: WorkspaceConfigModel) {
    this.hideButtons = (value.layout === WorkspaceLayoutEnum.SINGLE);
    this.cd.detectChanges();
  }

  @Output() graphAToggle = new EventEmitter();
  @Output() graphBToggle = new EventEmitter();

  ngOnInit(): void {


  }

  constructor(private cd: ChangeDetectorRef) { }
}
