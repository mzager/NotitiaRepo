import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class ChromosomeConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.CHROMOSOME;
        this.label = 'Chromosome';
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    chromosome = '5';
    layoutOption = 'Circle';
    spacingOption = 'Linear';
    geneOption = {label: 'All Genes', key: 'all'};
    chordOption = {label: 'None', key: 'none'};
}

export interface ChromosomeDataModel extends GraphData {
    genes: any;
    links: any;
    result: any;
}
