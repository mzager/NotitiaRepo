import { values } from 'd3';
export class StatsFactory {

    private static _instance: StatsFactory = null;

    public static getInstance(): StatsFactory {
        if (StatsFactory._instance === null) { StatsFactory._instance = new StatsFactory(); }
        return StatsFactory._instance;
    }

    // Histogram
    public createHistogramConfig(): HistogramConfig {
        return new HistogramConfig();
    }
    public createHistogramVega(config: HistogramConfig): any {
        const values = config.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'title': {
                'text': config.title,
                'fontSize': 6,
            },
            'width': config.width,
            'height': config.height,
            'padding': 25,
            'autosize': { 'type': 'fit', 'resize': true },
            'data': [
                {
                    'name': 'table',
                    'values': values
                }
            ],
            'signals': [
                {
                    'name': 'tooltip',
                    'value': {},
                    'on': [
                        { 'events': 'rect:mouseover', 'update': 'datum' },
                        { 'events': 'rect:mouseout', 'update': '{}' }
                    ],
                    'range': {
                        'scheme': 'spectral'
                    },
                }
            ],

            'scales': [
                {
                    'name': 'xscale',
                    'type': 'band',
                    'domain': { 'data': 'table', 'field': 'label' },
                    'range': 'width',
                    'padding': 0.1,
                    'round': true
                },
                {
                    'name': 'yscale',
                    'domain': { 'data': 'table', 'field': 'value' },
                    'nice': true,
                    'range': 'height'
                }
            ],

            'axes': [
                {
                  'orient': 'bottom',
                  'scale': 'xscale',
                  'title': 'Genes',
                  'encode': {
                    'ticks': {
                      'update': {
                        'stroke': {'value': 'steelblue'}
                      }
                    },
                    'labels': {
                      'interactive': true,
                      'update': {
                        'fill': {'value': 'steelblue'},
                        'angle': {'value': 50},
                        'fontSize': {'value': 10},
                        'align': {'value': '90'},
                        'baseline': {'value': 'middle'},
                        'dx': {'value': 3}
                      },
                      'hover': {
                        'fill': {'value': '#333'}
                      }
                    },
                    'title': {
                      'update': {
                        'fontSize': {'value': 10}
                      }
                    },
                    'domain': {
                      'update': {
                        'stroke': {'value': '#333'},
                        'strokeWidth': {'value': 1.5}
                      }
                    }
                  }
                }
              ],

            'marks': [
                {
                    'type': 'rect',
                    'from': { 'data': 'table' },
                    'encode': {
                        'enter': {
                            'x': { 'scale': 'xscale', 'field': 'label' },
                            'width': { 'scale': 'xscale', 'band': 1 },
                            'y': { 'scale': 'yscale', 'field': 'value' },
                            'y2': { 'scale': 'yscale', 'value': 0 }
                        },
                        'update': {
                            'fill': { 'value': '#039BE5' }
                        },
                        'hover': {
                            'fill': { 'value': '#03FFC9' }
                        }
                    }
                },
                {
                    'type': 'text',
                    'encode': {
                        'enter': {
                            'align': { 'value': 'center' },
                            'baseline': { 'value': 'bottom' },
                            'fill': { 'value': '#000' }

                        },
                        'update': {
                            'x': { 'scale': 'xscale', 'signal': 'tooltip.label', 'band': 0.5 },
                            'y': { 'scale': 'yscale', 'signal': 'tooltip.value', 'offset': -6 }
                        }
                    }
                }
            ]
        };
        return vega;
    }

    // Donut
    public createDonutConfig(): DonutConfig {
        return new DonutConfig();
    }

    public createDonutVega(config: DonutConfig): any {
        const values = config.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'width': config.width,
            'height': config.height,
            'padding': 25,
            'autosize': { 'type': 'fit', 'resize': true },
            'data': [
                {
                    'name': 'table',
                    'values': values,
                    'transform': [
                        {
                            'type': 'pie',
                            'field': 'value',
                        }
                    ]
                }
            ],
            'scales': [
                {
                    'name': 'r',
                    'type': 'sqrt',
                    'domain': {
                        'data': 'table',
                        'field': 'value'
                    }
                },
                {
                    'name': 'color',
                    'type': 'ordinal',
                    'domain': {
                        'data': 'table',
                        'field': 'label'
                    },
                    'range': {
                        'scheme': 'spectral'
                    }
                }
            ],
            'marks': [
                {
                    'type': 'arc',
                    'from': {
                        'data': 'table'
                    },
                    'encode': {
                        'enter': {
                            'x': {
                                'field': {
                                    'group': 'width'
                                },
                                'mult': 0.5
                            },
                            'y': {
                                'field': {
                                    'group': 'height'
                                },
                                'mult': 0.5
                            },
                            'startAngle': {
                                'field': 'startAngle'
                            },
                            'endAngle': {
                                'field': 'endAngle'
                            },
                            'padAngle': {
                                'value': 0.035
                            },
                            'innerRadius': {
                                'value': 60
                            },
                            'outerRadius': {
                                'signal': 'width / 2'
                            },
                            'cornerRadius': {
                                'value': 0
                            },
                            // How its done in Vega land, uncommented part works but color hovers do not
                            // ,tooltip': {'signal': 'datum['field']+ '%''}
                            'tooltip': { 'signal': 'datum.value' }
                        },
                        // opacity change on hover
                        'update': {
                            'fill': {
                                'scale': 'color',
                                'field': 'value'
                            },
                            'fillOpacity': {
                                'value': 1
                            }
                        },
                        'hover': {
                            'fillOpacity': {
                                'value': 0.5
                            },
                            'text': {
                                'field': 'value'
                            }
                        }
                    }
                },
                {
                    'type': 'text',
                    'from': {
                        'data': 'table'
                    },
                    'encode': {
                        'enter': {
                            'x': {
                                'field': {
                                    'group': 'width'
                                },
                                'mult': 0.5
                            },
                            'y': {
                                'field': {
                                    'group': 'height'
                                },
                                'mult': 0.5
                            },
                            'radius': {
                                'scale': 'r',
                                'field': 'value',
                                'offset': 90
                            },
                            'theta': {
                                'signal': '(datum.startAngle + datum.endAngle)/2'
                            },
                            'align': {
                                'value': 'center'
                            },
                            'text': {
                                'field': 'label'
                            },
                            'font': {
                                'value': 'Lato'
                            },
                            'fontSize': {
                                'value': 14
                            },
                            'tooltip': { 'signal': 'datum.value' }
                        }
                    }
                }
            ]
        };
        return vega;
    }

    // Violin
    public createViolinConfig(): ViolinConfig {
        return new ViolinConfig();
    }

    public createViolinVega(config: ViolinConfig): any {
        const Violinvalues = config.data.map((v, i) => ({ id: (i + 1), label: v.label, field: v.value.toFixed(2) }));
        const vega = {
                '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
                'width': config.width,
                'height': config.height,
                'padding': 25,
                'autosize': { 'type': 'fit', 'resize': true },
            'config': {
              'axisBand': {
                'bandPosition': 1,
                'tickExtra': true,
                'tickOffset': 0
              }
            },
            'signals': [
              { 'name': 'fields',
                'value': ['petalWidth', 'petalLength', 'sepalWidth', 'sepalLength'] },
              { 'name': 'plotWidth', 'value': 60 },
              { 'name': 'height', 'update': '(plotWidth + 10) * length(fields)'},
              { 'name': 'bandwidth', 'value': 0,
                'bind': {'input': 'range', 'min': 0, 'max': 0.5, 'step': 0.005} },
              { 'name': 'steps', 'value': 100,
                'bind': {'input': 'range', 'min': 10, 'max': 500, 'step': 1} }
            ],
            'data': [
              {
                'name': 'iris',
                'url': 'data/iris.json',
                'transform': [
                  {
                    'type': 'fold',
                    'fields': {'signal': 'fields'},
                    'as': ['organ', 'value']
                  }
                ]
              }
            ],
            'scales': [
              {
                'name': 'layout',
                'type': 'band',
                'range': 'height',
                'domain': {'data': 'iris', 'field': 'organ'}
              },
              {
                'name': 'xscale',
                'type': 'linear',
                'range': 'width', 'round': true,
                'domain': {'data': 'iris', 'field': 'value'},
                'zero': true, 'nice': true
              },
              {
                'name': 'color',
                'type': 'ordinal',
                'range': 'category'
              }
            ],
            'axes': [
              {'orient': 'bottom', 'scale': 'xscale', 'zindex': 1},
              {'orient': 'left', 'scale': 'layout', 'tickCount': 5, 'zindex': 1}
            ],

            'marks': [
              {
                'type': 'group',
                'from': {
                  'facet': {
                    'data': 'iris',
                    'name': 'organs',
                    'groupby': 'organ'
                  }
                },
                'encode': {
                  'enter': {
                    'yc': {'scale': 'layout', 'field': 'organ', 'band': 0.5},
                    'height': {'signal': 'plotWidth'},
                    'width': {'signal': 'width'}
                  }
                },
                'data': [
                  {
                    'name': 'density',
                    'transform': [
                      {
                        'type': 'density',
                        'steps': {'signal': 'steps'},
                        'distribution': {
                          'function': 'kde',
                          'from': 'organs',
                          'field': 'value',
                          'bandwidth': {'signal': 'bandwidth'}
                        }
                      },
                      {
                        'type': 'stack',
                        'groupby': ['value'],
                        'field': 'density',
                        'offset': 'center',
                        'as': ['y0', 'y1']
                      }
                    ]
                  },
                  {
                    'name': 'summary',
                    'source': 'organs',
                    'transform': [
                      {
                        'type': 'aggregate',
                        'fields': ['value', 'value', 'value'],
                        'ops': ['q1', 'median', 'q3'],
                        'as': ['q1', 'median', 'q3']
                      }
                    ]
                  }
                ],
                'scales': [
                  {
                    'name': 'yscale',
                    'type': 'linear',
                    'range': [0, {'signal': 'plotWidth'}],
                    'domain': {'data': 'density', 'field': 'density'}
                  }
                ],
                'marks': [
                  {
                    'type': 'area',
                    'from': {'data': 'density'},
                    'encode': {
                      'enter': {
                        'fill': {'scale': 'color', 'field': {'parent': 'organ'}}
                      },
                      'update': {
                        'x': {'scale': 'xscale', 'field': 'value'},
                        'y': {'scale': 'yscale', 'field': 'y0'},
                        'y2': {'scale': 'yscale', 'field': 'y1'}
                      }
                    }
                  },
                  {
                    'type': 'rect',
                    'from': {'data': 'summary'},
                    'encode': {
                      'enter': {
                        'fill': {'value': 'black'},
                        'height': {'value': 2}
                      },
                      'update': {
                        'yc': {'signal': 'plotWidth / 2'},
                        'x': {'scale': 'xscale', 'field': 'q1'},
                        'x2': {'scale': 'xscale', 'field': 'q3'}
                      }
                    }
                  },
                  {
                    'type': 'rect',
                    'from': {'data': 'summary'},
                    'encode': {
                      'enter': {
                        'fill': {'value': 'black'},
                        'width': {'value': 2},
                        'height': {'value': 8}
                      },
                      'update': {
                        'yc': {'signal': 'plotWidth / 2'},
                        'x': {'scale': 'xscale', 'field': 'median'}
                      }
                    }
                  }
                ]
              }
            ]
          };
          return vega;
    }
    private constructor() { }

}

export enum StatChartEnum {
    DONUT = 1,
    HISTOGRAM = 2,
    VIOLIN = 3
}

export class AbstractStatChartConfig {

    type: StatChartEnum;
    data: Array<any>;
    width: number;
    height: number;
    labelFn?: Function;
    title: string;


    constructor() {
        this.data = [];
        this.labelFn = null;
        this.width = 250;
        this.height = 250;
        this.title = 'Test-Title';
    }
}

export class HistogramConfig extends AbstractStatChartConfig {

    data: Array<{ label: string, value: number, color?: number }>;

    constructor() {
        super();
        this.type = StatChartEnum.HISTOGRAM;
    }
}

export class ViolinConfig extends AbstractStatChartConfig {

        data: Array<{ label: string, value: number, color?: number }>;

        constructor() {
            super();
            this.type = StatChartEnum.VIOLIN;
        }
    }

export class DonutConfig extends AbstractStatChartConfig {

    data: Array<{ label: string, value: number, color?: number }>;

    constructor() {
        super();
        this.type = StatChartEnum.DONUT;
    }

}
