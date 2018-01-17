import { DataService } from 'app/service/data.service';
import { GraphConfig } from './graph-config.model';
import { GraphData } from './graph-data.model';
import { VisualizationEnum, StatTypeEnum, ChartTypeEnum, StatRendererEnum, StatRendererColumns, GraphEnum, Colors } from 'app/model/enum.model';
import * as data from 'app/action/data.action';
import { multicast } from 'rxjs/operator/multicast';
import { single } from 'rxjs/operator/single';
import { values } from 'd3';
declare var vega: any;

/* GENERAL note: Visualization = is the graph A/B, example PCA Fast ICA, PCA. Stat = result data coming from ski-kit
Visalization, Graph = is what is final rendering
*/

/*
This is not a IS A (extends) or a HAS A (contains), this is an interface, ACTS-LIKE 'contract' polymorphic

Each stat needs to have a class of either a SINGLE value, a 1D array or a 2D array. This helps to orgainize the GraphData results
coming back from Visualization and to control the chartType it will export.

type = ReadOnly because we never want anyone/anything to change that, single will always be single etc
name = name of graph
charts = come from the ChartTypeEnum, PIE = 1, DONUT = 2, etc (strictly typed)
data: under stat data can be anything, as the classes get more specific data becomes more strictly typed
*/

export interface Stat {
    name: string;
    type: StatTypeEnum;
    charts: Array<ChartTypeEnum>;
    data: any;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;
}

// not being used
// export class StatSingle implements Stat {
//     readonly type = StatTypeEnum.SINGLE;
//     charts: Array<ChartTypeEnum> = [ChartTypeEnum.LABEL];
//     name: string;
//     data: string;
//     constructor(name: string, data: string) {
//         this.name = name;
//         this.data = data;
//     }
// }

// Single Values
export class StatKeyValues implements Stat {
    readonly type = StatTypeEnum.MISC;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.LABEL];
    name: string;
    data: Array<{ label: string, value: string }>;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;

    constructor(name: string, data: Array<{ label: string, value: string }>) {
        this.name = name;
        this.data = data;
        this.renderer = StatRendererEnum.HTML;
        this.columns = StatRendererColumns.TWELVE;
    }
}

// 1D Values
export class StatOneD implements Stat {
    readonly type = StatTypeEnum.ONE_D;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.DONUT, ChartTypeEnum.HISTOGRAM];
    name: string;
    data: Array<{ label: string, value: number, color?: number }>;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;
    constructor(name: string, data: Array<{ label: string, value: number, color?: number }>) {
        this.name = name;
        this.data = data;
        this.renderer = StatRendererEnum.VEGA;
        this.columns = StatRendererColumns.TWELVE;
    }
}

// 2D Values
export class StatTwoD implements Stat {
    readonly type = StatTypeEnum.TWO_D;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.HISTOGRAM, ChartTypeEnum.SCATTER];
    name: string;
    data: Array<{ label: string, value: number, color?: number }>;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;

    constructor(name: string, data: Array<{ label: string, value: number, color?: number }>) {
        this.name = name;
        this.data = data;
        this.renderer = StatRendererEnum.VEGA;
        this.columns = StatRendererColumns.TWELVE;
    }
}



// Factory Pattern
export class VegaFactory {

