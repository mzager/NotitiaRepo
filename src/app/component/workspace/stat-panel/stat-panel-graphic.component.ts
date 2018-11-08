import { arc, Arc, DefaultArcObject, easeBounce, easeCubicInOut, mouse, rgb, select, interpolate, selection } from 'd3';
export class StatPanelGraphicOptions {
  public outerRadius = 90;
  public innerRadius = 75;
  public hoverRadius = 160;
  public spaceHover = 10;
  public spaceActive = 30;
  public animationTime = 1000;
  public easing = easeCubicInOut;
  public size = 200;
  public barHeight = 30;
  public gap = 0;
  public padding = 50;
  public colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#9e9e9e',
    '#607d8b'
  ];
  public showOnStart = true; // call transitionForward() on start
}
export class StatPanelGraphicComponent {
  private _svg: any;
  private _options: StatPanelGraphicOptions;
  private _data: Array<{ value: number; name: string; color: string }>;
  private _chart: 'PIE' | 'BAR';
  private _clipPath: any;
  private _transitionBack: Function;
  private _transitionForward: Function;

  public draw(data: Array<any>, chart: 'PIE' | 'BAR') {
    this._data = data;
    if (data.length <= this._options.colors.length) {
      this._data = this._data.map((v, i) => {
        return Object.assign(v, { color: this._options.colors[i] });
      });
    } else {
      alert('!!');
    }
    this._chart = chart;
  }

  public drawPieChart(options: StatPanelGraphicOptions): void {
    const drawArc = (startAngle: number, endAngle: number): Arc<any, DefaultArcObject> => {
      return arc()
        .startAngle(startAngle)
        .endAngle(endAngle)
        .innerRadius(this._options.innerRadius)
        .outerRadius(this._options.outerRadius);
    };

    const sum = this._data.map(v => v.value).reduce((p, c) => p + c);
    let accumulate = 0;
    this._data = this._data.map((d, i) =>
      Object.assign(d, {
        arc: drawArc(accumulate, (accumulate += (d.value / sum) * 2 * Math.PI))
      })
    );
    const g = this._svg.append('g').attr('class', 'pie');
    g.attr('transform', 'translate(' + this._options.size / 2 + ', ' + this._options.size / 2 + ')');

    const pie = g
      .selectAll('path')
      .data(this._data)
      .enter()
      .append('path')
      .style('fill', d => {
        return d.color;
      })
      .attr('d', d => {
        return drawArc(d.arc.startAngle()(), d.arc.endAngle()())(d);
      })
      .style('clip-path', 'url(#clipMask)');

    pie.on('mouseover', d => {
      // if (!d.active) {
      //   select(this)
      //     .transition()
      //     .duration(200)
      //     .ease(this._options.easing)
      //     .attr('d', function() {
      //       return drawArc(d.arc.startAngle()(), d.arc.endAngle()(), this.options.hoverRadius)();
      //     })
      //     .attr('transform', (d2: any) => {
      //       const distance = Math.sqrt(Math.pow(d2.arc.centroid()[0], 2) + Math.pow(d2.arc.centroid()[1], 2));
      //       const n = this._options.spaceHover / distance;
      //       return 'translate(' + n * d2.arc.centroid()[0] + ',' + n * d2.arc.centroid()[1] + ')';
      //     });
      //   g.select('text.percent')
      //     .transition()
      //     .duration(500)
      //     .ease(this._options.easing)
      //     .attr('opacity', 1)
      //     .tween('text', () => {
      //       const i = interpolate(0, Math.round(((d.arc.endAngle()() - d.arc.startAngle()()) / 2 / Math.PI) * 100));
      //       return t => {
      //         this.textContent = Math.round(i(t)) + '%';
      //       };
      //     });
      // }
    });

    pie.on('click', d => {
      // if (!d.active) {
      //   select(this)
      //     .transition()
      //     .duration(200)
      //     .ease(easeBounce)
      //     .attr('d', xd => drawArc(d.arc.startAngle()(), d.arc.endAngle()(), this._options.hoverRadius)(xd))
      //     .attr('transform', (d2: any) => {
      //       const distance = Math.sqrt(Math.pow(d2.arc.centroid()[0], 2) + Math.pow(d2.arc.centroid()[1], 2));
      //       const n = this._options.spaceActive / distance;
      //       return 'translate(' + n * d2.arc.centroid()[0] + ',' + n * d2.arc.centroid()[1] + ')';
      //     });
      // }
      // d.active = !d.active;
    });

    pie.on('mousemove', d => {
      const txt = g
        .select('text')
        .attr('x', function() {
          return mouse(this)[0] + 10;
        })
        .attr('y', function() {
          return mouse(this)[1] + 30;
        })
        .style('fill', rgb(255, 255, 255))
        .text(function() {
          return d.name;
        })
        .attr('height', function() {
          return this.getBBox().height;
        })
        .attr('width', function() {
          return this.getBBox().width;
        });

      g.select('rect')
        .style('display', 'block')
        .attr('width', () => {
          return parseFloat(txt.attr('width')) + 10;
        })
        .attr('height', txt.attr('height'))
        .attr('x', function() {
          return mouse(this)[0] + 5 - txt.attr('width') / 2;
        })
        .attr('y', function() {
          return mouse(this)[1] + 13;
        });
    });

    pie.on('mouseout', function(d) {
      if (!d.active) {
        select(this)
          .transition()
          .duration(200)
          .ease(this._options.easing)
          .attr('d', () => {
            return drawArc(d.arc.startAngle()(), d.arc.endAngle()())(d);
          })
          .attr('transform', 'translate(0, 0)');

        g.select('text.percent')
          .transition()
          .duration(500)
          .ease(this._options.easing)
          .attr('opacity', 0);
      }

      g.select('rect').style('display', 'none');
      g.select('text').text('');
    });

    // start transition animation clip path
    this._clipPath = g
      .append('defs')
      .append('clipPath')
      .attr('id', 'clipMask')
      .append('path')
      .attr('d', d => {
        return drawArc(0, 10 / this._options.outerRadius)(d);
      });

    // hover text background
    const textWrapper = g
      .append('rect')
      .style('fill', rgb(255, 255, 255))
      .style('opacity', 0.7)
      .style('display', 'none');

    // hover text
    const nameText = g
      .append('text')
      .attr('class', 'name')
      .style('fill', rgb(0, 0, 0))
      .attr('font-family', 'Lato')
      .attr('text-anchor', 'middle');

    const percentText = g
      .append('text')
      .attr('x', 0)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('font-size', 50)
      .attr('font-family', 'Lato')
      .attr('class', 'percent')
      .style('fill', rgb(0, 0, 0));

    this._transitionForward = () => {
      this._clipPath
        .transition()
        .duration(this._options.animationTime)
        .ease(this._options.easing)
        .attrTween('d', d => {
          const i = interpolate(10 / this._options.outerRadius, 2 * Math.PI);
          return t => {
            return drawArc(0, i(t))(d);
          };
        });
    };

    this._transitionBack = () => {
      this._clipPath
        .transition()
        .duration(this._options.animationTime)
        .ease(this._options.easing)
        .attrTween('d', d => {
          const i = interpolate(2 * Math.PI, 10 / 150); // this._options.outerRadius);
          return t => {
            return drawArc(0, i(t))(d);
          };
        });
    };
    if (this._options.showOnStart) {
      this._transitionForward();
    }
  }

