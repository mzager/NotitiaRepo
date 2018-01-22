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
    }

    displayType: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-500, 500];
    pathway = 'chromatin_modifying_enzymes'; // 'copi-mediated_anterograde_transport';
}

export interface PathwaysDataModel {
    legends: Array<Legend>;
    layout: any;
}
