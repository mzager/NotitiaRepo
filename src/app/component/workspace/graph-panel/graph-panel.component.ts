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
declare var $: any;

@Component({
  selector: 'app-workspace-graph-panel',
  templateUrl: './graph-panel.component.html',
  styleUrls: ['./graph-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphPanelComponent implements AfterViewInit  {


  @ViewChild('tabs') tabs: ElementRef;

  @Input() tables: Array<DataTable>;
  @Input() fields: Array<DataField>;
  @Input() events: Array<{type: string, subtype: string}>;

  @Input() molecularData: Array<string>;
  @Input() clinicalFields: Array<DataField>;
  @Input() entityType: EntityTypeEnum;
  @Input() config: GraphConfig;
  @Input() data: GraphData;
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() selectClusteringAlgorithm: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() selectGeneSignature: EventEmitter<GraphConfig> = new EventEmitter();


  visualizationOptions: Array<{value: VisualizationEnum, label: string}>;

  // TODO: Fix Duplication
  onGraphAChange($event: Event) {
    if ($event instanceof CustomEvent) {
      const el = $event.target as HTMLSelectElement;
      let gc: GraphConfig;
      switch (parseInt(el.value, 10)) {
        case VisualizationEnum.TIMELINES:
          gc = new TimelinesConfigModel();
          break;
        case VisualizationEnum.PATHWAYS:
          gc = new PathwaysConfigModel();
          break;
        case VisualizationEnum.CHROMOSOME:
          gc = new ChromosomeConfigModel();
          break;
        case VisualizationEnum.GENOME:
          gc = new GenomeConfigModel();
          break;
        case VisualizationEnum.PCA:
          gc = new PcaConfigModel();
          break;
        case VisualizationEnum.PLS:
          gc = new PlsConfigModel();
          break;
        case VisualizationEnum.TSNE:
          gc = new TsneConfigModel();
          break;
        case VisualizationEnum.HEATMAP:
          gc = new HeatmapConfigModel();
          break;
        case VisualizationEnum.BOX_WHISKERS:
          gc = new BoxWhiskersConfigModel();
          break;
        case VisualizationEnum.PARALLEL_COORDS:
          gc = new ParallelCoordsConfigModel();
          break;
        case VisualizationEnum.LINKED_GENE:
          gc = new LinkedGeneConfigModel();
          break;
        case VisualizationEnum.HIC:
          gc = new HicConfigModel();
          break;
        case VisualizationEnum.SOM:
          gc = new SomConfigModel();
          break;
        case VisualizationEnum.DA:
          gc = new DaConfigModel();
          break;
        case VisualizationEnum.DE:
          gc = new DeConfigModel();
          break;
        case VisualizationEnum.FA:
          gc = new FaConfigModel();
          break;
        case VisualizationEnum.MDS:
          gc = new MdsConfigModel();
          break;
        case VisualizationEnum.LDA:
          gc = new LdaConfigModel();
          break;
        case VisualizationEnum.NMF:
          gc = new NmfConfigModel();
          break;
        case VisualizationEnum.FAST_ICA:
          gc = new FastIcaConfigModel();
          break;
        case VisualizationEnum.DICTIONARY_LEARNING:
          gc = new DictionaryLearningConfigModel();
          break;
        case VisualizationEnum.TRUNCATED_SVD:
          gc = new TruncatedSvdConfigModel();
          break;
        case VisualizationEnum.ISOMAP:
          gc = new IsoMapConfigModel();
          break;
        case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING:
          gc = new LocalLinearEmbeddingConfigModel();
          break;
        case VisualizationEnum.SPECTRAL_EMBEDDING:
          gc = new SpectralEmbeddingConfigModel();
          break;
        case VisualizationEnum.INCREMENTAL_PCA:
          gc = new PcaIncrementalConfigModel();
          break;
        case VisualizationEnum.KERNAL_PCA:
          gc = new PcaKernalConfigModel();
          break;
        case VisualizationEnum.SPARSE_PCA:
          gc = new PcaSparseConfigModel();
          break;
      }
      const prevConfig = this.config;
      gc.table = prevConfig.table;
      gc.sampleFilter = prevConfig.sampleFilter;
      gc.markerFilter = prevConfig.markerFilter;
      gc.sampleSelect = prevConfig.sampleSelect;
      gc.markerSelect = prevConfig.markerSelect;
      gc.pointColor = prevConfig.pointColor;
      gc.pointShape = prevConfig.pointShape;
      gc.pointSize = prevConfig.pointSize;
      gc.graph = GraphEnum.GRAPH_A;
      this.configChange.emit( gc );
    }
  }

  graphPanelSelectClusteringAlgorithm(value: GraphConfig) {
    this.selectClusteringAlgorithm.emit(value);
  }
  graphPanelSelecteGeneSignature(value: GraphConfig) {
    this.selectGeneSignature.emit(value);
  }
  graphPanelSetConfig(value: GraphConfig) {
    this.configChange.emit(value);
  }

  ngAfterViewInit(): void {
    $( this.tabs.nativeElement ).tabs();
  }

  constructor() {
    this.visualizationOptions = [
      //{ value: VisualizationEnum.NONE, label: 'None' },
      { value: VisualizationEnum.PATHWAYS, label: 'Pathways'},
      { value: VisualizationEnum.GENOME, label: 'Genome' },
      { value: VisualizationEnum.CHROMOSOME, label: 'Chromosome' },
      { value: VisualizationEnum.HIC, label: 'Force Directed Graph' },
      { value: VisualizationEnum.HEATMAP, label: 'Heatmap'},
      { value: VisualizationEnum.HISTOGRAM, label: 'Histogram'},
      { value: VisualizationEnum.BOX_WHISKERS, label: 'Box Whiskers'},
      { value: VisualizationEnum.TIMELINES, label: 'Timelines'},

      // Decomposition
      { value: VisualizationEnum.DICTIONARY_LEARNING, label: 'Dictionary Learning'},
      { value: VisualizationEnum.FA, label: 'Factor Analysis'},
      { value: VisualizationEnum.FAST_ICA, label: 'Fast ICA'},
      { value: VisualizationEnum.LDA, label: 'Latent Dirichlet Allocation'},
      { value: VisualizationEnum.NMF, label: 'Non-Negative Matrix Factorization'},

      { value: VisualizationEnum.PCA, label: 'PCA' },
      { value: VisualizationEnum.INCREMENTAL_PCA, label: 'PCA - Incremental'},
      { value: VisualizationEnum.KERNAL_PCA, label: 'PCA - Kernel'},
      { value: VisualizationEnum.SPARSE_PCA, label: 'PCA - Sparse'},
      { value: VisualizationEnum.TRUNCATED_SVD, label: 'Truncated SVD'},

      // Manifold learning
      { value: VisualizationEnum.ISOMAP, label: 'Isomap'},
      { value: VisualizationEnum.LOCALLY_LINEAR_EMBEDDING, label: 'Locally Linear Embedding'},
      { value: VisualizationEnum.MDS, label: 'Multi-Dimensional Scaling'},
      { value: VisualizationEnum.SPECTRAL_EMBEDDING, label: 'Spectral Embedding'},
      { value: VisualizationEnum.TSNE, label: 'T-SNE'},

// Discriminant Analysis
  // Linear Discriminat Analysis
  // Quadratic Discriminant Analysis

// Random Projection
  // Gaussian, Sparse

// Cross Decomposition
  // CCA, PLSCanonical, PLSRegression

// SVM
  // LinearSVC, LinearSVR, NuSVC, NuSVR, OneClassSvm, SVC, SVR

      // { value: VisualizationEnum.PLS, label: 'Partial Least Squares'},
      // { value: VisualizationEnum.SOM, label: 'SOM '},
      // { value: VisualizationEnum.DA, label: 'Discriminat Analysis '},
      // { value: VisualizationEnum.DE, label: 'Gene Set Enrichmant '},
      // { value: VisualizationEnum.DE, label: 'Differential Expression '},
      
      // { value: VisualizationEnum.PARALLEL_COORDS, label: 'Parallel Coordinates'},
      
      // { value: VisualizationEnum.SURVIVAL, label: 'Kaplan Meier Curve Beta'},
      // { value: VisualizationEnum.PATHWAYS, label: 'Pathways Beta'},
      
    ];
  }


}
