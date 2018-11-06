import { ChartTypeEnum, StatRendererEnum } from './../model/enum.model';
import { Stat } from './../model/stat.model';
declare var vega: any;
export class StatVegaFactory {
  // Singleton Pattern- can only have 1 Vega Factory and is null until it is evoked
  private static _instance: StatVegaFactory = null;
  public static getInstance(): StatVegaFactory {
    if (StatVegaFactory._instance === null) {
      StatVegaFactory._instance = new StatVegaFactory();
    }
    return StatVegaFactory._instance;
  }

  private constructor() {
    // vega.scheme('notitia', ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4']);
    // vega.scheme('notitia', ['#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#40c4ff']);
    vega.scheme('notitia', ['#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5']);
  }

  /*
    Public Interface that takes the ChartType and figures which to call, EXAMPLE: if DONUT create donut with stat variable,
    that requires a name, type, chart, data, renderer and columns
    */

  public drawChartObject(stat: Stat, chartType: ChartTypeEnum, domId: string, div: any): void {
    const chartObject = this.getChartObject(stat, chartType);
    switch (stat.renderer) {
      case StatRendererEnum.VEGA:
        const v = vega.parse(chartObject, { renderer: 'svg' });
        const c = new vega.View(v)
          .initialize('#' + domId)
          .hover()
          .renderer('svg')
          .run();
        break;
      case StatRendererEnum.HTML:
        console.log('ADD TEXT');

        // div.children('#' + domId).append(chartObject.toString());
        break;
    }
  }

  public getChartObject(stat: Stat, chartType: ChartTypeEnum): any {
    return chartType === ChartTypeEnum.DONUT
      ? this.createDonut(stat)
      : chartType === ChartTypeEnum.HISTOGRAM
        ? this.createHistogram(stat)
        : chartType === ChartTypeEnum.PIE
          ? this.createPie(stat)
          : chartType === ChartTypeEnum.LINE
            ? this.createLine(stat)
            : chartType === ChartTypeEnum.LABEL
              ? this.createLabel(stat)
              : chartType === ChartTypeEnum.SCATTER
                ? this.createScatter(stat)
                : null;
  }

