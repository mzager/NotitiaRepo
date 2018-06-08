import { DimensionEnum, DirtyEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class PathwaysConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.PATHWAYS;
        this.dirtyFlag = DirtyEnum.LAYOUT;
        this.label = 'Pathways';
        this.enableGenesets = false;
        this.enableCohorts = false;
        this.enablePathways = true;
        this.enableSupplemental = false;
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
}

export interface PathwaysDataModel extends GraphData {
    layout: any;
}
