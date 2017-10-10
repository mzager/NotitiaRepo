import { Legend } from './../../../model/legend.model';
import { GraphConfig, GraphData } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class ChromosomeConfigModel extends GraphConfig {
    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    chromosomeOption = 'Cytobands';
}

export interface ChromosomeDataModel extends GraphData {
    legends: Array<Legend>;
    genes: any;
    bands: any;
    chromo: Array<{'chr': string, 'P': number, 'C': number, 'Q': number}>;
    showAllGenes: Boolean;
    showBands: Boolean;
    allowRotation: Boolean;
}
