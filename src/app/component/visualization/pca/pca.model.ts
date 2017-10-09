import { VisualizationEnum, GraphEnum, EntityTypeEnum, DimensionEnum, ShapeEnum } from 'app/model/enum.model';
import { GraphData } from 'app/model/graph-config.model';
import { Legend, LegendItem } from './../../../model/legend.model';
import { DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataField } from 'app/model/data-field.model';

export enum PcaDisplayEnum {
    WEIGHT = 1,
    SCORE = 2,
    LOADING = 4,
    NONE = 0
}

export class PcaConfigModel extends GraphConfig {
    dimension: DimensionEnum = DimensionEnum.THREE_D;
    domain: Array<number> = [-300, 300];
    showVectors: Boolean = false;
    isCentered: Boolean = true;
    isScaled: Boolean = false;
}

export interface PcaDataModel extends GraphData {
    legends: Array<Legend>;
    eigenvectors: any;
    eigenvectorsScaled: any;
    eigenvalues: any;
    loadings: any;
    scoresScaled: any;
    explainedVariance: any;
    cumulativeVariance: any;
    standardDeviations: any;
    pointColor: Array<number>;
    pointSize: Array<number>;
    pointShape: Array<ShapeEnum>;
    sampleIds: Array<string>;
    markerIds: Array<string>;
}
