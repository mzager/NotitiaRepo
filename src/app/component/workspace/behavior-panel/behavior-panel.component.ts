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
  clearSelection: EventEmitter<GraphConfig> = new EventEmitter();
  @Output()
  invertSelection: EventEmitter<GraphConfig> = new EventEmitter();
  @Output()
  saveSelection: EventEmitter<{ config: GraphConfig; name: string }> = new EventEmitter();
  @Output()
  searchSelection: EventEmitter<GraphConfig> = new EventEmitter();

  private _config: GraphConfig;
  public form: FormGroup;

  public cohortSearch = '';
  public cohortName = '';

  private _selectionToolConfig: SelectionToolConfig;
  public selectionTypes: Array<SelectionToolConfig> = [];

  onAction($event: MatSelectChange): void {
    if ($event.value === null) {
      return;
    }
    switch ($event.source.value) {
      case 'clear':
        this.clearSelection.emit(this._config);
        break;
      case 'invert':
        this.invertSelection.emit(this._config);
        break;
    }
    $event.source.value = null;
  }

  onSearch(): void {}

  onSaveSelection(): void {
    const cohortName = this.cohortName;
    this.cohortName = '';
    this.saveSelection.emit({ config: this._config, name: cohortName });
  }

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