    // Singleton Pattern- can only have 1 Vega Factory and is null until it is evoked
    private static _instance: VegaFactory = null;
    public static getInstance(): VegaFactory {
        if (VegaFactory._instance === null) { VegaFactory._instance = new VegaFactory(); }
        return VegaFactory._instance;
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
    public getChartObject(stat: Stat, chartType: ChartTypeEnum): any {
        return (chartType === ChartTypeEnum.DONUT) ? this.createDonut(stat) :
            (chartType === ChartTypeEnum.HISTOGRAM) ? this.createHistogram(stat) :
                (chartType === ChartTypeEnum.PIE) ? this.createPie(stat) :
                    (chartType === ChartTypeEnum.LINE) ? this.createLine(stat) :
                        (chartType === ChartTypeEnum.LABEL) ? this.createLabel(stat) :
                            (chartType === ChartTypeEnum.SCATTER) ? this.createScatter(stat) :
                                null;
    }

    // Labels (Singles), need to add classes to apply CSS
    private createLabel(stat: Stat): any {
        return '<div style="padding:10px" class="stat-col col s12">' + stat.data.reduce((p, c) => {
            p += '<p><label>' + c.label +
                '</label><label> ' + c.value + '<label></p>';
            return p;
        }, '') + '</div>';

    }
    private createDonut(stat: Stat): any {
        const values = stat.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'config': {
                'title': {
                    'offset': 70,
                    'fontSize': 10,
                    'color': '#666666',
                    'font': 'Lato',
                    'fontWeight': 'normal',
                    'orient': 'top',
                }
            },
            'title': {
                'text': stat.name,
            },
            'background': 'white',
            'width': 230,
            'height': 180,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': false },
            'data': [
                {
                    'name': 'table',
                    'values': values,
                    'transform': [
                        {
                            'type': 'pie',
                            'field': 'value'
                        }
                    ]
                },
                {
                    'name': 'total_values',
                    'from': values,
                    'transform': [
                        {
                            'type': 'aggregate',
                            'fields': ['value'],
                            'ops': ['sum'],
                            'as': ['sums']
                        }
                    ]
                }
            ],
            'signals': [
                // {
                //     'name': 'signal_get_PC_value',
                //     'description': 'update PC values in center of donut on arc hover',
                //     'on': [
                //       {'events': '@PC_arc:mouseover', 'update': 'datum.value'},
                //       {'events': '@PC_arc:mouseout', 'update': 'datum.sums'},
                //     ]
                //   },
                  {
                    'name': 'signal_get_PC_value',
                    'description': 'update PC values in center of donut on arc hover',
                    'value': null,
                    'on': [
                      {
                        'events': '@PC_arc:mouseover',
                        'update': 'datum.value'
                      },
                      {
                        'events': '@legendLabel:mouseover, @legendSymbol:mouseover',
                        'update': 'datum.value'
                      },

                      {
                        'events': '@PC_arc:mouseout, @legendLabel:mouseout, @legendSymbol:mouseout',
                        'update': 'datum.sums'
                      }
                    ]
                  },
                    ],
            'scales': [
                {
                    'name': 'r',
                    'type': 'sqrt',
                    'domain': {'data': 'table', 'field': 'value'}
                  },
                {
                    'name': 'color',
                    'type': 'ordinal',
                    'range': { 'scheme': 'notitia' }
                }
            ],
            'marks': [
                {
                    'type': 'arc',
                    'from': { 'data': 'table' },
                    'name': 'PC_arc',
                    'interactive': true,
                    'encode': {
                        'enter': {
                            'x': { 'signal': 'width / 4' },
                            'y': { 'signal': 'height / 4' },
                            'fill': { 'scale': 'color', 'field': 'label' },
                            'startAngle': { 'field': 'startAngle' },
                            'endAngle': { 'field': 'endAngle' },
                            'padAngle': { 'value': 0.01 },
                            'innerRadius': { 'value': 45 },
                            'outerRadius': { 'signal': 'width / 3' },
                            'cornerRadius': { 'value': 0 },
                            'align': { 'value': 'right' }
                        }
                    }
                },
                {
                    'type': 'text',
                    'from': { 'data': 'table' },
                    'interactive': true,
                    'encode': {
                        'enter': {
                            'x': { 'signal': 'width / 4' },
                            'y': { 'signal': 'height / 4' },
                        },
                        'update': {
                            'text': {'signal': 'signal_get_PC_value'},
                            'opacity': {'value': .4},
                            'fontSize': {'value': 10},
                            'fill': { 'value': '#666666' },
                            'align': {'value': 'center'}
                        }
                    }
                },
                // {
                //     'type': 'text',
                //     'from': { 'data': 'total_values' },
                //     'name': 'test',
                //     'interactive': true,
                //     'encode': {
                //         'enter': {
                //             'x': { 'signal': 'width / 4' },
                //             'y': { 'signal': 'height / 4' },
                //             'fill': { 'value': '#666666' },
                //             'align': { 'value': 'center' },
                //             'text': {'field': 'sums'},
                //         },

                //     }
                // }
            ],
            'legends': [
                {
                    'fill': 'color',
                    'orient': 'none',
                    'encode': {
                        'symbols': {
                            'name': 'legendSymbol',
                            'interactive': true,
                            'size': {'value': 64}
                        },
                      'labels': {
                        'name': 'legendLabel',
                        'interactive': true,
                        'update': {
                            'fontSize': {'value': 10},
                            'fill': {'value': '#666666'}
                          }
                        },
                      'legend': {
                          'update': {
                              'x': {'signal': 'width / 2', 'offset': 30 },
                              'y': {'signal': 'height / 2', 'offset': -50}
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
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'config': {
                'title': {
                    'offset': 20,
                    'fontSize': 10,
                    'color': '#666666',
                    'font': 'Lato',
                    'fontWeight': 'normal',
                    'orient': 'top'
                }
            },
            'title': {
                'text': stat.name
            },
            'background': 'white',
            'width': 230,
            'height': 180,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': false },
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
                    ]
                }
            ],

            'scales': [
                {
                    'name': 'xscale',
                    'type': 'band',
                    'domain': { 'data': 'table', 'field': 'label' },
                    'range': 'width',
                    'color': '0xFF0000',
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

                    'encode': {
                        'ticks': {
                            'update': {
                                'stroke': { 'value': '#666666' }
                            }
                        },
                        'labels': {
                            'interactive': false,
                            'update': {
                                'fill': { 'value': '#666666' },
                                'angle': { 'value': 50 },
                                'fontSize': { 'value': 8 },
                                'align': { 'value': '90' },
                                'baseline': { 'value': 'middle' },
                                'dx': { 'value': 3 }
                            },
                            'hover': {
                                'fill': { 'value': '#666666' }
                            }
                        },
                        'domain': {
                            'update': {
                                'stroke': { 'value': '#666666' },
                                'strokeWidth': { 'value': 1 }
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
                            'fill': { 'value': '#b3e5fc' }
                        },
                        'hover': {
                            'fill': { 'value': '#4fc3f7' }
                        }
                    }
                },
                {
                    'type': 'text',
                    'encode': {
                        'enter': {
                            'align': { 'value': 'center' },
                            'baseline': { 'value': 'bottom' },
                            'fill': { 'value': '#666666' },
                            'font': { 'value': 'Lato'},
                            'fontSize': { 'value': 10 },
                        },
                        'update': {
                            'x': { 'scale': 'xscale', 'signal': 'tooltip.label', 'band': 0.5 },
                            'y': { 'scale': 'yscale', 'signal': 'tooltip.value', 'offset': -6 },
                            'text': { 'signal': 'tooltip.value' },
                            'fontSize': {'value': 10},
                            'font': { 'value': 'Lato'},
                            'fillOpacity': [
                                { 'test': 'datum === tooltip', 'value': 0 },
                                { 'value': 1 }
                            ]
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
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'config': {
                'title': {
                    'offset': 10,
                    'fontSize': 12
                }
            },
            'title': {
                'text': stat.name
            },
            'background': 'white',
            'width': 130,
            'height': 150,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': false },
            'data': [
                {
                    'name': 'table',
                    'values': values,
                    'transform': [
                        {
                            'type': 'pie',
                            'field': 'value',
                            'startAngle': 0,
                            'endAngle': Math.PI * 2,
                            'sort': false
                        }
                    ]
                }
            ],

            'scales': [
                {
                    'name': 'color',
                    'type': 'ordinal',
                    'domain': {
                        'data': 'table',
                        'field': 'label',
                    },
                    'range': {
                        'scheme': 'notitia'
                    }
                }
            ],

            'marks': [
                {
                    'type': 'arc',
                    'from': { 'data': 'table' },
                    'encode': {
                        'enter': {
                            'fill': { 'scale': 'color', 'field': 'label' },
                            'x': { 'signal': 'width / 2' },
                            'y': { 'signal': 'height / 2' },
                            'tooltip': { 'signal': 'datum.value' }
                        },
                        'update': {
                            'startAngle': { 'field': 'startAngle' },
                            'endAngle': { 'field': 'endAngle' },
                            'padAngle': { 'value': 0 },
                            'innerRadius': { 'value': 0 },
                            'outerRadius': { 'signal': 'width / 2' },
                            'cornerRadius': { 'value': 0 }
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
                                'field': 'value',
                                'offset': 50
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
                                'value': 10
                            },
                            'tooltip': { 'signal': 'datum.value' }
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
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'config': {
                'title': {
                    'offset': 10,
                    'fontSize': 12
                }
            },
            'title': {
                'text': stat.name
            },
            'background': 'white',
            'width': 185,
            'height': 250,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': false },
            'signals': [
                {
                    'name': 'interpolate',
                    'value': 'linear',
                    'bind': {
                        'input': 'select',
                        'options': [
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
            'data': [
                {
                    'name': 'table',
                    'values': data,
                }
            ],
            'scales': [
                {
                    'name': 'x',
                    'type': 'point',
                    'range': 'width',
                    'domain': { 'data': 'table', 'field': 'x' }
                },
                {
                    'name': 'y',
                    'type': 'linear',
                    'range': 'height',
                    'nice': true,
                    'zero': true,
                    'domain': { 'data': 'table', 'field': 'y' }
                },
                {
                    'name': 'color',
                    'type': 'ordinal',
                    'range': 'category',
                    'domain': { 'data': 'table', 'field': 'c' }
                }
            ],
            'axes': [
                { 'orient': 'bottom', 'scale': 'x' },
                { 'orient': 'left', 'scale': 'y' }
            ],
            'marks': [
                {
                    'type': 'group',
                    'from': {
                        'facet': {
                            'name': 'series',
                            'data': 'table',
                            'groupby': 'c'
                        }
                    },
                    'marks': [
                        {
                            'type': 'line',
                            'from': { 'data': 'series' },
                            'encode': {
                                'enter': {
                                    'x': { 'scale': 'x', 'field': 'x' },
                                    'y': { 'scale': 'y', 'field': 'y' },
                                    'stroke': { 'scale': 'color', 'field': 'c' },
                                    'strokeWidth': { 'value': 2 }
                                },
                                'update': {
                                    'interpolate': { 'signal': 'interpolate' },
                                    'fillOpacity': { 'value': 1 }
                                },
                                'hover': {
                                    'fillOpacity': { 'value': 0.5 }
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
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'config': {
                'title': {
                    'offset': 10,
                    'fontSize': 12
                }
            },
            'title': {
                'text': stat.name
            },
            'background': 'white',
            'width': 185,
            'height': 250,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': true },
            'data': [
                {
                    'name': 'source',
                    'values': values,
                    'transform': [
                        // {
                        //     'type': 'filter',
                        //     'expr': 'datum['Horsepower'] != null && datum['Miles_per_Gallon'] != null && datum['Acceleration'] != null'
                        // }
                    ]
                }
            ],
            'scales': [
                {
                    'name': 'x',
                    'type': 'linear',
                    'round': true,
                    'nice': true,
                    'zero': true,
                    'domain': { 'data': 'source', 'field': 'Horsepower' },
                    'range': 'width'
                },
                {
                    'name': 'y',
                    'type': 'linear',
                    'round': true,
                    'nice': true,
                    'zero': true,
                    'domain': { 'data': 'source', 'field': 'Miles_per_Gallon' },
                    'range': 'height'
                },
                {
                    'name': 'size',
                    'type': 'linear',
                    'round': true,
                    'nice': false,
                    'zero': true,
                    'domain': { 'data': 'source', 'field': 'Acceleration' },
                    'range': [4, 361]
                }
            ],
            'axes': [
                {
                    'scale': 'x',
                    'grid': true,
                    'domain': false,
                    'orient': 'bottom',
                    'tickCount': 5,
                    'title': 'Horsepower'
                },
                {
                    'scale': 'y',
                    'grid': true,
                    'domain': false,
                    'orient': 'left',
                    'titlePadding': 5,
                    'title': 'Miles_per_Gallon'
                }
            ],
            'legends': [
                {
                    'size': 'size',
                    'title': 'Acceleration',
                    'format': 's',
                    'encode': {
                        'symbols': {
                            'update': {
                                'strokeWidth': { 'value': 2 },
                                'opacity': { 'value': 0.5 },
                                'stroke': { 'value': '#4682b4' },
                                'shape': { 'value': 'circle' }
                            }
                        }
                    }
                }
            ],
            'marks': [
                {
                    'name': 'marks',
                    'type': 'symbol',
                    'from': { 'data': 'source' },
                    'encode': {
                        'update': {
                            'x': { 'scale': 'x', 'field': 'Horsepower' },
                            'y': { 'scale': 'y', 'field': 'Miles_per_Gallon' },
                            'size': { 'scale': 'size', 'field': 'Acceleration' },
                            'shape': { 'value': 'circle' },
                            'strokeWidth': { 'value': 2 },
                            'opacity': { 'value': 0.5 },
                            'stroke': { 'value': '#4682b4' },
                            'fill': { 'value': 'transparent' }
                        }
                    }
                }
            ]
        };
        return vega;
    }
}

// Factory Pattern
export class StatFactory {

    // Singleton Pattern- copied logic
    private static _instance: StatFactory = null;
    public static getInstance(): StatFactory {
        if (StatFactory._instance === null) { StatFactory._instance = new StatFactory(); }
        return StatFactory._instance;
    }

    private constructor() { }

    public getPopulationStats( config: GraphConfig, dataService: DataService): Promise<Array<Stat>> {

        return new Promise( (resolve, reject) => {

            const keyValues = 
                new StatKeyValues('', [
                    { label: 'Genes: ', value: ((config.markerFilter.length === 0) ? 'All' : config.markerFilter.length.toString()) },
                    { label: 'Patients: ', value: ((config.patientFilter.length === 0) ? 'All' : config.patientFilter.length.toString()) },
                    { label: 'Samples: ', value: ((config.sampleFilter.length === 0) ? 'All' : config.sampleFilter.length.toString()) }
                ]);

            dataService.getPatientStats(config.database, config.patientFilter).then( result => {
                result = result.map( v => {
                    const stat = new StatOneD(v.name, v.stat);
                    if ( (v.type === 'number') || (v.type === 'category' && v.stat.length >= 7) ) {
                        // Transform Into Histogram From pie
                        stat.charts.reverse();
                    }
                    return stat;
                });
                result.unshift(keyValues);
                resolve(result);
            });
        });
    }

    // Public Interface + Takes The Visualization Type and figures which to call
    public getStatObjects(data: GraphData, config: GraphConfig): Array<Stat> {
        // Unsupervised Learning Clustering + Manifest Learn + Discriminant Analysis
        switch (config.visualization) {
            case VisualizationEnum.INCREMENTAL_PCA: return this.createIncrementalPca(data);
            case VisualizationEnum.TRUNCATED_SVD: return this.createTruncatedSvd(data);
            case VisualizationEnum.PCA: return this.createPca(data);
            case VisualizationEnum.SPARSE_PCA: return this.createSparse_PCA(data);
            case VisualizationEnum.KERNAL_PCA: return this.createKernalPca(data);
            case VisualizationEnum.DICTIONARY_LEARNING: return this.createDictionaryLearning(data);
            case VisualizationEnum.FA: return this.createFactorAnalysis(data);
            case VisualizationEnum.LDA: return this.createLatentDirichletAllocation(data);
            case VisualizationEnum.NMF: return this.createNonNegativeMatrixFactorization(data);
            case VisualizationEnum.ISOMAP: return this.createIsoMap(data);
            case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING: return this.createLocallyLinearEmbedding(data);
            case VisualizationEnum.MDS: return this.createMds(data);
            case VisualizationEnum.FAST_ICA: return this.createFastIca(data);
            case VisualizationEnum.SPECTRAL_EMBEDDING: return this.createSpectralEmbedding(data);
            case VisualizationEnum.TSNE: return this.createTSNE(data);
            case VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS: return null;
            case VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS: return null;
            case VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING: return null;
            case VisualizationEnum.MINI_BATCH_SPARSE_PCA: return null;
        }
        return [];
    }

    private createIncrementalPca(data: GraphData): Array<Stat> {
        // IncrementalPca stats array
        const stats = [
            // Single Arrays
            new StatKeyValues('', ([
                { label: 'Samples Seen:', value: data.result.nSamplesSeen.toString() },
                { label: 'Components:', value: data.result.nComponents.toString() },
                { label: 'Noise Variance:', value: data.result.noiseVariance.toFixed(2) },
            ])),
            // One Dimensional Stats
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            // new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            // new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues)),
            // new StatOneD('Mean', this.formatMean(data.result.mean)),
            // Two Dimensional Stats
            new StatTwoD('PCA Loadings', this.formatPCALoadings(data.markerIds, data.result.components))
        ];
        // stats[3].charts = [ChartTypeEnum.HISTOGRAM];
        return stats;
    }

    private createTruncatedSvd(data: GraphData): Array<Stat> {
        // Truncated Svd stats array
        const stats = [
            // One Dimensional Stats
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            // new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues))
            // Two Dimensional Stats
            // new StatTwoD('Components', data.result.components),
        ];

        return stats;
    }

    private createPca(data: GraphData): Array<Stat> {
        // Truncated Svd stats array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'Noise Variance:', value: data.result.noiseVariance.toFixed(2) },
                { label: 'Components:', value: data.result.nComponents.toString() }
            ])),
            // One Dimensional Stats
            // new StatOneD('Mean', data.result.mean),
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            // new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            // new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues)),
            // Two Dimensional Stats
            new StatTwoD('PCA Loadings', this.formatPCALoadings(data.markerIds, data.result.components))
        ];

        return stats;
    }

    private createSparse_PCA(data: GraphData): Array<Stat> {
        // Sparse PCA Stats Array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'Iter:', value: data.result.iter.toFixed(2) },
            ])),
            // One Dimensional Stats
            new StatOneD('Error', this.formatError(data.result.error)),
            // Two Dimensional Stats
            new StatTwoD('PCA Loadings', this.formatPCALoadings(data.markerIds, data.result.components))
        ];

        return stats;
    }

    private createKernalPca(data: GraphData): Array<Stat> {
        // Kernal PCA Stats Array
        const stats = [
            // Single Stats
            // One Dimensional Stats
            new StatOneD('Lambdas', this.formatLambdas(data.result.lambdas))
            // Two Dimensional Stats
            // new StatTwoD('Alphas', data.result.alphas)
        ];
        return stats;
    }

    private createDictionaryLearning(data: GraphData): Array<Stat> {
        // Dictionary Learning Stats Array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'nIter', value: data.result.nIter.toString() },
            ])),
            // One Dimensional Stats
            new StatOneD('Error', this.formatError(data.result.error.splice(0, 3))),
            // Two Dimensional Stats
            new StatTwoD('PCA Loadings', this.formatPCALoadings(data.markerIds, data.result.components))
        ];

        return stats;
    }

    private createFactorAnalysis(data: GraphData): Array<Stat> {
        // Factor Analysis Stats Array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'nIter', value: data.result.nIter.toString() },

            ])),
            // One Dimensional Stats
            new StatOneD('loglike', this.formatLoglike(data.result.loglike)),
            new StatOneD('Noise Variance', this.formatNoiseVariance(data.result.noiseVariance))
            // Two Dimensional Stats
        ];

        return stats;
    }
    // Sci-kit needs work- errorMessage 'Negative values in data passed to LatentDirichletAllocation.fit'
    private createLatentDirichletAllocation(data: GraphData): Array<Stat> {
        // Latent Dirichlet Allocation Stats Array
        const stats = [
            // Single Stats
            // One Dimensional Stats
            // Two Dimensional Stats
        ];

        return stats;
    }
    // Sci-kit needs work- errorMessage 'Negative values in data passed to NMF (input X)'
    private createNonNegativeMatrixFactorization(data: GraphData): Array<Stat> {
        // Non-Negative Matrix Factorization Stats Array
        const stats = [
            // Single Stats
            // One Dimensional Stats
            // Two Dimensional Stats
        ];

        return stats;

    }

    private createIsoMap(data: GraphData): Array<Stat> {
        // IsoMap Stats Array
        const stats = [
            // Single Stat
            // One Dimensional Stats
            // Two Dimensional Stats
            // new StatTwoD('Embedding', data.result.embedding)
        ];

        return stats;
    }
    // long lag-time
    private createLocallyLinearEmbedding(data: GraphData): Array<Stat> {
        // Locally Linear Embedding Stats Array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'Stress', value: data.result.stress.toString() },

            ])),
            // One Dimensional Stats
            // Two Dimensional Stats
            new StatTwoD('Embedding', data.result.embedding)
        ];

        return stats;
    }

