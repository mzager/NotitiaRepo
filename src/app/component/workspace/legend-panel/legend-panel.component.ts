import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { Legend } from './../../../model/legend.model';
import { GraphData } from './../../../model/graph-data.model';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';

import {
  Component, Input, Output, ChangeDetectionStrategy, EventEmitter, AfterViewInit,
  ViewChild, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { ShapeEnum, SizeEnum, DataTypeEnum } from 'app/model/enum.model';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Color from 'd3-color';
import * as d3Shape from 'd3-shape';
import * as d3 from 'd3';
import { GraphConfig } from '../../../model/graph-config.model';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-workspace-legend-panel',
  templateUrl: './legend-panel.component.html',
  styleUrls: ['./legend-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendPanelComponent implements AfterViewInit {

  public allLegends: Array<Legend> = [];
  // public items: Array<{ label: string, value: string }>;

  private _decorators: Array<Legend> = [];
  @Input() public set decorators(value: Array<DataDecorator>) {
    if (value === undefined) { return; }
    if (value === null) { return; }
    if (value.length === 0) { return; }
    this._decorators = value.map(decorator => {
      if (decorator.legend !== null) {
        this.formatValues(decorator.legend);
      }
      return decorator.legend;
    });
    this.updateLegend();
  }

  public _legends: Array<Legend> = [];
  @Input() public set legends(value: Array<Legend>) {
    if (value === undefined) { return; }
    if (value === null) { return; }
    if (value.length === 0) { return; }
    value.forEach(legend => {
      this.formatValues(legend);
    });
    this._legends = value;
    this.updateLegend();
  }

  formatValues(legend: Legend): void {
    if (legend.type === 'COLOR') {
      for (let i = 0; i < legend.values.length; i++) {
        if (!isNaN(legend.values[i])) {
          legend.values[i] = '#' + (0xffffff + legend.values[i] + 1).toString(16).substr(1);
        }
      }
    }
    // else if (legend.type === 'SHAPE') {
    //   debugger;
    //   for (let i = 0; i < legend.values.length; i++) {
    //     legend.values[i] = './assets/shapes/shape-' + legend.values[i] + '-solid-legend.png';
    //   }
    // }
  }
  public select(): void {
  }

  public deselect(): void {
  }

  ngAfterViewInit(): void {

  }

  public updateLegend(): void {
    this.allLegends = [].concat(...this._decorators, ...this._legends);
    requestAnimationFrame(v => {
      this.cd.markForCheck();
    });
  }

  constructor(public cd: ChangeDetectorRef) { }
}
