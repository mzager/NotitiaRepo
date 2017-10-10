import { GraphData, GraphConfig } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { VisualizationEnum, ShapeEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { DimensionEnum } from './../../../model/enum.model';

export class EdgeConfigModel extends GraphConfig {

    constructor() {

        super();

        this.entity = EntityTypeEnum.MIXED;
        this.visualization = VisualizationEnum.EDGES;
    }

    isVisible = false;
    entityA: EntityTypeEnum = EntityTypeEnum.SAMPLE;
    entityB: EntityTypeEnum = EntityTypeEnum.SAMPLE;
}

export class EdgeDataModel implements GraphData {
    legends: Legend[];
    result: any;
    resultScaled: number[][];
    pointColor: number[];
    pointSize: number[];
    pointShape: ShapeEnum[];
    sampleIds: string[];
    markerIds: string[];
    patientIds: string[];
    visible: Boolean = true;
//     edges: [{
//         value: any;
//         marker: Array<string>;
//         sample: Array<string>;
//         color: number;
//    }];
}
