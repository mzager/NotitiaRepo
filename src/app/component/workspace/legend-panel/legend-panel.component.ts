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
declare var $: any;

@Component({
  selector: 'app-workspace-legend-panel',
  templateUrl: './legend-panel.component.html',
  styleUrls: ['./legend-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendPanelComponent implements AfterViewInit {

  public legend: Legend;
  public items: Array<{ label: string, value: string }>;

  private _decorator: DataDecorator;
  public get decorator(): DataDecorator { return this._decorator; }
  @Input() public set decorator(value: DataDecorator) {
    this._decorator = value;
    this.legend = this._decorator.legend;

    switch (this.legend.type) {

      case 'COLOR':
        this.items = this.legend.labels.map((v, i) => {
          let color = this.legend.values[i];
          if (color === undefined) {
            color = '#333333';
          } else {
            color = (this.decorator.field.type === DataTypeEnum.STRING) ?
              ('#' + (this.legend.values[i]).toString(16)) : this.legend.values[i];
          }
          return {
            label: v,
            value: color
          };
        });
        break;

      case 'SHAPE':
        this.items = this.legend.labels.map((v, i) => ({
          label: v,
          value: './assets/shapes/shape-' + this.legend.values[i] + '-solid-legend.png'
        }));
        break;

    }

    this.cd.markForCheck();
  }


  public select(): void {
  }

  public deselect(): void {
  }

  ngAfterViewInit(): void {

  }

  constructor(public cd: ChangeDetectorRef) { }
}