  public drawBarChart(options: StatPanelGraphicOptions): void {
    this._chart = 'BAR';

    let max;
    this._data = this._data.map((d, i) => {
      max = max ? (d.value > max ? d.value : max) : d.value;
      return { name: d.name, value: d.value, color: this._options.colors[i] };
    });

    const ratio = (this._options.size - this._options.padding * 2) / max;

    // create the svg container
    const g = this._svg.append('g').attr('class', 'bar');
    g.attr('transform', () => {
      const y =
        (this._options.size - this._data.length * (this._options.barHeight + this._options.gap) - this._options.gap) /
        2;
      return 'translate(' + this._options.padding + ', ' + y + ')';
    });

    const bar = g
      .selectAll('rect')
      .data(this._data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (d, i) => {
        return i * (this._options.barHeight + this._options.gap);
      })
      .attr('height', this._options.barHeight)
      .attr('width', 10)
      .style('fill', d => {
        return d.color;
      })
      .style('clip-path', 'url(#clipMask)');

    const barValue = g
      .selectAll('text')
      .data(this._data)
      .enter()
      .append('text')
      .attr('class', 'bar-value')
      .attr('x', 0)
      .attr('y', (d, i) => {
        return i * (this._options.barHeight + this._options.gap) + this._options.barHeight * 0.7;
      })
      .attr('opacity', 0)
      .attr('font-size', this._options.barHeight * 0.7)
      .attr('font-family', 'Montserrat')
      .attr('text-anchor', 'start');

    bar.on('mousemove', function(d) {
      const txt = g
        .select('text.name')
        .attr('x', function() {
          return mouse(this)[0] + 10;
        })
        .attr('y', function() {
          return mouse(this)[1] + 30;
        })
        .style('fill', rgb(255, 255, 255))
        .text(function() {
          return d.name;
        })
        .attr('height', function() {
          return this.getBBox().height;
        })
        .attr('width', function() {
          return this.getBBox().width;
        });

      g.select('rect.nameBackground')
        .style('display', 'block')
        .attr('width', function() {
          return parseFloat(txt.attr('width')) + 10;
        })
        .attr('height', txt.attr('height'))
        .attr('x', function() {
          return mouse(this)[0] + 5 - txt.attr('width') / 2;
        })
        .attr('y', function() {
          return mouse(this)[1] + 13;
        });
    });

    bar.on('mouseout', function(d) {
      g.select('rect.nameBackground').style('display', 'none');
      g.select('text.name').text('');
    });

    this._transitionForward = () => {
      bar
        .transition()
        .duration(this._options.animationTime / 2)
        .ease(this._options.easing)
        .delay((d, i) => {
          return i * (this._options.animationTime / 2 / this._data.length);
        })
        .attr('width', d => {
          return d.value * ratio;
        });

      barValue
        .transition()
        .duration(this._options.animationTime / 2)
        .ease(this._options.easing)
        .delay((d, i) => {
          return i * (this._options.animationTime / 2 / this._data.length);
        })
        .attr('x', d => {
          return d.value * ratio + this._options.barHeight * 0.3;
        })
        .attr('opacity', 1)
        .tween('text', function(d) {
          const i = interpolate(0, d.value);
          return t => {
            this.textContent = Math.round(i(t));
          };
        });

      this._clipPath
        .transition()
        .duration((this._options.animationTime * (this._data.length - 1)) / this._data.length)
        .ease(this._options.easing)
        .attr('height', this._options.size);
    };

    this._transitionBack = () => {
      bar
        .transition()
        .duration(this._options.animationTime / 2)
        .ease(this._options.easing)
        .delay((d, i) => {
          return (this._data.length - i - 1) * (this._options.animationTime / 2 / this._data.length);
        })
        .attr('width', 10);

      barValue
        .transition()
        .duration(this._options.animationTime / 2)
        .ease(this._options.easing)
        .delay((d, i) => {
          return (this._data.length - i - 1) * (this._options.animationTime / 2 / this._data.length);
        })
        .attr('x', this._options.barHeight * 0.3)
        .attr('opacity', 0)
        .tween('text', d => {
          const i = interpolate(d.value, 0);
          return function(t) {
            this.textContent = Math.round(i(t));
          };
        });

      this._clipPath
        .transition()
        .duration((this._options.animationTime * (this._data.length - 1)) / this._data.length)
        .ease(this._options.easing)
        .attr('height', this._options.barHeight);
    };

    this._clipPath = g
      .append('defs')
      .append('clipPath')
      .attr('id', 'clipMask')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', this._options.barHeight)
      .attr('width', this._options.size);

    // hover text background
    const textWrapper = g
      .append('rect')
      .attr('class', 'nameBackground')
      .style('fill', rgb(0, 0, 0))
      .style('opacity', 0.7)
      .style('display', 'none');

    // hover text
    const nameText = g
      .append('text')
      .attr('class', 'name')
      .style('fill', rgb(255, 255, 255))
      .attr('font-family', 'Montserrat')
      .attr('text-anchor', 'middle');

    if (this._options.showOnStart) {
      this._transitionForward();
    }
  }

