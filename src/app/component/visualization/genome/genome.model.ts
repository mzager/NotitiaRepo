import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class GenomeConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.GENOME;
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    chromosomeOption = 'Cytobands';
}

export interface GenomeDataModel extends GraphData {
    legends: Array<Legend>;
    genes: any;
    bands: any;
    chromo: Array<{'chr': string, 'P': number, 'C': number, 'Q': number}>;
    showAllGenes: Boolean;
    showBands: Boolean;
    allowRotation: Boolean;
}
