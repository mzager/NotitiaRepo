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
            'autosize': 'none',
            'signals': [
                {
                  'name': 'startAngle', 'value': 0,
                  'bind': {'input': 'range', 'min': 0, 'max': 6.29, 'step': 0.01}
                },
                {
                  'name': 'endAngle', 'value': 6.29,
                  'bind': {'input': 'range', 'min': 0, 'max': 6.29, 'step': 0.01}
                },
                {
                  'name': 'padAngle', 'value': 0,
                  'bind': {'input': 'range', 'min': 0, 'max': 0.1}
                },
                {
                  'name': 'innerRadius', 'value': 60,
                  'bind': {'input': 'range', 'min': 0, 'max': 90, 'step': 1}
                },
                {
                  'name': 'cornerRadius', 'value': 0,
                  'bind': {'input': 'range', 'min': 0, 'max': 10, 'step': 0.5}
                },
                {
                  'name': 'sort', 'value': false,
                  'bind': {'input': 'checkbox'}
                }
              ],
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
                    'sort': false
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
                      'y': {'signal': 'height / 2'}
                    },
                    'update': {
                      'startAngle': {'field': 'startAngle'},
                      'endAngle': {'field': 'endAngle'},
                      'padAngle': {'signal': 'padAngle'},
                      'innerRadius': {'signal': 'innerRadius'},
                      'outerRadius': {'signal': 'width / 2'},
                      'cornerRadius': {'signal': 'cornerRadius'}
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
        this.width = 300;
        this.height = 300;
    }
}

export class DonutConfig extends AbstractStatChartConfig {

    data: Array<{label: string, value: number, color?: number}>;

    constructor() {
        super();
        this.type = StatChartEnum.DONUT;
    }

}
