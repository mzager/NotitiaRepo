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
        return {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'width': 400,
            'height': 200,
            'padding': 5,
            'autosize': { 'type': 'fit', 'resize': true },
            'signals': [
                {
                    'name': 'maxbins', value: 10,
                    'bind': { 'input': 'select', 'options': [5, 10, 20] }
                },
                {
                    'name': 'binDomain',
                    'update': 'sequence(bins.start, bins.stop + bins.step, bins.step)'
                },
                {
                    'name': 'nullGap', value: 10
                },
                {
                    'name': 'barStep',
                    'update': '(width - nullGap) / binDomain.length'
                }
            ],

            'data': [
                {
                    'name': 'table',
                    'url': 'data/movies.json',
                    'transform': [
                        {
                            'type': 'extent', field: 'IMDB_Rating',
                            'signal': 'extent'
                        },
                        {
                            'type': 'bin', 'signal': 'bins',
                            field: 'IMDB_Rating', 'extent': { 'signal': 'extent' },
                            'maxbins': { 'signal': 'maxbins' }
                        }
                    ]
                },
                {
                    'name': 'counts',
                    'source': 'table',
                    'transform': [
                        {
                            'type': 'filter',
                            'expr': 'datum[\'IMDB_Rating\'] != null'
                        },
                        {
                            'type': 'aggregate',
                            'groupby': ['bin0', 'bin1']
                        }
                    ]
                },
                {
                    'name': 'nulls',
                    'source': 'table',
                    'transform': [
                        {
                            'type': 'filter',
                            'expr': 'datum[\'IMDB_Rating\'] == null'
                        },
                        {
                            'type': 'aggregate'
                        }
                    ]
                }
            ],

            'scales': [
                {
                    'name': 'yscale',
                    'type': 'linear',
                    'range': 'height',
                    'round': true, 'nice': true,
                    'domain': {
                        'fields': [
                            { 'data': 'counts', field: 'count' },
                            { 'data': 'nulls', field: 'count' }
                        ]
                    }
                },
                {
                    'name': 'xscale',
                    'type': 'bin-linear',
                    'range': [{ 'signal': 'barStep + nullGap' }, { 'signal': 'width' }],
                    'round': true,
                    'domain': { 'signal': 'binDomain' }
                },
                {
                    'name': 'xscale-null',
                    'type': 'band',
                    'range': [0, { 'signal': 'barStep' }],
                    'round': true,
                    'domain': [null]
                }
            ],

            'axes': [
                { 'orient': 'bottom', 'scale': 'xscale', 'tickCount': 10 },
                { 'orient': 'bottom', 'scale': 'xscale-null' },
                { 'orient': 'left', 'scale': 'yscale', 'tickCount': 5, 'offset': 5 }
            ],

            'marks': [
                {
                    'type': 'rect',
                    'from': { 'data': 'counts' },
                    'encode': {
                        'update': {
                            'x': { 'scale': 'xscale', field: 'bin0', 'offset': 1 },
                            'x2': { 'scale': 'xscale', field: 'bin1' },
                            'y': { 'scale': 'yscale', field: 'count' },
                            'y2': { 'scale': 'yscale', value: 0 },
                            'fill': { value: 'steelblue' }
                        },
                        'hover': {
                            'fill': { value: '#000' }
                        }
                    }
                },
                {
                    'type': 'rect',
                    'from': { 'data': 'nulls' },
                    'encode': {
                        'update': {
                            'x': { 'scale': 'xscale-null', value: null, 'offset': 1 },
                            'x2': { 'scale': 'xscale-null', 'band': 1 },
                            'y': { 'scale': 'yscale', field: 'count' },
                            'y2': { 'scale': 'yscale', value: 0 },
                            'fill': { value: '#aaa' }
                        },
                        'hover': {
                            'fill': { value: '#000' }
                        }
                    }
                }
            ]
        };
    }

    public createDonutConfig(): DonutConfig {
        return new DonutConfig();
    }

    public createDonutVega(config: DonutConfig): any {

        const values = config.data.map((v, i) => ({ id: (i + 1), label: v.label, field: v.value.toFixed(2) }));
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            width: config.width,
            height: config.height,
            padding: 25,
            autosize: { type: 'fit', resize: true },
            data: [
                {
                    name: 'table',
                    values: values,
                    transform: [
                        {
                            type: 'pie',
                            field: 'field',
                        }
                    ]
                }
            ],
            signals: [
              {
                name: 'hover',
                init: null,
                streams: [
                  {type: 'symbol:mouseover', expr: 'datum'},
                  {type: 'symbol:mouseout', expr: null}
                ]
              },
            ],
            scales: [
                {
                    name: 'r',
                    type: 'sqrt',
                    domain: {
                        data: 'table',
                        field: 'field'
                    }
                },
                {
                    name: 'color',
                    type: 'ordinal',
                    domain: {
                        data: 'table',
                        field: 'label'
                    },
                    range: {
                        scheme: 'yellowgreenblue-3'
                    }
                }
            ],
            marks: [
                {
                    type: 'arc',
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
                            startAngle: {
                                field: 'startAngle'
                            },
                            endAngle: {
                                field: 'endAngle'
                            },
                            padAngle: {
                                value: 0.035
                            },
                            innerRadius: {
                                value: 60
                            },
                            outerRadius: {
                                signal: 'width / 2'
                            },
                            cornerRadius: {
                                value: 0
                            },
                            // fill: {
                            //   scale: 'color',
                            //   field: 'field'
                            // }
                        },
                        update: {
                          // fill: {
                          //   scale: 'color',
                          //   field: 'field'
                          // }
                        },
                        hover: {
                          fill: { value: 'pink' }
                        }
                        // ,
                        // // opacity change on hover
                        // 'update': {
                        //     'fill': {
                        //         'scale': 'color',
                        //         field: field
                        //     },
                        //     'fillOpacity': {
                        //         value: 1
                        //     }
                        // }
                    }
                }
                // {
                //     'type': 'text',
                //     'from': {
                //         'data': 'table'
                //     },
                //     'encode': {
                //         'enter': {
                //             'x': {
                //                 field: {
                //                     'group': 'width'
                //                 },
                //                 'mult': 0.5
                //             },
                //             'y': {
                //                 field: {
                //                     'group': 'height'
                //                 },
                //                 'mult': 0.5
                //             },
                //             'radius': {
                //                 'scale': 'r',
                //                 field: field,
                //                 'offset': 90
                //             },
                //             'theta': {
                //                 'signal': '(datum.startAngle + datum.endAngle)/2'
                //             },
                //             'align': {
                //                 value: 'center'
                //             },
                //             'text': {
                //                 field: 'label'
                //             },
                //             'font': {
                //                 value: 'Lato'
                //             },
                //             'fontSize': {
                //                 value: 14
                //             }
                //         }
                //     }
                // }
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
