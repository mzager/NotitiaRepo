import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { GraphConfig } from './../../../model/graph-config.model';
import { PathwaysConfigModel } from './pathways.model';

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