  public transformTo(chart: 'BAR' | 'PIE', options: StatPanelGraphicOptions) {
    this._options = options;

    //  if (sc.type === type || !sc.type) {
    //    return sc;
    //  }

    this._transitionBack();

    const t = this._svg
      .select('g')
      .transition()
      .duration(this._options.animationTime)
      .ease(this._options.easing)
      .attr('transform', d => {
        const y =
          (this._options.size - this._data.length * (this._options.barHeight + this._options.gap) - this._options.gap) /
          2;
        if (chart === 'BAR') {
          return 'translate(' + this._options.padding + ', ' + (this._options.outerRadius + y) + ')';
        } else if (chart === 'PIE') {
          return (
            'translate(' + this._options.size / 2 + ', ' + (this._options.size / 2 - this._options.outerRadius) + ')'
          );
        }
      })
      .on('end', v => {
        if (chart === 'BAR') {
          this.drawBarChart(this._options);
          this._svg.select('g:not(.bar)').remove();
        } else if (chart === 'PIE') {
          this.drawPieChart(this._options);
          this._svg.select('g:not(.pie)').remove();
        }
      });
    // .each('end', () => {
    //   if (chart === 'BAR') {
    //     this.drawBarChart(this._options);
    //     this._svg.select('g:not(.bar)').remove();
    //   } else if (chart === 'PIE') {
    //     this.drawPieChart(this._options);
    //     this._svg.select('g:not(.pie)').remove();
    //   }
    // });
  }

  constructor(target: any, options: StatPanelGraphicOptions) {
    this._options = options;
    this._svg = select(target)
      .append('svg')
      .attr('width', this._options.size)
      .attr('height', this._options.size);
  }
}
