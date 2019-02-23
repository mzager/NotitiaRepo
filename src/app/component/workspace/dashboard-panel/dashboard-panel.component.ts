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
<<<<<<< HEAD
  ViewEncapsulation
=======
  ViewEncapsulation,
  ElementRef
>>>>>>> 14ea53eb40bc082cc715bfb967dcbfdcf00d5755
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
  axisRight,
  interpolateHcl
} from 'd3';
import * as d3 from 'd3';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { StatFactory } from './../../../service/stat.factory';
import { StatVegaFactory } from './../../../service/stat.vega.factory';
import { ChartTypeEnum } from '../../../model/enum.model';
declare const $: any;

<<<<<<< HEAD
=======
// declare const vega: any;
// declare const vegaTooltip: any;

>>>>>>> 14ea53eb40bc082cc715bfb967dcbfdcf00d5755
@Component({
  selector: 'app-workspace-dashboard-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.scss']
})
export class DashboardPanelComponent implements AfterViewInit, OnDestroy {
  private statFactory: StatFactory;
<<<<<<< HEAD
  private statVegaFactory: StatVegaFactory;
  private container: any;

  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;
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
    this.container.empty();
    Promise.all([
      this.statFactory.getCohortsStats(this.config)
      // this.statFactory.getGenesetsStats(this.config)
    ]).then(results => {
      const allResults = results.reduce((p, c) => p.concat(...c), []);
      allResults.forEach(result => {
        // TODO : Need to figure out what's wrong with the data for year of death.
        result.stats = result.stats.filter(v => v.name !== 'year of death');
        // const id = 'cc' + Math.random().toString(36).substring(7);
        // tslint:disable-next-line:max-line-length
        const cohortDiv = this.container.append(
          '<div style="font-size:2rem; font-weight: 300; margin-bottom:20px; margin-top:10px;">' +
            result.cohort.n +
            '</div>'
        );
        result.stats.forEach(stat => {
          const id2 =
            'cc' +
            Math.random()
              .toString(36)
              .substring(7);
          const div = cohortDiv.append(
            '<div id="' + id2 + '" style="display:inline-block;padding-bottom:40px;padding-right:20px;"></div>'
          );
          this.statVegaFactory.drawChartObject(stat, ChartTypeEnum.HISTOGRAM, id2, div);
        });
      });
      // console.log(results);
    });
  }

  closeClick(): void {
    this.hide.emit();
  }

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.statFactory = StatFactory.getInstance(this.dataService);
    this.statVegaFactory = StatVegaFactory.getInstance();
    this.container = $(this.chartContainer.element.nativeElement);
=======
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

        // grab cohort name NEED break at cohort loop
        // tslint:disable-next-line:max-line-length
        // this.chartContainer.nativeElement.apply('<div style="font-size:1.2rem; font-weight: 300; margin-bottom:50px; margin-top:50px; text-transform:uppercase; letter-spacing: 1px; color: #1e88e5;">'
        // + result.cohort.n + '</div>');
            // tslint:disable-next-line:max-line-length
        //     this.chartContainer.nativeElement.innerHTML += '<div style="font-size:1.2rem; font-weight: 300; margin-bottom:50px; margin-top:50px; text-transform:uppercase; letter-spacing: 1px; color: #1e88e5;">'
        // + result.cohort.n + '</div>';
        // d3
        // .select(this.chartContainer.nativeElement)
        // .append('<div>hi</div>')
const c =  this.chartContainer.nativeElement as any;
c.insertAdjacentHTML('beforeend', '<div style="font-size:1.2rem; font-weight: 300; margin-bottom:50px; margin-top:50px; text-transform:uppercase; letter-spacing: 1px; color: #1e88e5;">'+result.cohort.n+'</div>' );

        debugger;

        result.stats.forEach(stat => {

        const myData = stat.data as Array<{ mylabel: string; myvalue: number; color?: any }>;
        const myTitle = stat.name;

        const w = 500;
        const h = 400;
        // margins
        const margin = { top: 40, bottom: 70, left: 30, right: 10 };

        // width & height
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;

                // colors
        const color = [
        '#e3f2fd',
        '#bbdefb',
        '#90caf9',
        '#29b6f6',
        '#64b5f6',
        '#42a5f5',
        '#2196f3',
        '#1e88e5',
        '#1976d2',
        '#1565c0',
        '#0d47a1',
                    ];

        // Scales
        const xScale = d3.scaleBand()
          .domain(
            myData.map(d => (d.mylabel)))
          .range([margin.left, width])
          .padding(0.1);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(myData, (d => (d.myvalue)))])
          .range([height, margin.top]);

        // Call yAxis & assign tick number
        const yAxis = d3.axisLeft(yScale).ticks(4);

        // Append 'svg'
        const svg = d3
          .select(this.chartContainer.nativeElement)
          .append('svg')
          .attr('width', w)
          .attr('height', h);

        svg
        // add yAxis
          .append('g')
          .attr('class', 'xAxisLabels')
          .attr('transform', 'translate(' + margin.left + ',0)')
          .call(yAxis);

        svg
        // draw bars
          .selectAll('rect')
          .data(myData)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('fill', function(d, i) { return color[i]; })
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
          // bar value labels
          .selectAll('.val-label')
          .data(myData)
          .enter()
          .append('text')
          .attr('x', (d => (xScale(d.mylabel) + xScale.bandwidth() / 2)))
          .attr('y', height)
          .transition('label')
          .delay(function(d, i) {
            return i * 50;
          })
          .duration(1000)
          .attr('class', 'xAxisLabels')
          .attr('y', (d => (yScale(d.myvalue) - 4)))
          .attr('text-anchor', 'middle')
          .text((d => (d.myvalue)));

        svg
          // x-axis labels
          .selectAll('.bar-label')
          .data(myData)
          .enter()
          .append('text')
          .attr('class', 'xAxisLabels')
          .attr('transform', function(d, i) {
            return (
              'translate(' +
              (xScale(d.mylabel) + xScale.bandwidth() / 2 - 8) + ',' + (height + 15) + ')' + ' rotate(45)'
            );
          })
          .attr('text-anchor', 'left')
          .text(d => (d.mylabel));

          // title
          svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('class', 'title')
        .text(myTitle);
      });
    }, this);
  });
  }

  closeClick(): void {
    this.hide.emit();
  }

  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.statFactory = StatFactory.getInstance(this.dataService);

>>>>>>> 14ea53eb40bc082cc715bfb967dcbfdcf00d5755
    this.drawStats();
  }
  constructor(private cd: ChangeDetectorRef, private dataService: DataService) {}
}
