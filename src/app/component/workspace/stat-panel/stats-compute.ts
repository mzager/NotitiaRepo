import { AbstractStatChartConfig, StatChartEnum, StatsFactory, DonutConfig, HistogramConfig, ViolinConfig } from './stats-factory';

// HISTOGRAM
export const genericHistogram = (values: Array<any>): any => {
    const config: HistogramConfig = StatsFactory.getInstance().createHistogramConfig();
    config.data = values;

    return createGraph(config);
};

// VIOLIN
export const genericViolin = (values: Array<number>): any => {
    const config: ViolinConfig = StatsFactory.getInstance().createViolinConfig();
    config.data = values.map((v, i) => ({ label: 'Gene ' + (i + 1), value: v }));
    return createGraph(config);
};

// DONUT
export const genericDonut = (values: Array<number>): any => {
    const config: DonutConfig = StatsFactory.getInstance().createDonutConfig();
    config.data = values.map((v, i) => ({ label: 'PC ' + (i + 1), value: v }));
    return createGraph(config);
};

export const explainedVarianceRatio = (values: Array<number>): any => {
    return genericDonut(values);
};


export const createGraph = (config: AbstractStatChartConfig): any => {
    switch (config.type) {
        case StatChartEnum.DONUT:
            return StatsFactory.getInstance().createDonutVega(config as DonutConfig);
        case StatChartEnum.HISTOGRAM:
            return StatsFactory.getInstance().createHistogramVega(config as HistogramConfig);
        case StatChartEnum.VIOLIN:
            return StatsFactory.getInstance().createViolinVega(config as ViolinConfig);
    }
};
