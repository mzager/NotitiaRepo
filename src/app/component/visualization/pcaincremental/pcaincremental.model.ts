import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export class PcaIncrementalConfigModel extends GraphConfig {

    constructor() {
        super();
        this.entity = EntityTypeEnum.SAMPLE;
        this.visualization = VisualizationEnum.INCREMENTAL_PCA;
    }

    n_components = 3;
    dimension = DimensionEnum.THREE_D;
    whiten: Boolean = false;
    copy: Boolean = true;
    batch_size: 'None';
}

export interface PcaIncrementalDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
    patientIds: Array<string>;
    components: any;
    explainedVariance: any;
    explainedVarianceRatio: any;
    singularValues: any;
    skVar: any;
    mean: any;
    nComponents: any;
    noiseVariance: any;
    nSamplesSeen: any;
}
