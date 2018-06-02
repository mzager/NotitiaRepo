import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { Legend } from './../../../model/legend.model';
import { GraphData } from './../../../model/graph-data.model';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';

import {
  Component, Input, Output, ChangeDetectionStrategy, EventEmitter, AfterViewInit,
  ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation, OnDestroy
} from '@angular/core';
import { ShapeEnum, SizeEnum, DataTypeEnum } from 'app/model/enum.model';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Color from 'd3-color';
import * as d3Shape from 'd3-shape';
import * as d3 from 'd3';
import { GraphConfig } from '../../../model/graph-config.model';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';


@Component({
  selector: 'app-workspace-legend-panel',
  templateUrl: './legend-panel.component.html',
  styleUrls: ['./legend-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class LegendPanelComponent implements AfterViewInit, OnDestroy {

  public allLegends: Array<Legend> = [];
  public updateLegend = _.debounce(this.update, 600);

  private _config: GraphConfig;
  @Input() public set config(value: GraphConfig) {
    if (value === null) { return; }
    this._config = value;
    this.updateLegend();
  }

  private _decorators: Array<DataDecorator> = [];
  @Input() public set decorators(value: Array<DataDecorator>) {
    if (value === null) { return; }
    this._decorators = value;
    this.updateLegend();
  }

  public _legends: Array<Legend> = [];
  @Input() public set legends(value: Array<Legend>) {
    if (value === null) { return; }
    this._legends = value;
    this.updateLegend();
  }

  //   // formatValues(legend: Legend): void {
  //   if(legend.type === 'COLOR') {
  //   for (let i = 0; i < legend.values.length; i++) {
  //     if (!isNaN(legend.values[i])) {
  //       legend.values[i] = '#' + (0xffffff + legend.values[i] + 1).toString(16).substr(1);
  //     }
  //   }
  // } else if (legend.type === 'SHAPE') {
  //   for (let i = 0; i < legend.values.length; i++) {
  //     legend.values[i] = './assets/shapes/shape-' + legend.values[i] + '-solid-legend.png';
  //   }
  // }
  // }
  public select(): void {
  }

  public deselect(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {

  }

  legendFormatter(legend: Legend): Legend {
    const rv = Object.assign({}, legend);
    if (rv.type === 'COLOR') {
      for (let i = 0; i < rv.values.length; i++) {
        if (!isNaN(rv.values[i])) {
          legend.values[i] = '#' + (0xffffff + legend.values[i] + 1).toString(16).substr(1);
        }
      }
    } else if (legend.type === 'SHAPE') {
      for (let i = 0; i < rv.values.length; i++) {
        if (!isNaN(rv.values[i])) {
          legend.values[i] = './assets/shapes/shape-' + legend.values[i] + '-solid-legend.png';
        }
      }
    }
    return rv;
  }

  public update(): void {
    const decorators = this._decorators.map(decorator => this.legendFormatter(decorator.legend));
    const legends = this._legends.map(legend => this.legendFormatter(legend));
    this.allLegends = [].concat(...decorators, ...legends);
    this.cd.detectChanges();
  }

  constructor(public cd: ChangeDetectorRef) { }
}
