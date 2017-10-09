import { GraphEnum } from 'app/model/enum.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { Component, Input, Output, ChangeDetectionStrategy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-workspace-workspace-panel',
  templateUrl: './workspace-panel.component.html',
  styleUrls: ['./workspace-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspacePanelComponent implements AfterViewInit  {

  @Input() set config(value: WorkspaceConfigModel) {
    this.controlOptions = [
      'Workspace', 'Graph A', 'Graph B', 'Edges'
    ];
    this.layoutOptions = [
      WorkspaceLayoutEnum.HORIZONTAL, WorkspaceLayoutEnum.VERTICAL, WorkspaceLayoutEnum.OVERLAY
    ];
    this.form = this.fb.group({
      layout: value.layout,
      controlOption: this.controlOptions[0]
    });
      // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }

  @Output() configChange: EventEmitter<WorkspaceConfigModel> = new EventEmitter();

  layoutOptions: Array<string>;
  controlOptions: Array<string>;
  form: FormGroup;

  ngAfterViewInit(): void {
  }

 

  constructor(private fb: FormBuilder) { }

}
