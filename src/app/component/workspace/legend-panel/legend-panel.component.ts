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
export class LegendPanelComponent implements AfterViewInit {

  // Components
  @ViewChild('tabs') private tabs: ElementRef;
  @ViewChild('legendGraphA') private elLegendA: ElementRef;
  @ViewChild('legendGraphB') private elLegendB: ElementRef;
  @ViewChild('edges') private elEdges: ElementRef;

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

  private render(container: ElementRef, legendItems: Array<Legend>) {

    const el = d3.select(container.nativeElement);
    el.selectAll('*').remove();
    if (legendItems.length === 0) {
      return;
    }

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

    // group.append('text')
    //   .attr('x', 0)
    //   .attr('y', yOffset + 15)
    //   .attr('stroke', '0x039BE5')
    //   .style('font-size', '10px')
    //   .text((container === this.elLegendA) ? 'GRAPH A' : 'GRAPH B');
    // yOffset += 30;

    for (let i = 0, l = legendItems.length; i < l; i++) {

      const legend: Legend = legendItems[i];

      if (legend.display === 'CONTINUOUS') {
        switch (legend.type) {
          case 'COLOR':
            group.append('text')
              .attr('x', 0)
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .style('font-size', '10px')
              .text(legend.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
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
              .attr('fill', '#9e9e9e')
              .style('font-size', '10px');

            group.append('text')
              .text(legend.labels[1])
              .attr('x', '180px')
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .style('text-anchor', 'end')
              .style('font-size', '10px');

            yOffset += 20;
            break;
          case 'SIZE':
            group.append('text')
              .attr('x', 0)
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .style('font-size', '10px')
              .text(legend.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
            yOffset += 20;

            group.append('polyline')
              .attr('points', '0 ' + yOffset + ', 0 ' + (yOffset + 20) + ', 180 ' + (yOffset + 20) + ', 0 ' + yOffset)
              .style('fill', '#039BE5');
            yOffset += 20;

            group.append('text')
              .text(legend.labels[0])
              .attr('x', 0)
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .style('font-size', '10px');

            group.append('text')
              .text(legend.labels[1])
              .attr('x', '180px')
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .style('text-anchor', 'end')
              .style('font-size', '10px');
            yOffset += 20;
            break;
        }
      }
      if (legend.display === 'DISCRETE') {
        switch (legend.type) {
          case 'COLOR':
            group.append('text')
              .text('Color')
              .attr('x', '0px')
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .attr('font-size', '10px');
            yOffset += 20;
            for (let si = 0, sl = legend.labels.length; si < sl; si++) {

              const label = legend.labels[si].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
              let color = legend.values[si].toString(16);
              if (color.length < 6) { color = '0' + color; }
              if (color.length < 6) { color = '0' + color; }

              group.append('path')
                .attr('d', symbol.type(d3Shape.symbolSquare))
                .style('fill', '#' + color)
                .attr('transform', () => 'translate( 6, ' + (yOffset + 10) + ')');

              group.append('text')
                .text(label)
                .attr('x', '25px')
                .attr('y', yOffset + 15)
                .attr('fill', '#9e9e9e')
                .attr('font-size', '10px');
              yOffset += 20;

            }
            break;
          case 'SHAPE':
            group.append('text')
              .text('Shape')
              .attr('x', '0px')
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .attr('font-size', '10px');
            yOffset += 20;
            for (let si = 0, sl = legend.labels.length; si < sl; si++) {

              const label = legend.labels[si].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
              let shape = legend.values[si];
              shape = (shape === ShapeEnum.CIRCLE) ? d3.symbolCircle :
                (shape === ShapeEnum.SQUARE) ? d3.symbolSquare :
                  (shape === ShapeEnum.TRIANGLE) ? d3.symbolTriangle :
                    d3.symbolWye;

              group.append('path')
                .attr('d', symbol.type(shape))
                .style('fill', '#039BE5')
                .attr('transform', () => 'translate( 6, ' + (yOffset + 10) + ')');

              group.append('text')
                .text(label)
                .attr('x', '25px')
                .attr('y', yOffset + 15)
                .attr('fill', '#9e9e9e')
                .attr('font-size', '10px');
              yOffset += 20;
            }

            break;
          case 'SIZE':
            group.append('text')
              .text('Size')
              .attr('x', '0px')
              .attr('y', yOffset + 15)
              .attr('fill', '#9e9e9e')
              .attr('font-size', '10px');
            yOffset += 20;
            for (let si = 0, sl = legend.labels.length; si < sl; si++) {

              const label = legend.labels[si].replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
              let size = legend.values[si];
              size = (size === SizeEnum.XL) ? 1 :
                (size === SizeEnum.L) ? 0.8 :
                  (size === SizeEnum.M) ? 0.6 :
                    0.4;

              group.append('path')
                .attr('d', symbol.type(d3.symbolCircle))
                .style('fill', '#039BE5')
                .attr('transform', () => 'translate( 6, ' + (yOffset + 10) + ') scale(' + size + ')');

              group.append('text')
                .text(label)
                .attr('x', '25px')
                .attr('y', yOffset + 15)
                .attr('fill', '#9e9e9e')
                .attr('font-size', '10px');
              yOffset += 20;
            }
            break;
        }
      }
      yOffset += 5;
    }
    svg.attr('height', yOffset);
  }

  ngAfterViewInit() {
    $(this.tabs.nativeElement).tabs();
  }

  constructor() { }
}
