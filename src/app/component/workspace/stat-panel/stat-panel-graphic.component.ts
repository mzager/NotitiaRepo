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
  ScaleLinear
} from 'd3';
import * as chroma from 'chroma-js';
import { debug } from 'util';
export class StatPanelGraphicOptions {
  public type: 'BAR' | 'PIE' = 'BAR';
  public data: Array<{ name: string; value: number; color?: string }> = [];
  public outerRadius = 100;
  public innerRadius = 75;
  public hoverRadius = 160;
  public spaceHover = 10;
  public spaceActive = 30;
  public animationTime = 1000;
  public easing = easeCubicInOut;
  public size = 200;
  public barHeight = 30;
  public gap = 0;
  public padding = 0;
  public colors = [
    '#b3e5fc',
    '#81d4fa',
    '#4fc3f7',
    '#29b6f6',
    '#03a9f4',
    '#039be5'
    // '#f44336',
    // '#e91e63',
    // '#9c27b0',
    // '#673ab7',
    // '#3f51b5',
    // '#2196f3',
    // '#03a9f4',
    // '#00bcd4',
    // '#009688',
    // '#4caf50',
    // '#8bc34a',
    // '#cddc39',
    // '#ffeb3b',
    // '#ffc107',
    // '#ff9800',
    // '#ff5722',
    // '#795548',
    // '#9e9e9e',
    // '#607d8b'
  ];
  public showOnStart = true; // call transitionForward() on start
}
export class StatPanelPieComponent {
  private _container: any;
  private _g: any;
  private _options: StatPanelGraphicOptions;
  private _arc: any;
  private _pie;

  public arcTweenCreate(d, j, n) {
    d.startAngle = d.endAngle = 0;
    const i = interpolate(d, n[j]._current);
    n[j]._current = i(0);
    return t => {
      return this._arc(i(t));
    };
  }
  public arcTweenRemove(d, j, n) {
    n[j]._current.startAngle = n[j]._current.endAngle = 0;
    const i = interpolate(d, n[j]._current);
    n[j]._current = i(0);
    return t => {
      return this._arc(i(t));
    };
  }
  public arcTweenUpdate(d, j, n) {
    const i = interpolate(n[j]._current, d);
    n[j]._current = i(0);
    return t => {
      return this._arc(i(t));
    };
  }
  public key(d) {
    return d.data.name;
  }
  public findNeighborArc(i, data0, data1, key) {
    let d, obj;
    if ((d = this.findPreceding(i, data0, data1, key))) {
      obj = Object.assign({}, d);
      obj.startAngle = d.endAngle;
      return obj;
    } else if ((d = this.findFollowing(i, data0, data1, key))) {
      obj = Object.assign({}, d);
      obj.endAngle = d.startAngle;
      return obj;
    }

    return null;
  }

  public labelPositonY(d, i, n): number {
    if (d.len < 8) {
      const offset = d.len * 14 * 0.5;
      return i * 14 - offset + 4;
    }
    const itemsPerRow = d.len / 2;
    const adjustedIndex = i > itemsPerRow ? i - itemsPerRow : i;
    return adjustedIndex * 14 - itemsPerRow * 14 * 0.5 + 4;
  }
  public labelPositonX(d, i): number {
    if (d.len < 8) {
      return -41;
    }
    const itemsPerRow = d.len / 2;
    return i > itemsPerRow ? 30 : -41;
  }
  public circlePositonY(d, i, n): number {
    if (d.len < 8) {
      const offset = d.len * 14 * 0.5;
      return i * 14 - offset;
    }
    const itemsPerRow = d.len / 2;
    const adjustedIndex = i > itemsPerRow ? i - itemsPerRow : i;
    return adjustedIndex * 14 - itemsPerRow * 14 * 0.5;
  }
  public circlePositonX(d, i, n): number {
    if (d.len < 8) {
      return -48;
    }
    const itemsPerRow = d.len / 2;
    return i > itemsPerRow ? 23 : -48;
  }
  // Find the element in data0 that joins the highest preceding element in data1.
  public findPreceding(i, data0, data1, keyFn) {
    const m = data0.length;
    while (--i >= 0) {
      const k = keyFn(data1[i]);
      for (let j = 0; j < m; ++j) {
        if (keyFn(data0[j]) === k) {
          return data0[j];
        }
      }
    }
  }

  // Find the element in data0 that joins the lowest following element in data1.
  public findFollowing(i, data0, data1, keyFn) {
    const n = data1.length,
      m = data0.length;
    while (++i < n) {
      const k = keyFn(data1[i]);
      for (let j = 0; j < m; ++j) {
        if (keyFn(data0[j]) === k) {
          return data0[j];
        }
      }
    }
  }

