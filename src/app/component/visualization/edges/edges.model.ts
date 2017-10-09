import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
import { DataFieldFactory } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { VisualizationEnum, ShapeEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { DimensionEnum } from './../../../model/enum.model';

export class EdgeConfigModel extends GraphConfig {
    
    edgeData = '';
    edgeColor: DataField = DataFieldFactory.getUndefined();
    edgeSize: DataField = DataFieldFactory.getUndefined();
    visible = false;
}

export interface EdgeDataModel extends GraphData {
    legends: Array<Legend>;
    markers: Array<string>;
    samples: Array<string>;
    visible: Boolean;
    edges: [{
        value: any;
        marker: Array<string>;
        sample: Array<string>;
        color: number;
   }];
}