    private createMds(data: GraphData): Array<Stat> {
        // MDS Stats Array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'Stress', value: data.result.stress.toFixed(2) },

            ])),
            // One Dimensional Stats
            // Two Dimensional Stats
            new StatTwoD('Embedding', data.result.embedding)
        ];

        return stats;
    }
    // 504 Gateway Timeout, message: 'endpoint request timed out'
    private createFastIca(data: GraphData): Array<Stat> {
        // Fast Ica Stats Array
        const stats = [
            // Single Stats
            // One Dimensional Stats
            // Two Dimensional Stats
        ];

        return stats;
    }
    // no returned values
    private createSpectralEmbedding(data: GraphData): Array<Stat> {
        // Spectral Embedding Stats Array
        const stats = [
            // Single Stats
            // One Dimensional Stats
            // Two Dimensional Stats
        ];

        return stats;
    }

    private createTSNE(data: GraphData): Array<Stat> {
        // TSNE Stats Array
        const stats = [
            // Single Stats
            new StatKeyValues('', ([
                { label: 'kl Divergence', value: data.result.klDivergence.toFixed(2) },
                { label: 'nIter', value: data.result.nIter.toString() },

            ])),
            // One Dimensional Stats
            // Two Dimensional Stats
            new StatTwoD('Embedding', data.result.embedding),
        ];

        return stats;
    }

    // One D Recycled Data Formulas
    // Principle Components
    formatPrincipleComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const rv = data.map((v, i) => ({ label: 'PC' + (i + 1), value: (Math.round( v * 100 ) / 100)  }));
        rv.push( {label: 'Other', value: rv.reduce( (p, c) => { p -= c.value; return p; }, 100 )});
        return rv;
    }

    formatError(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const error = data.map((v, i) => ({ label: 'Error' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
        return error.filter((v, i) => i < 10);
    }
    formatLambdas(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const error = data.map((v, i) => ({ label: 'Lambda' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
        return error.filter((v, i) => i < 10);
    }
    formatLoglike(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const logLike = data.map((v, i) => ({ label: 'loglike' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
        return logLike.filter((v, i) => i < 10);
    }
    formatNoiseVariance(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const noiseVariance = data.map((v, i) => ({ label: 'Noise Var' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
        return noiseVariance.filter((v, i) => i < 10);
    }
    formatMean(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const noiseVariance = data.map((v, i) => ({ label: 'Mean' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
        return noiseVariance.filter((v, i) => i < 10);
    }
    // Two D Recycled Data Formulas
    formatPCALoadings(markers: Array<string>, data: Array<Array<number>>): Array<{ label: string, value: number, color?: number }> {
        return data[0].sort((a, b) => b - a).splice(0, 20).map((v, i) => ({ label: markers[i], value: Math.round(v * 1e2) / 1e2 }));
    }
}