  public create(value: StatPanelGraphicOptions): void {
    this._options = value;
    this._g = this._container
      .append('g')
      .attr('class', 'graph')
      .attr('transform', 'translate(' + this._options.size / 2 + ',' + this._options.size / 2 + ')');
    this._arc = arc();
    this._pie = pie<{ name: string; value: number; color?: string }>()
      .value(d => d.value)
      .sort(null);
    this._arc.innerRadius(this._options.innerRadius).outerRadius(this._options.outerRadius);
    const path = this._g.selectAll('path');
    const data = this._pie(this._options.data);
    path
      .data(data, this.key)
      .enter()
      .append('path')
      .each((d, i, n) => {
        n[i]._previous = Object.assign({}, d);
        n[i]._current = Object.assign({}, d);
      })
      .attr('fill', function(d, i) {
        return d.data.color;
      })
      .transition()
      .duration(this._options.animationTime)
      .attrTween('d', this.arcTweenCreate.bind(this));

    // Create Circles First Time
    const circles = this._g.selectAll('circle').data(this._options.data);
    circles
      .enter()
      .append('circle')
      .attr('cx', this.circlePositonX)
      .attr('cy', this.circlePositonY)
      .attr('r', 4)
      .style('fill', function(d) {
        return d.color;
      });

    // Create Circles First Time
    const txt = this._g.selectAll('text').data(this._options.data);
    txt
      .enter()
      .append('text')
      .attr('class', 'bar-value')
      .attr('x', this.labelPositonX)
      .attr('y', this.labelPositonY)
      .attr('opacity', 1)
      .attr('font-family', 'Lato')
      .attr('text-anchor', 'start')
      .attr('font-size', 11)
      .text(d => d.name);
  }
  public update(value: StatPanelGraphicOptions): void {
    this._options = value;
    this._arc.innerRadius(this._options.innerRadius).outerRadius(this._options.outerRadius);
    let path = this._g.selectAll('path');
    const prevData = path.data();
    const nextData = this._pie(this._options.data);
    path = path.data(nextData);
    path
      .transition()
      .duration(this._options.animationTime)
      .attrTween('d', this.arcTweenUpdate.bind(this));

    path
      .enter()
      .append('path')
      .each((d, i, n) => {
        const narc = this.findNeighborArc(i, prevData, nextData, this.key);
        if (narc) {
          n[i]._current = narc;
          n[i]._previous = narc;
        } else {
          n[i]._current = d;
        }
      })
      .attr('fill', function(d, i) {
        return d.data.color;
      })
      .transition()
      .duration(this._options.animationTime)
      .attrTween('d', this.arcTweenUpdate.bind(this));

    path
      .exit()
      .datum((d, i) => {
        return this.findNeighborArc(i, nextData, prevData, this.key) || d;
      })
      .transition()
      .duration(this._options.animationTime)
      .attrTween('d', this.arcTweenUpdate.bind(this))
      .remove();

    const circles = this._g.selectAll('circle').data(this._options.data);

    circles
      .attr('cx', this.circlePositonX)
      .attr('cy', this.circlePositonY)
      .style('fill', function(d) {
        return d.color;
      });
    circles
      .enter()
      .append('circle')
      .attr('cx', this.circlePositonX)
      .attr('cy', this.circlePositonY)
      .attr('r', 4)
      .style('fill', function(d) {
        return d.color;
      });

    circles.exit().remove();

    const txt = this._g.selectAll('text').data(this._options.data);
    txt
      .text(d => d.name)
      .attr('y', this.labelPositonY)
      .attr('x', this.labelPositonX)
      .attr('text-anchor', 'start');
    txt
      .enter()
      .append('text')
      .attr('class', 'bar-value')
      .attr('x', this.labelPositonX)
      .attr('y', this.labelPositonY)
      .attr('opacity', 1)
      .attr('font-family', 'Lato')
      .attr('text-anchor', 'start')
      .attr('font-size', 11)
      .text(d => d.name);
    txt.exit().remove();
  }
  public remove(value: StatPanelGraphicOptions): void {
    const txt = this._g.selectAll('text').data([]);
    txt.exit().remove();
    const circles = this._g.selectAll('circle').data([]);
    circles.exit().remove();
    const path = this._g.selectAll('path');
    path
      .data([])
      .exit()
      .transition()
      .duration(this._options.animationTime)
      .attrTween('d', this.arcTweenRemove.bind(this))
      .remove();
  }
  constructor(container: any) {
    this._container = container;
  }
}
export class StatPanelBarComponent {
  private _container: any;
  private _g: any;
  private _options: StatPanelGraphicOptions;
  private _yScale: ScaleBand<number>;
  private _xScale: ScaleLinear<number, number>;
  public create(value: StatPanelGraphicOptions): void {
    this._g = this._container.append('g').attr('class', 'graph');
    this._xScale = scaleLinear().range([value.size, 0]);
    this._yScale = scaleBand<number>().range([0, value.size]);
    this.update(value);
  }
  public update(value: StatPanelGraphicOptions): void {
    this._options = value;
    this._xScale.domain([0, this._options.data.reduce((p, c) => Math.max(p, c.value), -Infinity)]);
    this._yScale.domain(range(value.data.length));

    const bars = this._g.selectAll('.bar').data(this._options.data);
    bars
      .attr('y', (d, i) => this._yScale(i))
      .attr('x', 0)
      .attr('width', 0)
      .attr('height', this._yScale.bandwidth());
    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', function(d, i) {
        return d.color;
      })
      .attr('width', 0)
      .attr('height', this._yScale.bandwidth())
      .attr('y', (d, i) => this._yScale(i))
      .attr('x', 0)
      .merge(bars)
      .transition()
      .duration(this._options.animationTime)
      .delay(0.2)
      .attr('width', (d, i) => this._options.size - this._xScale(d.value))
      .attr('height', this._yScale.bandwidth())
      .attr('y', (d, i) => this._yScale(i));

    bars
      .exit()
      .transition()
      .duration(this._options.animationTime)
      .attr('width', 0)
      .remove();

    const txt = this._g.selectAll('text').data(this._options.data);
    txt.text(d => d.name).attr('y', (d, i) => this._yScale(i) + this._yScale.bandwidth() * 0.7);
    txt
      .enter()
      .append('text')
      .attr('class', 'bar-value')
      .attr('x', 5)
      .attr('opacity', 1)
      .attr('font-family', 'Lato')
      .attr('text-anchor', 'start')
      .attr('y', (d, i) => this._yScale(i) + this._yScale.bandwidth() * 0.7)
      .attr('font-size', 11)
      .text(d => d.name);
    txt.exit().remove();
  }
  public remove(value: StatPanelGraphicOptions): void {
    const txt = this._g.selectAll('text').data([]);
    txt.exit().remove();
    const bars = this._g.selectAll('.bar').data([]);
    bars
      .exit()
      .transition()
      .delay(0.2)
      .duration(this._options.animationTime)
      .attr('width', 0);

    // .attr('x', this._options.size * 0.5);
    // .remove();
  }
  constructor(container: any) {
    this._container = container;
  }
}
export class StatPanelGraphicComponent {
  private _options: StatPanelGraphicOptions = null;
  private _type = 'NONE';
  private _svg: any;
  public get options(): StatPanelGraphicOptions {
    return this._options;
  }
  public set options(value: StatPanelGraphicOptions) {
    let pieAction = 'NONE';
    let barAction = 'NONE';
    if (this._type === 'NONE') {
      if (value.type === 'PIE') {
        pieAction = 'CREATE';
      }
      if (value.type === 'BAR') {
        barAction = 'CREATE';
      }
    } else {
      if (this._type === 'PIE') {
        pieAction = value.type === 'PIE' ? 'UPDATE' : 'REMOVE';
        barAction = value.type === 'BAR' ? 'CREATE' : 'NONE';
      }
      if (this._type === 'BAR') {
        barAction = value.type === 'BAR' ? 'UPDATE' : 'REMOVE';
        pieAction = value.type === 'PIE' ? 'CREATE' : 'NONE';
      }
    }
    this._type = value.type + '';
    this._options = value;
    const len = this._options.data.length;
    const s = chroma.scale(['#b3e5fc', '#039be5']).domain([0, len]);
    this._options.data = this._options.data.map((v, i) => {
      return Object.assign(v, { len: len, color: s(i).hex() });
    });
    this._options.data = this._options.data.sort((a, b) => (a.value < b.value ? 1 : -1));
    this.drawPieChart(pieAction);
    this.drawBarChart(barAction);
  }
  private pie: StatPanelPieComponent;
  private bar: StatPanelBarComponent;

  private drawPieChart(mode: string): void {
    switch (mode) {
      case 'CREATE':
        this.pie.create(this.options);
        break;
      case 'UPDATE':
        this.pie.update(this.options);
        break;
      case 'REMOVE':
        this.pie.remove(this.options);
        break;
    }
  }

  private drawBarChart(mode: string): void {
    switch (mode) {
      case 'CREATE':
        this.bar.create(this.options);
        break;
      case 'UPDATE':
        this.bar.update(this.options);
        break;
      case 'REMOVE':
        this.bar.remove(this.options);
        break;
    }
  }

  constructor(target: any, opt: StatPanelGraphicOptions) {
    this._svg = select(target)
      .append('svg')
      .attr('width', opt.size)
      .attr('height', opt.size);
    this.pie = new StatPanelPieComponent(this._svg);
    this.bar = new StatPanelBarComponent(this._svg);
  }
}
