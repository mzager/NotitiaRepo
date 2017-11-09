import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class HicConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.HIC;
        this.markerFilter = ['ABCA2'];
        this.showLinks = false;
        this.showChromosome = true;
    }
    dimensions = DimensionEnum.THREE_D;
    gene = 'ABCA2';
    showLabels = false;
    showLinks = false;
    showChromosome = true;
}

export interface HicDataModel extends GraphData {
    legends: Array<Legend>;
    nodes: Array<any>;
    edges: Array<any>;
}
