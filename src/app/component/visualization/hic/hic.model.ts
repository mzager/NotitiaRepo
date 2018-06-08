import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';

export class HicConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.HIC;
        this.showLinks = false;
        this.showChromosome = true;
        this.label = 'Force Directed Graph';
        this.enableCohorts = false;
        this.enableSupplemental = false;
    }
    dimensions = DimensionEnum.THREE_D;
    gene = 'fgf1';
    showLabels = false;
    showLinks = false;
    showChromosome = true;
}

export interface HicDataModel extends GraphData {
    legends: Array<Legend>;
    nodes: Array<any>;
    edges: Array<any>;
}
