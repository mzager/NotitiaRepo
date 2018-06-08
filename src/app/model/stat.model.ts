import { ChartTypeEnum, StatRendererColumns, StatRendererEnum, StatTypeEnum } from 'app/model/enum.model';


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

// Single Values
export class StatKeyValues implements Stat {
    readonly type = StatTypeEnum.MISC;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.LABEL];
    name: string;
    data: Array<{ mylabel: string, myvalue: string }>;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;

    constructor(name: string, data: Array<{ mylabel: string, myvalue: string }>) {
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
    data: Array<{ mylabel: string, myvalue: number, color?: number }>;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;
    constructor(name: string, data: Array<{ mylabel: string, myvalue: number, color?: number }>) {
        this.name = name;
        this.data = data;
        this.renderer = StatRendererEnum.VEGA;
        this.columns = StatRendererColumns.SIX;
    }
}

// 2D Values
export class StatTwoD implements Stat {
    readonly type = StatTypeEnum.TWO_D;
    charts: Array<ChartTypeEnum> = [ChartTypeEnum.HISTOGRAM, ChartTypeEnum.SCATTER];
    name: string;
    data: Array<{ mylabel: string, myvalue: number, color?: number }>;
    renderer: StatRendererEnum;
    columns: StatRendererColumns;
    constructor(name: string, data: Array<{ mylabel: string, myvalue: number, color?: number }>) {
        this.name = name;
        this.data = data;
        this.renderer = StatRendererEnum.VEGA;
        this.columns = StatRendererColumns.TWELVE;
    }
}
