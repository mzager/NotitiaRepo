import { PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { HicConfigModel } from './../../visualization/hic/hic.model';
import { ParallelCoordsConfigModel } from './../../visualization/parallelcoords/parallelcoords.model';
import { BoxWhiskersConfigModel } from './../../visualization/boxwhiskers/boxwhiskers.model';
import { GenomeConfigModel } from './../../visualization/genome/genome.model';
import { LinkedGeneConfigModel } from './../../visualization/linkedgenes/linkedgenes.model';
import { PlsAction } from './../../../action/compute.action';
import { DataTable } from './../../../model/data-field.model';
import { PcaSparseConfigModel } from './../../visualization/pcasparse/pcasparse.model';
import { PcaKernalConfigModel } from './../../visualization/pcakernal/pcakernal.model';
import { PcaIncrementalConfigModel } from './../../visualization/pcaincremental/pcaincremental.model';
import { SpectralEmbeddingConfigModel } from './../../visualization/spectralembedding/spectralembedding.model';
import { LocalLinearEmbeddingConfigModel } from './../../visualization/locallinearembedding/locallinearembedding.model';
import { IsoMapConfigModel } from './../../visualization/isomap/isomap.model';
import { TruncatedSvdConfigModel } from './../../visualization/truncatedsvd/truncatedsvd.model';
import { DictionaryLearningConfigModel } from './../../visualization/dictionarylearning/dictionarylearning.model';
import { FastIcaConfigModel } from './../../visualization/fastica/fastica.model';
import { NmfConfigModel } from './../../visualization/nmf/nmf.model';
import { LdaConfigModel } from './../../visualization/lda/lda.model';
import { FaConfigModel } from './../../visualization/fa/fa.model';
import { MdsConfigModel } from './../../visualization/mds/mds.model';
import { DeConfigModel } from './../../visualization/de/de.model';
import { DaConfigModel } from './../../visualization/da/da.model';
import { SomConfigModel } from './../../visualization/som/som.model';
import { HeatmapConfigModel } from './../../visualization/heatmap/heatmap.model';
import { TsneConfigModel } from './../../visualization/tsne/tsne.model';
import { TSNE } from 'tsne-js';
import { PlsConfigModel } from './../../visualization/pls/pls.model';
import { PcaConfigModel } from './../../visualization/pca/pca.model';
import { ChromosomeConfigModel } from './../../visualization/chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import { Component, Input, Output, ChangeDetectionStrategy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LegendPanelEnum, VisualizationEnum, GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import { GraphData } from 'app/model/graph-data.model';
import { DataService } from 'app/service/data.service';
declare var $: any;

@Component({
  selector: 'app-workspace-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPanelComponent implements AfterViewInit  {

  @ViewChild('tabs') tabs: ElementRef;

  // Mini Batch Dictionary Learning
  // Mini Batch Sparse PCA
  // Sparse Coder
  // Dict Learning Online
  // Sparse Encode

  @Input() set config(config: GraphConfig){
    const v = config.visualization;
    const method = (v === VisualizationEnum.TSNE) ? 'TSNE' :
      (v === VisualizationEnum.PCA) ? 'PCA' :
      (v === VisualizationEnum.INCREMENTAL_PCA) ? 'Incremental PCA' :
      (v === VisualizationEnum.SPARSE_PCA) ? 'Sparse PCA' :
      (v === VisualizationEnum.DICTIONARY_LEARNING) ? 'Dictionary Learning' :
      (v === VisualizationEnum.FA) ? 'Factor Analysis' :
      (v === VisualizationEnum.FAST_ICA) ? 'Fast ICA' :
      (v === VisualizationEnum.KERNAL_PCA) ? 'Kernal PCA' :
      (v === VisualizationEnum.LDA) ? 'Latent Dirichlet Allocation' :
      (v === VisualizationEnum.NMF) ? 'NMF' :
      (v === VisualizationEnum.TRUNCATED_SVD) ? 'Truncated SVD' :
      (v === VisualizationEnum.ISOMAP) ? 'Isomap' :
      (v === VisualizationEnum.LOCALLY_LINEAR_EMBEDDING) ? 'Locally Linear Embedding' :
      (v === VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING) ? '' :
      (v === VisualizationEnum.MINI_BATCH_SPARSE_PCA) ? '' :
      (v === VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS) ? '' :
      (v === VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS) ? '' :
      (v === VisualizationEnum.MDS) ? '' :
      (v === VisualizationEnum.SPECTRAL_EMBEDDING) ? '' :
      //(v === VisualizationEnum.TSNE) ? '' :
      '';

    this.dataService.getHelpInfo(method).then( result => {
      this.method = result.method;
      this.desc = result.desc;
      this.url = result.url;
      this.attrs = result.attrs;
      this.params = result.params;
    });
  }

  method = '';
  desc = '';
  url = '';
  attrs: Array<{name: string, type: string, desc: string}> = [];
  params: Array<{name: string, type: string, desc: string}> = [];

  @Output() hide: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit(): void {
    $( this.tabs.nativeElement ).tabs();
  }

  constructor(private dataService: DataService) {
  }

}
