import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { GraphData } from 'app/model/graph-config.model';
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
  private legendToHtml(legend: Legend): string {
    let html = '';
    if (legend.display === 'CONTINUOUS') {
      html += 'Continuous: ' + legend.values.join('-');
    } else if (legend.display === 'DISCRETE') {
      debugger;
      html += '<ul>';
      html += legend.labels.reduce((p, c) => {
        p += '<li>' + c + '</li>';
        return p;
      }, '');
      html += '</ul>';
    }
    return html;
  }
  private render(container: ElementRef, legendItems: Array<Legend>) {

    const el = d3.select(container.nativeElement);

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
        .attr('stop-color', colors(colors.domain()[0] + (i * stepSize)) as string );
    }

    // Container
    const group = svg.append('g')
      .attr('class', 'legendLinear');

    const yOffset = 0;

    legendItems.forEach( legend => {
      if (legend.display === 'CONTINUOUS') {

        group.append('text')
          .attr('x', 0)
          .attr('y', yOffset)
          .text( legend.name.toString() );

        group.append('rect')
          .attr('x', 0)
          .attr('y', yOffset)
          .attr('width', '180px')
          .attr('height', '20px')
          .style('fill', 'url(#linear-gradient)');
      }
    });

    // const legends = group.data(legendItems);

    // legends.exit().remove();

    // legends.enter()
    //   .append('text')
    //   .text( v => v.name.toString() );




   

    // legendG.append('text')
    //     .text('200')
    //     .attr('x', 0)
    //     .attr('y', 35)
    //     .style('font-size', '12px');

    // legendG.append('text')
    //     .text('300')
    //     .attr('x', '180px')
    //     .attr('y', 35)
    //     .style('text-anchor', 'end')
    //     .style('font-size', '12px');
    // const elLegendItems = el.selectAll('.legendItem')
    //   .data( legendItems );
    
    // elLegendItems.exit().remove();

    // elLegendItems.enter()
    //     .append('svg')
    //     .attr('class', 'legendItem')
    //   .merge(elLegendItems)
    //     .append('rect')
    //     .attr('width', '180')
    //     .attr('height', '20')
    //        .attr('fill', 'url(assets/legend-spectral.png)');
    // .append('svg')
    // .html( d => this.legendToHtml( d ) );

  }

  // private static updateLegend(container: ElementRef, data: Array<any>): void {
  //   if (data === undefined) { return; }
  //   const el = d3.select(container.nativeElement);

  //   // Append Type To All Legend Items
  //   data = data.map(datum => Object.assign({}, datum, {
  //     legendItems: datum.legendItems.map(li => Object.assign({}, li, { type: datum.type }))
  //   }));

  //   let sections = el.selectAll('.legend-section') // Update
  //     .data(data.filter(v => v.legendItems.length > 1));

  //   sections.exit().remove(); // Exit

  //   sections = sections.enter()  // Enter
  //       .append('div')
  //       .attr('class', 'legend-section')
  //     .merge(sections) // Update + Enter
  //       .text(d => d.type + ' // ' + d.name );

  //   const items = sections.selectAll('.legend-item')
  //     .data(d => d.legendItems as Array<LegendItem> );

  //     items.enter()
  //       .append('div')
  //       .attr('class', d => 'legend-item')
  //       .html(d => LegendPanelComponent.toIcon(d.type, d) + `<span class='legend-text'>${d.name}</span>` );

  //     items.exit().remove();

  //     items
  //       .attr('class', d => 'legend-item')
  //       .html(d => LegendPanelComponent.toIcon(d.type, d) + '<span class='legend-text'>' + d.name + '</span>' );

  // }

  constructor() { }
}
