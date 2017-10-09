import { LegendItem } from './../../../model/legend.model';
import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LegendPanelEnum, ShapeEnum, SizeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Color from 'd3-color';
import * as d3 from 'd3';
declare var $: any;

@Component({
  selector: 'app-workspace-legend-panel',
  templateUrl: './legend-panel.component.html',
  styleUrls: ['./legend-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendPanelComponent implements AfterViewInit {

  // Components
  @ViewChild('legendGraphA') private elLegendA: ElementRef;
  @ViewChild('legendGraphB') private elLegendB: ElementRef;

  @Input()
  private set graphAData(data: any) {
    if (data === undefined) { return; }
    if (data === null) { return; }
    LegendPanelComponent.updateLegend(this.elLegendA, data.legendItems);
  }
  @Input()
  private set graphBData(data: any) {
    if (data === undefined) { return; }
    if (data === null) { return; }
    LegendPanelComponent.updateLegend(this.elLegendB, data.legendItems);
  }
  @Input() edgeLegend: Array<Legend>;
  @Input() legendPanelTab;
  @Output() tabChange = new EventEmitter();

  private static toIcon = (type: string, li: LegendItem): string => {
    switch (type) {
      case 'SHAPE':
        switch (li.value) {
          case ShapeEnum.CIRCLE:
            return '<div class="legend-shape legend-shape-circle"></div>';
          case ShapeEnum.CONE:
            return '<div class="legend-shape legend-shape-cone"></div>';
          case ShapeEnum.SQUARE:
            return '<div class="legend-shape legend-shape-square"></div>';
          case ShapeEnum.TRIANGLE:
            return '<div class="legend-shape legend-shape-triange"></div>';
        }
        break;
      case 'SIZE':
        switch (li.value) {
          case SizeEnum.S:
            return '<i class="material-icons legend-size" style="font-size:4px;position:relative;left:0px;top:4px;">lens</i>';
          case SizeEnum.M:
            return '<i class="material-icons legend-size" style="font-size:8px;position:relative;left:0px;top:4px;">lens</i>';
          case SizeEnum.L:
            return '<i class="material-icons legend-size" style="font-size:12px;position:relative;left:0px;top:5px">lens</i>';
          case SizeEnum.XL:
            return '<i class="material-icons legend-size" style="font-size:16px;position:relative;left:0px;top:4px">lens</i>';
        }
        break;
      case 'COLOR':
        return `<div class="legend-shape legend-shape-square" style="background-color:${LegendPanelComponent.toHex(li.value)}"></div>`;
    }
    return '';
  }

  private static toHex = (dec) => {
    let hex = dec.toString(16);
    while (hex.length < 6) { hex = '0' + hex; }
    return '#' + hex;
  }

  private static updateLegend(container: ElementRef, data: Array<any>): void {
    if (data === undefined) { return; }
    const el = d3.select(container.nativeElement);

    // Append Type To All Legend Items
    data = data.map(datum => Object.assign({}, datum, {
      legendItems: datum.legendItems.map(li => Object.assign({}, li, { type: datum.type }))
    }));

    let sections = el.selectAll('.legend-section') // Update
      .data(data.filter(v => v.legendItems.length > 1));

    sections.exit().remove(); // Exit

    sections = sections.enter()  // Enter
        .append('div')
        .attr('class', 'legend-section')
      .merge(sections) // Update + Enter
        .text(d => d.type + ' // ' + d.name );

    const items = sections.selectAll('.legend-item')
      .data(d => d.legendItems as Array<LegendItem> );

      items.enter()
        .append('div')
        .attr('class', d => 'legend-item')
        .html(d => LegendPanelComponent.toIcon(d.type, d) + `<span class="legend-text">${d.name}</span>` );

      items.exit().remove();

      items
        .attr('class', d => 'legend-item')
        .html(d => LegendPanelComponent.toIcon(d.type, d) + '<span class="legend-text">' + d.name + '</span>' );

  }

  ngAfterViewInit() {
  }


  constructor() { }
}




