import { GraphData } from './graph-data.model';
import { VisualizationEnum, StatTypeEnum, ChartTypeEnum } from 'app/model/enum.model';
import * as data from 'app/action/data.action';
import { multicast } from 'rxjs/operator/multicast';
import { single } from 'rxjs/operator/single';

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

// need to finish
export class StatTwoD implements Stat {
    readonly type = StatTypeEnum.TWO_D;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.SCATTER];
    name: string;
    data: Array<{ label: string, value: number, color?: number }>;
    constructor(name: string, data: Array<{ label: string, value: number, color?: number }>) {
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
                        'field': 'label',
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
            'title': {
                'text': stat.name,
                'fontSize': 4,
                'font': 'Lato'
            },
            'width': 185,
            'height': 250,
            'padding': 0,
            'autosize': { 'type': 'fit', 'resize': true },
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
                    'values': values,
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
    // not complete
    private createScatter(stat: Stat): any {
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

    // Public Interface + Takes The Visualization Type and figures which to call
    public getStatObjects(data: GraphData, vis: VisualizationEnum): Array<Stat> {
        // Unsupervised Learning Clustering
        return (vis === VisualizationEnum.INCREMENTAL_PCA) ? this.createIncrementalPca(data) :
            (vis === VisualizationEnum.TRUNCATED_SVD) ? this.createTruncatedSvd(data) :
            (vis === VisualizationEnum.PCA) ? this.createPca(data) :
            (vis === VisualizationEnum.SPARSE_PCA) ? this.createSparse_PCA(data) :
            (vis === VisualizationEnum.KERNAL_PCA) ? this.createKernalPca(data) :
            (vis === VisualizationEnum.DICTIONARY_LEARNING) ? this.createDictionaryLearning(data) :
            (vis === VisualizationEnum.FA) ? this.createFactorAnalysis(data) :
            (vis === VisualizationEnum.LDA) ? this.createLatentDirichletAllocation(data) :
            (vis === VisualizationEnum.NMF) ? this.createNonNegativeMatrixFactorization(data) :
            (vis === VisualizationEnum.ISOMAP) ? this.createIsoMap(data) :
            (vis === VisualizationEnum.LOCALLY_LINEAR_EMBEDDING) ? this.createLocallyLinearEmbedding(data) :
            (vis === VisualizationEnum.MDS) ? this.createMds(data) :
            (vis === VisualizationEnum.FAST_ICA) ? this.createFastIca(data) :
            (vis === VisualizationEnum.SPECTRAL_EMBEDDING) ? this.createSpectralEmbedding(data) :
            (vis === VisualizationEnum.TSNE) ? this.createTSNE(data) :

                null;
    }

    private createIncrementalPca(data: GraphData): Array<Stat> {
        // IncrementalPca stats array
        // debugger;

        const stats = [
            // Single Stats
            // new StatSingle('Samples Seen', this.singleValue(data.result.nSamplesSeen)),
            // new StatSingle('Noise Variance', this.singleValue(data.result.noiseVariance)),
            // new StatSingle('nComponents', this.singleValue(data.result.nComponents)),
            // One Dimensional Stats
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues))
            // new StatOneD('Mean', data.result.mean),
            // new StatOneD('skvars', data.result.skvars),
            // Two Dimensional Stats
            // new StatTwoD('Components', data.result.components),
            // Maybe combine Singles?
            // new StatKeyValues('Misc', [
            //     {label: 'Components', value: data.result.nComponents},
            //     {label: 'Samples Seen', value: data.result.nSamplesSeen},
            //     {label: 'Noise Variance', value: data.result.noiseVariance},
            //     {label: 'nComponents', value: data.result.nComponents},
            // ])
        ];

        return stats;
    }

    private createTruncatedSvd(data: GraphData): Array<Stat> {
        // Truncated Svd stats array
        const stats = [
            // One Dimensional Stats
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues))
            // new StatTwoD('Components', data.result.components),
        ];

        return stats;
    }

    private createPca(data: GraphData): Array<Stat> {
        // Truncated Svd stats array
        const stats = [
            // Single Stats
            // new StatSingle('Noise Variance', this.singleValue(data.result.noiseVariance)),
            // new StatSingle('nComponents', this.singleValue(data.result.nComponents)),
            // One Dimensional Stats
            // new StatOneD('Mean', data.result.mean),
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues))
            // Two Dimensional Stats
            // new StatTwoD('Components', data.result.components),
        ];

        return stats;
    }

    private createSparse_PCA(data: GraphData): Array<Stat> {
        // Sparse PCA Stats Array
        const stats = [
            // Single Stats
            new StatSingle('Iter', data.result.iter),
            // One Dimensional Stats
            new StatOneD('Error', this.formatError(data.result.error)),
            // Two Dimensional Stats
            new StatTwoD('Components', data.result.components)
        ];

        return stats;
    }

    private createKernalPca(data: GraphData): Array<Stat> {
        // Kernal PCA Stats Array
        const stats = [
            // Single Stats
            new StatSingle('lambdas', data.result.lambdas),
            // Two Dimensional Stats
            new StatTwoD('alphas', data.result.alphas)
        ];

        return stats;
    }

    private createDictionaryLearning(data: GraphData): Array<Stat> {
        // Dictionary Learning Stats Array
        const stats = [
            // Single Stats
            new StatSingle('nIter', data.result.nIter),
            // One Dimensional Stats
            new StatOneD('error', data.result.error),
            // Two Dimensional Stats
            new StatTwoD('components', data.result.components)
        ];

        return stats;
    }

    private createFactorAnalysis(data: GraphData): Array<Stat> {
        // Factor Analysis Stats Array
        const stats = [
            // Single Stats
            new StatSingle('nIter', data.result.nIter),
            // One Dimensional Stats
            new StatOneD('loglike', data.result.loglike),
            new StatOneD('noiseVariance', data.result.noiseVariance)
            // Two Dimensional Stats
        ];

        return stats;
    }
    // Sci-kit needs work- errorMessage "Negative values in data passed to LatentDirichletAllocation.fit"
    private createLatentDirichletAllocation(data: GraphData): Array<Stat> {
        // Latent Dirichlet Allocation Stats Array
        const stats = [
            // Single Stats
            // One Dimensional Stats
            // Two Dimensional Stats
        ];

        return stats;
    }
    // Sci-kit needs work- errorMessage "Negative values in data passed to NMF (input X)"
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
            new StatTwoD('embedding', data.result.embedding)
        ];

        return stats;
    }
    // long lag-time
    private createLocallyLinearEmbedding(data: GraphData): Array<Stat> {
        // Locally Linear Embedding Stats Array
        const stats = [
            // Single Stats
            new StatSingle('stress', data.result.stress),
            // One Dimensional Stats
            // Two Dimensional Stats
            new StatTwoD('embedding', data.result.embedding)
        ];

        return stats;
    }

    private createMds(data: GraphData): Array<Stat> {
        // MDS Stats Array
        const stats = [
            // Single Stats
            new StatSingle('stress', data.result.stress),
            // One Dimensional Stats
            // Two Dimensional Stats
            new StatTwoD('embedding', data.result.embedding)
        ];

        return stats;
    }
    // 504 Gateway Timeout, message: "endpoint request timed out"
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
            new StatSingle('klDivergence', data.result.klDivergence),
            new StatSingle('nIter', data.result.nIter),
            // One Dimensional Stats
            // Two Dimensional Stats
            new StatTwoD('embedding', data.result.embedding),
        ];

        return stats;
    }


    // recycled data formulas
    formatPrincipleComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        return data.map((v, i) => ({ label: 'PC' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
    }
    formatError(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        const error = data.map((v, i) => ({ label: 'Error' + (i + 1), value: Math.round(v * 1e2) / 1e2 }));
        return error.filter((v, i) => i < 10);
    }

    // singleValue(data: string) {
    //     return data;
    // }
    // formatMarkerComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
    //     return null;
    // }


}
