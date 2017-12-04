import { GraphData } from './graph-data.model';
import { VisualizationEnum, StatTypeEnum, ChartTypeEnum } from 'app/model/enum.model';

/* GENERAL note: Visualization = is the graph A/B, example PCA Fast ICA, PCA. Stat = result data coming from ski-kit
Visalization, Graph = is what is final rendering
*/

/*
This is not a IS A (extends) or a HAS A (contains), this is an interface, ACTS-LIKE "contract" polymorphic

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
            // (chartType === ChartTypeEnum.HISTOGRAM) ? this.createHistogram(stat) :
            //     (chartType === ChartTypeEnum.PIE) ? this.createPie(stat) :
            //         (chartType === ChartTypeEnum.LINE) ? this.createLine(stat) :
            //             (chartType === ChartTypeEnum.LABEL) ? this.createLabel(stat) :
            //                 (chartType === ChartTypeEnum.SCATTER) ? this.createScatter(stat) :
                                null;
    }


    private createDonut(stat: Stat): any {
        const values = stat.data;
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'width': 250,
            'height': 250,
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
    // private createHistogram(stat: Stat): any {
    //     return null;
    // }
    // private createPie(stat: Stat): any {
    //     return null;
    // }
    // private createLine(stat: Stat): any {
    //     return null;
    // }
    // private createLabel(stat: Stat): any {
    //     return null;
    // }
    // private createScatter(stat: Stat): any {
    //     return null;
    // }
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
        const stats = [
            new StatTwoD('components', data.result.components),
            new StatOneD('Explained Variance', this.formatPrincipleComponents(data.result.explainedVariance)),
            new StatOneD('Explained Variance Ratio', this.formatPrincipleComponents(data.result.explainedVarianceRatio)),
            new StatOneD('Singular Values', this.formatPrincipleComponents(data.result.singularValues)),
            new StatOneD('mean', data.result.mean),
            new StatOneD('skvars', data.result.skvars),
            new StatSingle('nComponents', data.result.nComponents),
            new StatSingle('nSamplesSeen', data.result.nSamplesSeen),
            new StatSingle('noiseVariance', data.result.noiseVariance),
            new StatSingle('nComponents', data.result.nComponents)
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
        return data.map((v, i) => ({ label: 'PC' + (i + 1), value: v }));
    }
    // formatMarkerComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
    //     return null;
    // }


}
