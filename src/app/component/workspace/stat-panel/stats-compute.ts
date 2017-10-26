import { AbstractStatChartConfig, StatChartEnum, StatsFactory, DonutConfig } from './stats-factory';

export const explainedVariance = ( values: Array<number> ): any => {
    const config: DonutConfig = StatsFactory.getInstance().createDonutConfig();
    config.data = values.map( (v, i) => ({ label: 'PC ' + (i + 1), value: v }));
    return createGraph( config );
};

export const explainedVarianceRatio = ( values: Array<number> ): any => {
    return explainedVariance(values);
};


export const createGraph = (config: AbstractStatChartConfig): any => {
    switch (config.type) {
        case StatChartEnum.DONUT:
            return StatsFactory.getInstance().createDonutVega( config as DonutConfig);
    }
};
