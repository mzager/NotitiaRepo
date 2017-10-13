import { GraphData } from './../../../model/graph-data.model';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';

import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { LegendPanelEnum, ShapeEnum, SizeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
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
export class LegendPanelComponent {

  // Components
  @ViewChild('legendGraphA') private elLegendA: ElementRef;
  @ViewChild('legendGraphB') private elLegendB: ElementRef;

  @Input()
  private set graphAData(data: GraphData) {
    // '/assets/legend-spectral.png';
    if (data === undefined) { return; }
    if (data === null) { return; }
    this.render(this.elLegendA, data.legendItems);
  }

  @Input()
  private set graphBData(data: GraphData) {
    if (data === undefined) { return; }
    if (data === null) { return; }
    this.render(this.elLegendB, data.legendItems);
  }

  @Input() edgeLegend: Array<Legend>;
  @Input() legendPanelTab;
  @Output() tabChange = new EventEmitter();

  // private static toIcon = (type: string, li: LegendItem): string => {
  //   switch (type) {
  //     case 'SHAPE':
  //       switch (li.value) {
  //         case ShapeEnum.CIRCLE:
  //           return '<div class='legend-shape legend-shape-circle'></div>';
  //         case ShapeEnum.CONE:
  //           return '<div class='legend-shape legend-shape-cone'></div>';
  //         case ShapeEnum.SQUARE:
  //           return '<div class='legend-shape legend-shape-square'></div>';
  //         case ShapeEnum.TRIANGLE:
  //           return '<div class='legend-shape legend-shape-triange'></div>';
  //       }
  //       break;
  //     case 'SIZE':
  //       switch (li.value) {
  //         case SizeEnum.S:
  //           return '<i class='material-icons legend-size' style='font-size:4px;position:relative;left:0px;top:4px;'>lens</i>';
  //         case SizeEnum.M:
  //           return '<i class='material-icons legend-size' style='font-size:8px;position:relative;left:0px;top:4px;'>lens</i>';
  //         case SizeEnum.L:
  //           return '<i class='material-icons legend-size' style='font-size:12px;position:relative;left:0px;top:5px'>lens</i>';
  //         case SizeEnum.XL:
  //           return '<i class='material-icons legend-size' style='font-size:16px;position:relative;left:0px;top:4px'>lens</i>';
  //       }
  //       break;
  //     case 'COLOR':
  //       return `<div class='legend-shape legend-shape-square' style='background-color:${LegendPanelComponent.toHex(li.value)}'></div>`;
  //   }
  //   return '';
  // }

  // private static toHex = (dec) => {
  //   let hex = dec.toString(16);
  //   while (hex.length < 6) { hex = '0' + hex; }
  //   return '#' + hex;
  // }

  private render(container: ElementRef, legendItems: Array<Legend>) {

    const el = d3.select(container.nativeElement);
    el.selectAll('*').remove();

    // Setup SVG With Linear Gradient
    const svg = el.append('svg')
      .attr('width', '180px');
    const colors = scaleSequential(interpolateSpectral);
    const defs = svg.append('defs');
    const legendGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    const noOfSamples = 20;
    const dataRange = colors.domain()[1] - colors.domain()[0];
    const stepSize = dataRange / noOfSamples;
    for (let i = 0; i < noOfSamples; i++) {
      legendGradient.append('stop')
        .attr('offset', (i / (noOfSamples - 1)))
        .attr('stop-color', colors(colors.domain()[0] + (i * stepSize)) as string);
    }

    // Container
    const group = svg.append('g')
      .attr('class', 'legendLinear');

    let yOffset = 0;
    const symbol = d3Shape.symbol().size(100);

    for (let i = 0, l = legendItems.length; i < l; i++) {

      const legend: Legend = legendItems[i];

      if (legend.display === 'CONTINUOUS') {

        group.append('text')
          .attr('x', 0)
          .attr('y', yOffset + 15)
          .attr('stroke', '0x333333')
          .style('font-size', '12px')
          .text(legend.name.toString());
        yOffset += 20;

        group.append('rect')
          .attr('x', 0)
          .attr('y', yOffset)
          .attr('width', '180px')
          .attr('height', '20px')
          .style('fill', 'url(#linear-gradient)');
        yOffset += 20;

        group.append('text')
          .text(legend.labels[0])
          .attr('x', 0)
          .attr('y', yOffset + 15)
          .attr('stroke', '0x333333')
          .style('font-size', '12px');

        group.append('text')
          .text(legend.labels[1])
          .attr('x', '180px')
          .attr('y', yOffset + 15)
          .attr('stroke', '0x333333')
          .style('text-anchor', 'end')
          .style('font-size', '12px');
      }
      if (legend.display === 'DISCRETE') {
        switch (legend.type) {
          case 'COLOR':

            for (let si = 0, sl = legend.labels.length; si < sl; si++) {

              const label = legend.labels[si];
              let color = legend.values[si].toString(16);
              if (color.length < 6) { color = '0' + color; }

              group.append('path')
                .attr('d', symbol.type(d3Shape.symbolSquare))
                .style('fill', '#' + color)
                .attr('transform', () => 'translate( 10, ' + (yOffset + 10) + ')');

              group.append('text')
                .text(label)
                .attr('x', '25px')
                .attr('y', yOffset + 15)
                .attr('stroke', '0x333333')
                .attr('font-size', '12px');
              yOffset += 20;

            }
            break;
          case 'SHAPE':
            for (let si = 0, sl = legend.labels.length; si < sl; si++) {

              const label = legend.labels[si];
              let shape = legend.values[si];
              shape = (shape === ShapeEnum.CIRCLE) ? d3.symbolCircle :
                  (shape === ShapeEnum.SQUARE) ? d3.symbolSquare :
                  (shape === ShapeEnum.TRIANGLE) ? d3.symbolTriangle :
                  d3.symbolWye;

              group.append('path')
                .attr('d', symbol.type(shape))
                .style('fill', '#333333')
                .attr('transform', () => 'translate( 10, ' + (yOffset + 10) + ')');

              group.append('text')
                .text(label)
                .attr('x', '25px')
                .attr('y', yOffset + 15)
                .attr('stroke', '0x333333')
                .attr('font-size', '12px');
              yOffset += 20;
            }

            break;
          case 'SIZE':

            break;
        }
      }
    }
  }

  constructor() { }
}
