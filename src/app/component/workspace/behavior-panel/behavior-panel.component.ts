import { FormGroup, FormBuilder } from '@angular/forms';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { GraphConfig } from 'app/model/graph-config.model';
import { SelectionTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { SelectionToolConfig } from 'app/model/selection-config.model';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-workspace-behavior-panel',
  templateUrl: './behavior-panel.component.html',
  styleUrls: ['./behavior-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BehaviorPanelComponent implements AfterViewInit {
  @Output()
  selectionToolChange: EventEmitter<SelectionToolConfig> = new EventEmitter();

  private _config: GraphConfig;
  public form: FormGroup;
  private _selectionToolConfig: SelectionToolConfig;
  public selectionTypes: Array<SelectionToolConfig> = [];

  @Input()
  set config(value: GraphConfig) {
    if (value === null) {
      return;
    }
    this._config = value;
    this.selectionTypes = SelectionToolConfig.getToolOptions(this._config);
    this.cd.markForCheck();
  }
  @Input()
  set selectionToolConfig(value: SelectionToolConfig) {
    this._selectionToolConfig = value;
    this.cd.markForCheck();
  }
  get selectionToolConfig(): SelectionToolConfig {
    return this._selectionToolConfig;
  }

  public selectionTypeChange(v: MatSelectChange): void {
    this.selectionToolChange.emit(v.value);
  }
  byLbl(p1: SelectionToolConfig, p2: SelectionToolConfig) {
    if (p2 === null) {
      return false;
    }
    return p1.label === p2.label;
  }
  ngAfterViewInit(): void {}

  constructor(private fb: FormBuilder, public cd: ChangeDetectorRef) {
    this.form = this.fb.group({
      navigation: [],
      selection: []
    });
  }
}
