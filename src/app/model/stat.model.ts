import { GraphData } from './graph-data.model';
import { VisualizationEnum, StatTypeEnum, ChartTypeEnum } from 'app/model/enum.model';
import * as data from 'app/action/data.action';

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
}

export class StatSingle implements Stat {
    readonly type = StatTypeEnum.SINGLE;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.LABEL];
    name: string;
    data: string;
    constructor(name: string, data: string) {
        this.name = name;
        this.data = data;
    }
}

export class StatOneD implements Stat {
    readonly type = StatTypeEnum.ONE_D;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.PIE, ChartTypeEnum.DONUT, ChartTypeEnum.HISTOGRAM];
    name: string;
    data: Array<{ label: string, value: number, color?: number }>;

    constructor(name: string, data: Array<{ label: string, value: number, color?: number }>) {
        this.name = name;
        this.data = data;
    }
}

export class StatTwoD implements Stat {
    readonly type = StatTypeEnum.TWO_D;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.SCATTER];
    name: string;
    data: any;
    constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
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

    private constructor() { }


    /*
    Public Interface that takes the ChartType and figures which to call, EXAMPLE: if DONUT create donut with stat variable,
    that requires a name, type, chart and data
    */
    public getVegaObject(stat: Stat, chartType: ChartTypeEnum): any {
        return (chartType === ChartTypeEnum.DONUT) ? this.createDonut(stat) :
            (chartType === ChartTypeEnum.HISTOGRAM) ? this.createHistogram(stat) :
                (chartType === ChartTypeEnum.PIE) ? this.createPie(stat) :
                    (chartType === ChartTypeEnum.LINE) ? this.createLine(stat) :
                        (chartType === ChartTypeEnum.LABEL) ? this.createLabel(stat) :
                            (chartType === ChartTypeEnum.SCATTER) ? this.createScatter(stat) :
                                null;
    }

    private createDonut(stat: Stat): any {
        const values = stat.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'title': {
                'text': stat.name,
                'font': 'Lato',
                'offset': 10,
                'fontSize': 8
            },
            'width': 185,
            'height': 250,
            'padding': 0,
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
                                'value': 40
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
                                'offset': 60
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
    private createHistogram(stat: Stat): any {
        const values = stat.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'title': {
                'text': stat.name,
                'fontSize': 10,
                'font': 'Lato',
            },
            'width': 185,
            'height': 250,
            'padding': 0,
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
                    ]
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
                                'stroke': { 'value': 'steelblue' }
                            }
                        },
                        'labels': {
                            'interactive': true,
                            'update': {
                                'fill': { 'value': 'steelblue' },
                                'angle': { 'value': 50 },
                                'fontSize': { 'value': 10 },
                                'align': { 'value': '90' },
                                'baseline': { 'value': 'middle' },
                                'dx': { 'value': 3 }
                            },
                            'hover': {
                                'fill': { 'value': '#333' }
                            }
                        },
                        'title': {
                            'update': {
                                'fontSize': { 'value': 10 }
                            }
                        },
                        'domain': {
                            'update': {
                                'stroke': { 'value': '#333' },
                                'strokeWidth': { 'value': 1.5 }
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
                            'y': { 'scale': 'yscale', 'signal': 'tooltip.value', 'offset': -6 },
                            'text': { 'signal': 'tooltip.value' },
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
    private createPie(stat: Stat): any {
        const values = stat.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'title': {
                'text': stat.name,
                'fontSize': 4,
                'font': 'Lato'
            },
            'width': 185,
            'height': 250,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': true },
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
                    'range': { 'scheme': 'category20' }
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
                            'innerRadius': { 'value': 0 } ,
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
    private createLine(stat: Stat): any {
        return null;
    }
    private createLabel(stat: Stat): any {
        const values = stat.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'title': {
                'text': stat.name,
                'font': 'Lato',
                'offset': 10,
                'fontSize': 8
            },
            'width': 185,
            'height': 250,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': true },
            'data': [
                {
                    'name': 'table',
                    'values': values,

                }
            ],

            'marks': [
                {
                    'type': 'text',
                    'from': {
                        'data': 'table'
                    },
                    'encode': {
                        'enter': {
                            'align': {
                                'value': 'center'
                            },
                            'text': {
                                'field': 'data'
                            },
                            'font': {
                                'value': 'Lato'
                            },
                            'fontSize': {
                                'value': 10
                            }

                        }
                    }
                }
            ]
        };
        return vega;
    }

    private createScatter(stat: Stat): any {
        return null;
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

    // Public Interface + Takes The Visualzion Type and figures which to call
    public getStatObjects(data: GraphData, vis: VisualizationEnum): Array<Stat> {

        return (vis === VisualizationEnum.INCREMENTAL_PCA) ? this.chartIncrementalPca(data) :
            // (vis === VisualizationEnum.FAST_ICA) ? this.createFastIca(data, vis) :
            //     (vis === VisualizationEnum.MDS) ? this.createMds(data, vis) :
            //         (vis === VisualizationEnum.TRUNCATED_SVD) ? this.createTruncatedSvd(data, vis) :
            //             (vis === VisualizationEnum.KERNAL_PCA) ? this.createKernalPca(data, vis) :
            //                 (vis === VisualizationEnum.SPARSE_PCA) ? this.createSparse_PCA(data, vis) :
            //                     (vis === VisualizationEnum.DICTIONARY_LEARNING) ? this.createDictionaryLearning(data, vis) :
            null;
    }

    private chartIncrementalPca(data: GraphData): Array<Stat> {
        // stats array
        // debugger;
        const x = this.formatPrincipleComponents;

        const stats = [

            new StatTwoD('Components', data.result.components),
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues)),
            new StatOneD('Mean', data.result.mean),
            new StatOneD('skvars', data.result.skvars),
            new StatSingle('Samples Seen', this.singleValue(data.result.nSamplesSeen)),
            new StatSingle('Noise Variance', this.singleValue(data.result.noiseVariance)),
            new StatSingle('nComponents', this.singleValue(data.result.nComponents)),
            // new StatKeyValues('Misc', [
            //     {label: 'Components', value: data.result.nComponents},
            //     {label: 'Samples Seen', value: data.result.nSamplesSeen},
            //     {label: 'Noise Variance', value: data.result.noiseVariance},
            //     {label: 'nComponents', value: data.result.nComponents},
            // ])
        ];

        return stats;
    }

    // private createFastIca(data: any, visualization: VisualizationEnum): Array<Stat> {
    //     return null;
    // }
    // private createMds(data: any, visualization: VisualizationEnum): Array<Stat> {
    //     return null;
    // }
    // private createTruncatedSvd(data: any, visualization: VisualizationEnum): Array<Stat> {
    //     return null;
    // }
    // private createSparse_PCA(data: any, visualization: VisualizationEnum): Array<Stat> {
    //     return null;
    // }
    // private createKernalPca(data: any, visualization: VisualizationEnum): Array<Stat> {
    //     return null;
    // }
    // private createDictionaryLearning(data: any, visualization: VisualizationEnum): Array<Stat> {
    //     return null;
    // }

    // recycled data formulas
    formatPrincipleComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        return data.map((v, i) => ({ label: 'PC' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
    }
    singleValue(data: string) {
        return data;
    }
    // formatMarkerComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
    //     return null;
    // }


}
