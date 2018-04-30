import { DataTable } from './../../../model/data-field.model';
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
        this.graph = GraphEnum.EDGES;
        this.visualization = VisualizationEnum.EDGES;
        this.field = DataFieldFactory.defaultDataField;
    }
    markerFilterA: Array<string> = [];
    patientFilterA: Array<string> = [];
    sampleFitlerA: Array<string> = [];
    markerFilterB: Array<string> = [];
    patientFilterB: Array<string> = [];
    sampleFitlerB: Array<string> = [];
    entityA: EntityTypeEnum = EntityTypeEnum.UNKNOWN;
    entityB: EntityTypeEnum = EntityTypeEnum.UNKNOWN;
    field: DataField;
}

export class EdgeDataModel implements GraphData {
    legends: Array<Legend>;
    result: any;
    resultScaled: number[][];
    pointIntersect: Array<any>;
    sid: string[];
    mid: string[];
    pid: string[];
    visible: Boolean = true;
    //     edges: [{
    //         value: any;
    //         marker: Array<string>;
    //         sample: Array<string>;
    //         color: number;
    //    }];
}
