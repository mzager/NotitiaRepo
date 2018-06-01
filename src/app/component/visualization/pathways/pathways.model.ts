import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';

import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

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
