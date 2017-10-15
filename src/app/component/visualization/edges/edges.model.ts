import { GraphData } from './../../../model/graph-data.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { Legend } from './../../../model/legend.model';
import { VisualizationEnum, ShapeEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';
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
    intersect: DataField = DataFieldFactory.getUndefined();
    pointColor: DataField = DataFieldFactory.getUndefined();
    pointShape: DataField = DataFieldFactory.getUndefined();
    pointSize: DataField = DataFieldFactory.getUndefined();
    pointIntersect: DataField = DataFieldFactory.getUndefined();
}

export class EdgeDataModel implements GraphData {
    legendItems: Array<Legend>;
    result: any;
    resultScaled: number[][];
    pointColor: number[];
    pointSize: number[];
    pointShape: ShapeEnum[];
    pointIntersect: Array<any>;
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
