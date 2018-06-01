import { DataTable } from 'app/model/data-field.model';
import { PathwaysConfigModel } from './pathways.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pathways-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div></div>`
})
export class PathwaysFormComponent {


  @Output() configChange = new EventEmitter<GraphConfig>();

  private _config: PathwaysConfigModel;
  get config(): PathwaysConfigModel { return this._config; }
  @Input() set config(v: PathwaysConfigModel) {
    if (v === null) { return; }
    this._config = v;
  }

  constructor() {
  }
}
