import { GraphData } from './graph-data.model';
import { VisualizationEnum, StatTypeEnum, ChartTypeEnum } from 'app/model/enum.model';

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
    readonly type =  StatTypeEnum.ONE_D;
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

        // Singleton Pattern
        private static _instance: VegaFactory = null;
        public static getInstance(): VegaFactory {
            if (VegaFactory._instance === null) { VegaFactory._instance = new VegaFactory(); }
            return VegaFactory._instance;
        }
        private constructor() { }

        // Public Interface + Takes The Visualzion Type and figures which to call
        public getVegaObject(stat: Stat, chartType: ChartTypeEnum): any {
            return (chartType === ChartTypeEnum.DONUT) ? this.createDonut(stat) :
                (chartType === ChartTypeEnum.HISTOGRAM) ? this.createHistogram(stat) :
                null;
        }

        private createDonut(stat: Stat): any {
            return null;
        }

        private createHistogram(stat: Stat): any {
            return null;
        }
    }

// Factory Pattern
export class StatFactory {

    // Singleton Pattern
    private static _instance: StatFactory = null;
    public static getInstance(): StatFactory {
        if (StatFactory._instance === null) { StatFactory._instance = new StatFactory(); }
        return StatFactory._instance;
    }
    private constructor() { }

    // Public Interface + Takes The Visualzion Type and figures which to call
    public getStatObjects(data: GraphData, vis: VisualizationEnum): Array<Stat> {

        return (vis === VisualizationEnum.INCREMENTAL_PCA) ? this.chartIncrementalPca(data, vis) :
               (vis === VisualizationEnum.FAST_ICA) ? this.createFastIca(data, vis) :
        null;
    }

    private chartIncrementalPca(data: GraphData, visualization: VisualizationEnum): Array<Stat> {

        // single values
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

    private createFastIca(data: any, visualization: VisualizationEnum): Array<Stat> {
        return null;
    }

    formatPrincipleComponents(data: Array<number>): Array<{ label: string, value: number, color?: number }> {
        return data.map( (v, i) => ({label: 'PC' + (i + 1), value: v }) );
    }


}
