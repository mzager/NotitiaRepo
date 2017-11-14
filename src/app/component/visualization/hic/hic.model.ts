import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, DimensionEnum, GraphEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';

export class HicConfigModel extends GraphConfig {
    constructor() {
        super();
        this.entity = EntityTypeEnum.GENE;
        this.visualization = VisualizationEnum.HIC;
        this.markerFilter = ['arap3','arhgap26','fgf1','kiaa0141','loc729080','pcdh1','pcdh12','rnf14','diaph1','fchsd1','ndfip1','gnpda1','hdac3','pcdha2','pcdhb10','pcdhb16','pcdhb2','pcdhb3','pcdhb8','pcdhb9','pcdhga12','slc25a2','pcdha3','pcdha6','pcdhb11','pcdha7','pcdhac2','loc100505658','pcdhga10','pcdhga11','pcdhga2','pcdhga3','pcdhga8','pcdhga9','pcdhgb4','pcdhgb5','pcdhgb6','pcdhgb7','pcdhga1','taf7','pcdhb12','pcdhb13','pcdhb14','pcdhb15','pcdhga7','pcdhb17','pcdhb18','pcdhb19p','pcdhb5','pcdhb6','pcdhgb8p','rell2'];
        this.showLinks = false;
        this.showChromosome = true;
    }
    dimensions = DimensionEnum.THREE_D;
    gene = 'fgf1';
    showLabels = false;
    showLinks = false;
    showChromosome = true;
}

export interface HicDataModel extends GraphData {
    legends: Array<Legend>;
    nodes: Array<any>;
    edges: Array<any>;
}
