export class StatsFactory {

    private static _instance: StatsFactory = null;

    public static getInstance(): StatsFactory {
        if (StatsFactory._instance === null) { StatsFactory._instance = new StatsFactory(); }
        return StatsFactory._instance;
    }

    public createHistogramConfig(): HistogramConfig {
        return new HistogramConfig();
    }
 public createHistogramVega(config: HistogramConfig): any {

    const graphValues = config.data.map((v, i) => ({id: (i + 1), label: v.label, field: v.value.toFixed(2) }));
    const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'width': config.width,
            'height': config.height,
            'padding': 25,
            'autosize': { 'type': 'fit', 'resize': true },
            'data': [
                {
                  'name': 'table',
                  'values': graphValues,
            }
              ],
              'signals': [
                {
                  'name': 'tooltip',
                  'value': {},
                  'on': [
                    {'events': 'rect:mouseover', 'update': 'datum'},
                    {'events': 'rect:mouseout',  'update': '{}'}
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
                  'domain': {'data': 'table', 'field': 'label'},
                  'range': 'width',
                  'padding': 0.05,
                  'round': true
                },
                {
                  'name': 'yscale',
                  'domain': {'data': 'table', 'field': 'field'},
                  'nice': true,
                  'range': 'height'
                }
              ],

              'axes': [
                { 'orient': 'bottom', 'scale': 'xscale' },
                { 'orient': 'left', 'scale': 'yscale' }
              ],

              'marks': [
                {
                  'type': 'rect',
                  'from': {'data': 'table'},
                  'encode': {
                    'enter': {
                      'x': {'scale': 'xscale', 'field': 'label'},
                      'width': {'scale': 'xscale', 'band': 1},
                      'y': {'scale': 'yscale', 'field': 'field'},
                      'y2': {'scale': 'yscale', 'value': 0}
                    },
                    'update': {
                      'fill': {'value': 'steelblue'}
                    },
                    'hover': {
                      'fill': {'value': 'red'}
                    }
                  }
                },
                {
                  'type': 'text',
                  'encode': {
                    'enter': {
                      'align': {'value': 'center'},
                      'baseline': {'value': 'bottom'},
                      'fill': {'value': '#333'}
                    },
                    'update': {
                      'x': {'scale': 'xscale', 'signal': 'tooltip.label', 'band': 0.5},
                      'y': {'scale': 'yscale', 'signal': 'tooltip.feild', 'offset': -2},
                      'text': {'signal': 'tooltip.field'},
                      'fillOpacity': [
                        {'test': 'datum === tooltip', 'value': 0},
                        {'value': 1}
                      ]
                    }
                  }
                }
              ]
        };
        return vega;
    }


    public createDonutConfig(): DonutConfig {
        return new DonutConfig();
    }

    public createDonutVega(config: DonutConfig): any {

        const values = config.data.map((v, i) => ({ id: (i + 1), label: v.label, field: v.value.toFixed(2) }));
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
                            'field': 'field',
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
                        'field': 'field'
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
                            'tooltip': { 'signal': 'datum.field' }
                        },
                        // opacity change on hover
                        'update': {
                            'fill': {
                                'scale': 'color',
                                'field': 'field'
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
                                'field': 'field'
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
                                'field': 'field',
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
                            'tooltip': { 'signal': 'datum.field' }
                        }
                    }
                }
            ]
        };
        return vega;
    }

    private constructor() { }

}

export enum StatChartEnum {
    DONUT = 1,
    HISTOGRAM = 2
}

export class AbstractStatChartConfig {

    type: StatChartEnum;
    data: Array<any>;
    width: number;
    height: number;
    labelFn?: Function;

    constructor() {
        this.data = [];
        this.labelFn = null;
        this.width = 250;
        this.height = 250;
    }
}

export class HistogramConfig extends AbstractStatChartConfig {

    data: Array<{ label: string, value: number, color?: number }>;

    constructor() {
        super();
        this.type = StatChartEnum.HISTOGRAM;
    }
}

export class DonutConfig extends AbstractStatChartConfig {

    data: Array<{ label: string, value: number, color?: number }>;

    constructor() {
        super();
        this.type = StatChartEnum.DONUT;
    }

}
