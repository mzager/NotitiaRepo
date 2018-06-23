import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';

export class ChromosomeConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.GENE;
    this.visualization = VisualizationEnum.CHROMOSOME;
    this.label = 'Chromosome';
    this.enableCohorts = false;
    this.enableSupplemental = false;
  }

  displayType: DimensionEnum = DimensionEnum.THREE_D;
  domain: Array<number> = [-500, 500];
  chromosome = '5';
  layoutOption = 'Circle';
  spacingOption = 'Linear';
  geneOption = { label: 'All Genes', key: 'all' };
  chordOption = { label: 'None', key: 'none' };
}

export interface ChromosomeDataModel extends GraphData {
  genes: any;
  links: any;
  result: any;
}
