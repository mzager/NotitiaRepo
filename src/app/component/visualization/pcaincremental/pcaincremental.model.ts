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
        this.label = 'PCA Incremental';
    }

    n_components = 10;
    dimension = DimensionEnum.THREE_D;
    whiten: Boolean = false;
    copy: Boolean = true;
    batch_size: 'None';
    pcx = 1;
    pcy = 2;
    pcz = 3;
}

export interface PcaIncrementalDataModel extends GraphData {
    result: any;
    resultScaled: Array<Array<number>>;
    sid: Array<string>;
    mid: Array<string>;
    pid: Array<string>;

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