  // Labels (Singles), need to add classes to apply CSS
  private createLabel(stat: Stat): any {
    return (
      '<div style="padding-bottom:5px;">' +
      stat.data.reduce((p, c) => {
        p += '<label>' + c.mylabel + '</label><label> ' + c.myvalue + '<label><br />';
        return p;
      }, '') +
      '</div>'
    );
  }
  private createDonut(stat: Stat): any {
    const values = stat.data;
    // HACK HACK for SVG word wrap..
    values.forEach(v => {
      if (v.mylabel.length > 22) {
        v.mylabel = v.mylabel.substr(0, 22).trim() + '…';
      }
    });
    const vega = {
      $schema: 'https://vega.github.io/schema/vega/v3.0.json',
      config: {
        title: {
          offset: 10,
          fontSize: 13,
          color: '#000000de',
          font: 'Lato',
          fontWeight: '300',
          orient: 'top',
          anchor: 'start'
        }
      },
      title: {
        text: stat.name
      },
      width: 300,
      height: 200,
      padding: 0,
      autosize: { type: 'fit', resize: false },
      data: [
        {
          name: 'table',
          values: values,
          transform: [
            {
              type: 'pie',
              field: 'myvalue'
            }
          ]
        },
        {
          name: 'counts',
          source: 'table',
          transform: [
            {
              type: 'aggregate',
              fields: ['myvalue'],
              ops: ['sum'],
              as: ['sums']
            }
          ]
        }
      ],
      signals: [
        {
          name: 'signal_sums',
          value: null,
          update: "data('counts')[0]['sums']"
        },

        {
          name: 'signal_hover_arc',
          value: null,
          on: [
            {
              events: '@PC_arc:mouseover',
              update: 'datum'
            },
            {
              events: '@PC_arc:mouseout',
              update: 'null'
            }
          ]
        },
        {
          name: 'signal_hover_legend',
          value: null,
          on: [
            {
              events: '@legendLabel:mouseover, @legendSymbol:mouseover',
              update: 'datum'
            },
            {
              events: '@legendLabel:mouseout, @legendSymbol:mouseout',
              update: 'null'
            }
          ]
        },
        {
          name: 'signal_selected_myvalue',
          value: null,
          update:
            "round(signal_hover_arc ? signal_hover_arc['myvalue'] : (signal_hover_legend ? scale('scale_lookup_mylabel_myvalue', signal_hover_legend['value']) : signal_sums))"
        },
        {
          name: 'signal_selected_mylabel',
          value: null,
          update:
            "round(signal_hover_arc ? signal_hover_arc['mylabel'] : (signal_hover_legend ? signal_hover_legend['value'] : null))"
        }
      ],
      scales: [
        {
          name: 'r',
          type: 'sqrt',
          domain: {
            data: 'table',
            field: 'myvalue'
          }
        },
        {
          name: 'color',
          type: 'ordinal',
          domain: { data: 'table', field: 'mylabel' },
          range: {
            scheme: 'notitia'
          }
        },
        {
          name: 'scale_lookup_mylabel_myvalue',
          type: 'ordinal',
          domain: { data: 'table', field: 'mylabel' },
          range: { data: 'table', field: 'myvalue' }
        }
      ],
      marks: [
        {
          type: 'arc',
          from: {
            data: 'table'
          },
          name: 'PC_arc',
          interactive: true,
          encode: {
            enter: {
              x: {
                value: 58
              },
              y: {
                value: 58
              },
              fill: {
                scale: 'color',
                field: 'mylabel'
              },
              startAngle: {
                field: 'startAngle'
              },
              endAngle: {
                field: 'endAngle'
              },
              padAngle: {
                value: 0.01
              },
              innerRadius: {
                value: 38
              },
              outerRadius: {
                value: 58
              },
              cornerRadius: {
                value: 0
              },
              align: {
                value: 'right'
              },
              tooltip: { signal: "datum['mylabel'] + ': ' + datum['myvalue']" }
            },
            update: {
              fillOpacity: {
                value: 0.6
              }
            },
            hover: {
              fillOpacity: {
                value: 0.8
              }
            }
          }
        },
        {
          type: 'text',
          encode: {
            update: {
              x: {
                value: 58
              },
              y: {
                value: 58
              },
              text: {
                signal: 'signal_selected_myvalue'
              },
              fillOpacity: {
                value: 0.8
              },
              fontSize: {
                value: 10
              },
              fill: {
                value: '#000000de'
              },
              align: {
                value: 'center'
              },
              baseline: {
                value: 'middle'
              }
            }
          }
        }
      ],
      legends: [
        {
          fill: 'color',
          orient: 'none',
          encode: {
            symbols: {
              name: 'legendSymbol',
              interactive: true,
              update: {
                size: {
                  value: 50
                },
                fillOpacity: {
                  value: 1.0
                }
              },
              hover: {
                fillOpacity: {
                  value: 0.7
                }
              }
            },
            labels: {
              name: 'legendLabel',
              interactive: true,
              update: {
                fontSize: {
                  value: 10
                },
                fill: {
                  value: '#000000de'
                },
                fillOpacity: {
                  value: 0.8
                }
              },
              hover: {
                fontSize: {
                  value: 12
                },
                fillOpacity: {
                  value: 0.7
                }
              }
            },
            legend: {
              update: {
                x: {
                  value: 150
                },
                y: {
                  value: 0
                }
              }
            }
          }
        }
      ]
    };
    return vega;
  }
  private createHistogram(stat: Stat): any {
    const values = stat.data;
    const vega = {
      $schema: 'https://vega.github.io/schema/vega/v3.0.json',
      config: {
        title: {
          offset: 20,
          fontSize: 13,
          color: '#000000de',
          font: 'Lato',
          fontWeight: '300',
          orient: 'top',
          anchor: 'start'
        }
      },
      title: {
        text: stat.name
      },
      background: 0xffffff,
      width: 240,
      height: 180,
      padding: 0,
      autosize: { type: 'fit', resize: false },
      data: [
        {
          name: 'table',
          values: values
        }
      ],
      signals: [
        {
          name: 'tooltip',
          value: {},
          on: [{ events: 'rect:mouseover', update: 'datum' }, { events: 'rect:mouseout', update: '{}' }]
        }
      ],

      scales: [
        {
          name: 'xscale',
          type: 'band',
          domain: { data: 'table', field: 'mylabel' },
          range: 'width',
          color: '0xFF0000',
          padding: 0.1,
          round: true
        },
        {
          name: 'yscale',
          domain: { data: 'table', field: 'myvalue' },
          nice: true,
          range: 'height'
        }
      ],

      axes: [
        {
          orient: 'bottom',
          scale: 'xscale',

          encode: {
            ticks: {
              update: {
                stroke: { value: '#000000de' }
              }
            },
            labels: {
              interactive: false,
              update: {
                fill: { value: '#000000de' },
                angle: { value: 50 },
                fontSize: { value: 8 },
                align: { value: '90' },
                baseline: { value: 'middle' },
                dx: { value: 3 }
              },
              hover: {
                fill: { value: '#000000de' }
              }
            },
            domain: {
              update: {
                stroke: { value: '#000000de' },
                strokeWidth: { value: 1 }
              }
            }
          }
        }
      ],

      marks: [
        {
          type: 'rect',
          from: { data: 'table' },
          encode: {
            enter: {
              x: { scale: 'xscale', field: 'mylabel' },
              width: { scale: 'xscale', band: 1 },
              y: { scale: 'yscale', field: 'myvalue' },
              y2: { scale: 'yscale', value: 0 }
            },
            update: {
              fill: { value: '#b3e5fc' }
            },
            hover: {
              fill: { value: '#4fc3f7' }
            }
          }
        },
        {
          type: 'text',
          encode: {
            enter: {
              align: { value: 'center' },
              baseline: { value: 'bottom' },
              fill: { value: '#000000de' },
              font: { value: 'Lato' },
              fontSize: { value: 10 }
            },
            update: {
              x: { scale: 'xscale', signal: 'tooltip.mylabel', band: 0.5 },
              y: { scale: 'yscale', signal: 'tooltip.myvalue', offset: -6 },
              text: { signal: 'tooltip.myvalue' },
              fontSize: { value: 10 },
              font: { value: 'Lato' },
              fillOpacity: [{ test: 'datum === tooltip', value: 0 }, { value: 1 }]
            }
          }
        }
      ]
    };
    return vega;
  }
  // not using
  private createPie(stat: Stat): any {
    const values = stat.data;
    const vega = {
      $schema: 'https://vega.github.io/schema/vega/v3.0.json',
      config: {
        title: {
          offset: 10,
          fontSize: 12,
          color: '#666666',
          font: 'Lato',
          fontWeight: '300',
          orient: 'top',
          anchor: 'start'
        }
      },
      title: {
        text: stat.name
      },
      background: 0xffffff,
      width: 130,
      height: 150,
      padding: 0,
      autosize: { type: 'fit', resize: false },
      data: [
        {
          name: 'table',
          values: values,
          transform: [
            {
              type: 'pie',
              field: 'value',
              startAngle: 0,
              endAngle: Math.PI * 2,
              sort: false
            }
          ]
        }
      ],

      scales: [
        {
          name: 'color',
          type: 'ordinal',
          domain: {
            data: 'table',
            field: 'label'
          },
          range: {
            scheme: 'notitia'
          }
        }
      ],

      marks: [
        {
          type: 'arc',
          from: { data: 'table' },
          encode: {
            enter: {
              fill: { scale: 'color', field: 'label' },
              x: { signal: 'width / 2' },
              y: { signal: 'height / 2' },
              tooltip: { signal: 'datum.value' }
            },
            update: {
              startAngle: { field: 'startAngle' },
              endAngle: { field: 'endAngle' },
              padAngle: { value: 0 },
              innerRadius: { value: 0 },
              outerRadius: { signal: 'width / 2' },
              cornerRadius: { value: 0 }
            }
          }
        },
        {
          type: 'text',
          from: {
            data: 'table'
          },
          encode: {
            enter: {
              x: {
                field: {
                  group: 'width'
                },
                mult: 0.5
              },
              y: {
                field: {
                  group: 'height'
                },
                mult: 0.5
              },
              radius: {
                field: 'value',
                offset: 50
              },
              theta: {
                signal: '(datum.startAngle + datum.endAngle)/2'
              },
              align: {
                value: 'center'
              },
              text: {
                field: 'label'
              },
              font: {
                value: 'Lato'
              },
              fontSize: {
                value: 10
              },
              tooltip: { signal: 'datum.value' }
            }
          }
        }
      ]
    };
    return vega;
  }
  // not complete
  private createLine(stat: Stat): any {
    const values = stat.data;
    const vega = {
      $schema: 'https://vega.github.io/schema/vega/v3.0.json',
      config: {
        title: {
          offset: 10,
          fontSize: 12
        }
      },
      title: {
        text: stat.name
      },
      background: 0xffffff,
      width: 185,
      height: 250,
      padding: 0,
      autosize: { type: 'fit', resize: false },
      signals: [
        {
          name: 'interpolate',
          value: 'linear',
          bind: {
            input: 'select',
            options: [
              'basis',
              'cardinal',
              'catmull-rom',
              'linear',
              'monotone',
              'natural',
              'step',
              'step-after',
              'step-before'
            ]
          }
        }
      ],
      data: [
        {
          name: 'table',
          values: stat.data
        }
      ],
      scales: [
        {
          name: 'x',
          type: 'point',
          range: 'width',
          domain: { data: 'table', field: 'x' }
        },
        {
          name: 'y',
          type: 'linear',
          range: 'height',
          nice: true,
          zero: true,
          domain: { data: 'table', field: 'y' }
        },
        {
          name: 'color',
          type: 'ordinal',
          range: 'category',
          domain: { data: 'table', field: 'c' }
        }
      ],
      axes: [{ orient: 'bottom', scale: 'x' }, { orient: 'left', scale: 'y' }],
      marks: [
        {
          type: 'group',
          from: {
            facet: {
              name: 'series',
              data: 'table',
              groupby: 'c'
            }
          },
          marks: [
            {
              type: 'line',
              from: { data: 'series' },
              encode: {
                enter: {
                  x: { scale: 'x', field: 'x' },
                  y: { scale: 'y', field: 'y' },
                  stroke: { scale: 'color', field: 'c' },
                  strokeWidth: { value: 2 }
                },
                update: {
                  interpolate: { signal: 'interpolate' },
                  fillOpacity: { value: 1 }
                },
                hover: {
                  fillOpacity: { value: 0.5 }
                }
              }
            }
          ]
        }
      ]
    };
    return vega;
  }
  // not complete
  private createScatter(stat: Stat): any {
    const values = stat.data;
    const vega = {
      $schema: 'https://vega.github.io/schema/vega/v3.0.json',
      config: {
        title: {
          offset: 10,
          fontSize: 12
        }
      },
      title: {
        text: stat.name
      },
      background: 0xffffff,
      width: 185,
      height: 250,
      padding: 0,
      autosize: { type: 'fit', resize: true },
      data: [
        {
          name: 'source',
          values: values,
          transform: [
            // {
            //     'type': 'filter',
            //     'expr': 'datum['Horsepower'] != null && datum['Miles_per_Gallon'] != null && datum['Acceleration'] != null'
            // }
          ]
        }
      ],
      scales: [
        {
          name: 'x',
          type: 'linear',
          round: true,
          nice: true,
          zero: true,
          domain: { data: 'source', field: 'Horsepower' },
          range: 'width'
        },
        {
          name: 'y',
          type: 'linear',
          round: true,
          nice: true,
          zero: true,
          domain: { data: 'source', field: 'Miles_per_Gallon' },
          range: 'height'
        },
        {
          name: 'size',
          type: 'linear',
          round: true,
          nice: false,
          zero: true,
          domain: { data: 'source', field: 'Acceleration' },
          range: [4, 361]
        }
      ],
      axes: [
        {
          scale: 'x',
          grid: true,
          domain: false,
          orient: 'bottom',
          tickCount: 5,
          title: 'Horsepower'
        },
        {
          scale: 'y',
          grid: true,
          domain: false,
          orient: 'left',
          titlePadding: 5,
          title: 'Miles_per_Gallon'
        }
      ],
      legends: [
        {
          size: 'size',
          title: 'Acceleration',
          format: 's',
          encode: {
            symbols: {
              update: {
                strokeWidth: { value: 2 },
                opacity: { value: 0.5 },
                stroke: { value: '#4682b4' },
                shape: { value: 'circle' }
              }
            }
          }
        }
      ],
      marks: [
        {
          name: 'marks',
          type: 'symbol',
          from: { data: 'source' },
          encode: {
            update: {
              x: { scale: 'x', field: 'Horsepower' },
              y: { scale: 'y', field: 'Miles_per_Gallon' },
              size: { scale: 'size', field: 'Acceleration' },
              shape: { value: 'circle' },
              strokeWidth: { value: 2 },
              opacity: { value: 0.5 },
              stroke: { value: '#4682b4' },
              fill: { value: 'transparent' }
            }
          }
        }
      ]
    };
    return vega;
  }
}
