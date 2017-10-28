export class StatsFactory {

    private static _instance: StatsFactory = null;

    public static getInstance(): StatsFactory {
        if (StatsFactory._instance === null) { StatsFactory._instance = new StatsFactory(); }
        return StatsFactory._instance;
    }

    public createDonutConfig(): DonutConfig  {
        return new DonutConfig();
    }

    public createDonutVega( config: DonutConfig ): any {

        const values = config.data.map( (v, i) => ( {id: (i + 1), label: v.label, field: v.value}) );
        const vega = {
            '$schema': 'https://vega.github.io/schema/vega/v3.0.json',
            'width': config.width,
            'height': config.height,
            'data': [
              {
                'name': 'table',
                'values': values,

                'transform': [
                  {
                    'type': 'pie',
                    'field': 'field',
                    'startAngle': 0,
                    'endAngle': Math.PI * 2,
                    'sort': false,
                  }
                ]
              }
            ],
            'scales': [
              {
                'name': 'color',
                'type': 'ordinal',
                'range': {'scheme': 'category20'}
              }
            ],
            'marks': [
                {
                  'type': 'arc',
                  'from': {'data': 'table'},
                  'encode': {
                    'enter': {
                      'fill': {'scale': 'color', 'field': 'id'},
                      'x': {'signal': 'width / 2'},
                      'y': {'signal': 'height / 2'},
                      'startAngle': {'field': 'startAngle'},
                      'endAngle': {'field': 'endAngle'},
                      'padAngle': {'value': 0.035},
                      'innerRadius': {'value': 60},
                      'outerRadius': {'signal': 'width / 2'},
                      'cornerRadius': {'value': 0}
                    },
                  }
                },

              ]

          };


          return vega;
    }


    constructor() {}

}

export enum StatChartEnum {
    DONUT = 1
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
        this.width = 200;
        this.height = 200;
    }
}

export class DonutConfig extends AbstractStatChartConfig {

    data: Array<{label: string, value: number, color?: number}>;

    constructor() {
        super();
        this.type = StatChartEnum.DONUT;
    }

}
