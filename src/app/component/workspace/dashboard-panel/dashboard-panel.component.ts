import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import {
  pie,
  arc,
  Arc,
  DefaultArcObject,
  easeBounce,
  easeCubicInOut,
  mouse,
  rgb,
  select,
  interpolate,
  interpolateObject,
  selection,
  scaleBand,
  scaleLinear,
  range,
  ScaleBand,
  ScaleLinear,
  axisBottom,
  axisLeft,
  axisRight
} from 'd3';
import * as d3 from 'd3';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { StatFactory } from './../../../service/stat.factory';
import { StatVegaFactory } from './../../../service/stat.vega.factory';
import { ChartTypeEnum } from '../../../model/enum.model';
declare const $: any;

// declare const vega: any;
// declare const vegaTooltip: any;

@Component({
  selector: 'app-workspace-dashboard-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements AfterViewInit, OnDestroy {
  private statFactory: StatFactory;
  private container: any;

  @ViewChild('chartContainer') chartContainer: ElementRef;
  @Output() hide = new EventEmitter<any>();
  private _config: GraphConfig;
  get config(): GraphConfig {
    return this._config;
  }
  @Input() set config(value: GraphConfig) {
    this._config = value;
    if (this.container === undefined) {
      return;
    }
    this.drawStats();
  }

  drawStats(): void {
    Promise.all([this.statFactory.getCohortsStats(this.config)]).then(results => {
      const allResults = results.reduce((p, c) => p.concat(...c), []);

      allResults.forEach(result => {
        // data
        const data = result.stats[6].data as Array<{ mylabel: string; myvalue: number }>;
        const dataName = result.stats[6].name;
        console.log(data);

        const w = 500;
        const h = 300;
        // margins
        const margin = { top: 30, bottom: 80, left: 30, right: 20 };

        // width & height
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;

        // Scales
        const xScale = d3.scaleBand()
          .domain(
            data.map(d => (d.mylabel)))
          .range([margin.left, width])
          .padding(0.1);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data, (d => (d.myvalue)))])
          .range([height, margin.top]);

        // Call yAxis
        const yAxis = d3.axisLeft(yScale);

        // Append 'g' & 'rect'
        const svg = d3
          .select(this.chartContainer.nativeElement)
          .append('svg')
          .attr('width', w)
          .attr('height', h);

        svg
          .append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(' + margin.left + ',0)')
          .call(yAxis);

        svg
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('fill', '#1e88e5')
          .on('mouseover', function() {
            d3.select(this).attr('fill', '#6ab7ff');
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition('colorfade')
              .duration(250)
              .attr('fill', '#1e88e5');
          })

          .attr('x', (d => (xScale(d.mylabel))))
          .attr('width', xScale.bandwidth())
          .attr('y', height)

          .transition('bars')
          .delay(function(d, i) {
            return i * 50;
          })
          .duration(1000)

          .attr('y', (d => (yScale(d.myvalue))))
          .attr('height', (d => (height - yScale(d.myvalue))));

        svg
          .selectAll('.val-label')
          .data(data)
          .enter()
          .append('text')
          .classed('val-label', true)

          .attr('x', (d => (xScale(d.mylabel) + xScale.bandwidth() / 2)))
          .attr('y', height)

          .transition('label')
          .delay(function(d, i) {
            return i * 50;
          })
          .duration(1000)

          .attr('y', (d => (yScale(d.myvalue) - 4)))
          .attr('text-anchor', 'middle')
          .text((d => (d.myvalue)));

        svg
          .selectAll('.bar-label')
          .data(data)
          .enter()
          .append('text')
          .classed('bar-label', true)

          .attr('transform', function(d, i) {
            return (
              'translate(' +
              (xScale(d.mylabel) + xScale.bandwidth() / 2 - 8) +
              ',' +
              (height + 15) +
              ')' +
              ' rotate(45)'
            );
          })

          .attr('text-anchor', 'left')
          .text(d => (d.mylabel));


        // // TODO : Need to figure out what's wrong with the data for year of death.
        // result.stats = result.stats.filter(v => v.name !== 'year of death');
        // // const id = 'cc' + Math.random().toString(36).substring(7);
        // // tslint:disable-next-line:max-line-length
        // const cohortDiv = this.container.append(
        //   '<div style='font-size:2rem; font-weight: 300; margin-bottom:20px; margin-top:10px;'>' +
        //     result.cohort.n +
        //     '</div>'
        // );
        // result.stats.forEach(stat => {
        //   const id2 =
        //     'cc' +
        //     Math.random()
        //       .toString(36)
        //       .substring(7);
        //   const div = cohortDiv.append(
        //     '<div id='' + id2 + '' style='display:inline-block;padding-bottom:40px;padding-right:20px;'></div>'
        //   );
        //   this.statVegaFactory.drawChartObject(stat, ChartTypeEnum.HISTOGRAM, id2, div);
        // });
      });
    });
  }

  closeClick(): void {
    this.hide.emit();
  }

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.statFactory = StatFactory.getInstance(this.dataService);
    // this.statVegaFactory = StatVegaFactory.getInstance();
    this.drawStats();
  }
  constructor(private cd: ChangeDetectorRef, private dataService: DataService) {}
}
