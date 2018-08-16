<<<<<<< HEAD
import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Legend } from './../../../model/legend.model';
=======
import { DimensionEnum, EntityTypeEnum, VisualizationEnum } from "app/model/enum.model";
import { GraphConfig } from "app/model/graph-config.model";
import { GraphData } from "./../../../model/graph-data.model";
import { Legend } from "./../../../model/legend.model";
>>>>>>> a947a94743ca0203655e535e63bac428d1227be3

export class GenomeConfigModel extends GraphConfig {
  constructor() {
    super();
    this.entity = EntityTypeEnum.GENE;
    this.visualization = VisualizationEnum.GENOME;
<<<<<<< HEAD
    this.label = 'Genome';
    this.enableCohorts = false;
=======
    this.label = "Genome";
    this.enableCohorts = false;
    this.enableSize = true;
>>>>>>> a947a94743ca0203655e535e63bac428d1227be3
    this.enableSupplemental = false;
  }

  displayType: DimensionEnum = DimensionEnum.THREE_D;
  domain: Array<number> = [-500, 500];
<<<<<<< HEAD
  alignment = '19';
  chromosomeOption = 'Cytobands';
  layoutOption = 'Circle';
  spacingOption = 'Optimized';
=======
  alignment = "19";
  chromosomeOption = "Cytobands";
  layoutOption = "Circle";
  spacingOption = "Optimized";
>>>>>>> a947a94743ca0203655e535e63bac428d1227be3
  showTads = false;
}

export interface GenomeDataModel extends GraphData {
  legends: Array<Legend>;
  genes: any;
  tads: Array<any>;
  bands: Array<
    Array<{
      arm: string;
      c: number;
      chr: string;
      e: number;
      l: number;
      s: number;
      subband: string;
      tag: string;
      z: number;
    }>
  >;
  chromo: Array<{ chr: string; P: number; C: number; Q: number }>;
  showBands: Boolean;
  allowRotation: Boolean;
}
