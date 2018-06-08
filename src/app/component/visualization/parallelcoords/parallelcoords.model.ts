import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class ParallelCoordsConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.MIXED;
        this.visualization = VisualizationEnum.PARALLEL_COORDS;
        this.label = 'Parallel Coordinates';
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    chromosome = '4';
}

export interface ParallelCoordsDataModel extends GraphData {
    // legends: Array<Legend>;
    genes: any;
    links: any;
    // bands: any;
    // chromo: Array<{'chr': string, 'P': number, 'C': number, 'Q': number}>;
    // showAllGenes: Boolean;
    // showBands: Boolean;
    // allowRotation: Boolean;
}
