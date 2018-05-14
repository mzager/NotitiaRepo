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
        this.label = 'Genome';
        this.enableCohorts = false;
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    alignment = '19';
    chromosomeOption = 'Cytobands';
    layoutOption = 'Circle';
    spacingOption = 'Optimized';
    showTads = false;
}

export interface GenomeDataModel extends GraphData {
    legends: Array<Legend>;
    genes: any;
    tads: Array<any>;
    bands: Array<Array<{ arm: string, c: number, chr: string, e: number, l: number, s: number, subband: string, tag: string, z: number }>>;
    chromo: Array<{ chr: string, P: number, C: number, Q: number }>;
    showBands: Boolean;
    allowRotation: Boolean;
}



