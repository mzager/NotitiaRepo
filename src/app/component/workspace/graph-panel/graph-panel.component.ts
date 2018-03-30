import { ChartScene } from './../chart/chart.scene';
import { DataDecorator } from './../../../model/data-map.model';
import { DataService } from 'app/service/data.service';
import { DendogramConfigModel } from './../../visualization/dendogram/dendogram.model';
import { SurvivalConfigModel } from './../../visualization/survival/survival.model';
import { ModalService } from './../../../service/modal-service';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisConfigModel } from './../../visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.model';
import { LinearDiscriminantAnalysisConfigModel } from 'app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.model';
// tslint:disable-next-line:max-line-length
import { MiniBatchDictionaryLearningConfigModel } from './../../visualization/minibatchdictionarylearning/minibatchdictionarylearning.model';
import { MiniBatchSparsePcaConfigModel } from './../../visualization/minibatchsparsepca/minibatchsparsepca.model';
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
import { PlsConfigModel } from './../../visualization/pls/pls.model';
import { PcaConfigModel } from './../../visualization/pca/pca.model';
import { ChromosomeConfigModel } from './../../visualization/chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum, GraphPanelEnum, PanelEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
  Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef
} from '@angular/core';
import { VisualizationEnum, GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import { GraphData } from 'app/model/graph-data.model';
import { Subscription } from 'rxjs/Subscription';
import { Cohort } from '../../../model/cohort.model';
import { HistogramConfigModel } from '../../visualization/histogram/histogram.model';
declare var $: any;

@Component({
  selector: 'app-workspace-graph-panel',
  templateUrl: './graph-panel.component.html',
  styleUrls: ['./graph-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphPanelComponent implements AfterViewInit, OnDestroy {


  @ViewChild('panel') panel: ElementRef;
  @ViewChild('panelButton') panelButton: ElementRef;

  @Input() title: string;
  @Input() cid: string;
  @Input() tables: Array<DataTable>;
  @Input() fields: Array<DataField>;
  @Input() events: Array<{ type: string, subtype: string }>;

  @Input() molecularData: Array<string>;
  @Input() clinicalFields: Array<DataField>;
  @Input() entityType: EntityTypeEnum;
  @Input() data: GraphData;
  @Output() hide: EventEmitter<any> = new EventEmitter();
  @Output() help: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() showPanel: EventEmitter<PanelEnum> = new EventEmitter();
  @Output() configChange: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() selectClusteringAlgorithm: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() selectGeneSignature: EventEmitter<GraphConfig> = new EventEmitter();
  @Output() selectGeneset: EventEmitter<any> = new EventEmitter();
  @Output() selectCohort: EventEmitter<any> = new EventEmitter();
  @Output() decoratorAdd: EventEmitter<{ config: GraphConfig, decorator: DataDecorator }> = new EventEmitter();
  @Output() decoratorDel: EventEmitter<{ config: GraphConfig, decorator: DataDecorator }> = new EventEmitter();


  methodName = '';
  methodSummary = '';

  _decorators: Array<DataDecorator>;
  get decorators(): Array<DataDecorator> {
    return this._decorators;
  }
  @Input() set decorators(value: Array<DataDecorator>) {
    this._decorators = value;
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }


  public _genesets: Array<any>;
  public get genesets(): Array<any> { return this._genesets; }
  @Input() public set genesets(value: Array<any>) {
    this._genesets = value;
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }

  _cohorts: Array<any>;
  public get cohorts(): Array<any> { return this._cohorts; }
  @Input() public set cohorts(value: Array<any>) {
    this._cohorts = value;
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }

  private _config: GraphConfig = null;
  get config(): GraphConfig { return this._config; }
  @Input() set config(value: GraphConfig) {


    let updateHelp = false;
    if (value === null) { return; }
    if (this._config === null) {
      updateHelp = true;
    } else if (this._config.visualization !== value.visualization) {
      updateHelp = true;
    }

    this._config = value;
    if (updateHelp) {
      this.dataService.getHelpInfo(value).then(v => {
        this.methodName = v.method;
        this.methodSummary = v.summary;
        requestAnimationFrame(() => {
          this.cd.markForCheck();
        });
      });
    }

    const topTierVisualization = this.visualizationOptions.find(v => v.value === value.visualization);
    if (topTierVisualization) {
      this.methodOption = null;
      this.methodOptions = [];
      this.visualizationOption = value.visualization;
    } else {
      const secondTierVisualization = this.visualizationOptions
        .filter(v => v.methodOptions)
        .filter(v => v.methodOptions
          .find(w => w.value === value.visualization))[0];
      this.visualizationOption = secondTierVisualization.value;
      this.methodOptions = secondTierVisualization.methodOptions;
      this.methodOption = value.visualization;
    }
  }

  visualizationOptions: Array<any>;
  visualizationOption: any;
  methodOptions: Array<any>;
  methodOption: any;

  // moved to global
  // toggleBackgroundClick(): void {
  //   const isBlack = ChartScene.instance.renderer.getClearColor().r === 0;
  //   ChartScene.instance.renderer.setClearColor(isBlack ? 0xFFFFFF : 0x000000, 1);
  //   ChartScene.instance.render();
  // }
  toggleClick(): void {

    if (this.panel.nativeElement.classList.contains('graphPanelCollapsed')) {
      this.panel.nativeElement.classList.remove('graphPanelCollapsed');
      this.panelButton.nativeElement.classList.remove('graphPanelCollapsedButton');
    } else {
      this.panel.nativeElement.classList.add('graphPanelCollapsed');
      this.panelButton.nativeElement.classList.add('graphPanelCollapsedButton');
    }
  }
  helpClick(): void {
    this.help.emit(this.config);
  }
  public onCustomizeClick($event: Event) {
    // this.showPanel
    console.log('click');
    $event.preventDefault();

  }
  onCohortChange($event: Event) {

    // if ($event.target['value'] === 'customize') {
    //   this.showPanel.emit(PanelEnum.COHORT);
    //   $event.preventDefault();
    //   return;
    // }

    const selected = this.cohorts.find(v => v.n === $event.target['value']);
    this.config.patientFilter = selected.pids;
    this.config.sampleFilter = selected.sids;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  onGenesetChange($event: Event) {
    // if ($event.target['value'] === 'customize') {
    //   this.showPanel.emit(PanelEnum.GENESET);
    //   $event.stopPropagation();
    //   $event.stopImmediatePropagation();
    //   $event.preventDefault();
    //   return;
    // }

    const selected = this.genesets.find(v => v.n === $event.target['value']);
    this.config.markerFilter = selected.g;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }

  onVisualizationChange($event: Event) {
    if ($event instanceof CustomEvent) {
      const el = $event.target as HTMLSelectElement;
      const visualizationEnumValue = parseInt(el.value, 10);
      this.setVisualization(visualizationEnumValue);
    }
  }

  onDecoratorAdd(decorator: DataDecorator) {
    this.decoratorAdd.emit({ config: this.config, decorator: decorator });
  }

  onDecoratorDel(decorator: DataDecorator) {
    this.decoratorDel.emit({ config: this.config, decorator: decorator });
  }
  setVisualization(visualizationEnumValue): void {
    let gc: GraphConfig;
    switch (visualizationEnumValue) {
      case VisualizationEnum.DECOMPOSITION:
      case VisualizationEnum.MANIFOLDLEARNING:
        this.setVisualization(this.visualizationOptions.find(v => v.value === visualizationEnumValue).methodOptions[0].value);
        return;
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
      case VisualizationEnum.SURVIVAL:
        gc = new SurvivalConfigModel();
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
      case VisualizationEnum.DENDOGRAM:
        gc = new DendogramConfigModel();
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
      case VisualizationEnum.MINI_BATCH_SPARSE_PCA:
        gc = new MiniBatchSparsePcaConfigModel();
        break;
      case VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING:
        gc = new MiniBatchDictionaryLearningConfigModel();
        break;
      case VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS:
        gc = new LinearDiscriminantAnalysisConfigModel();
        break;
      case VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS:
        gc = new QuadradicDiscriminantAnalysisConfigModel();
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
      case VisualizationEnum.HISTOGRAM:
        gc = new HistogramConfigModel();
        break;
      default:
        this.methodOptions = [];
        break;
    }

    const prevConfig = this.config;
    gc.table = prevConfig.table;
    gc.sampleFilter = prevConfig.sampleFilter;
    gc.markerFilter = prevConfig.markerFilter;
    gc.patientFilter = prevConfig.patientFilter;
    gc.sampleSelect = prevConfig.sampleSelect;
    gc.markerSelect = prevConfig.markerSelect;
    gc.patientSelect = prevConfig.patientSelect;
    gc.graph = (this.title === 'Graph A') ? GraphEnum.GRAPH_A : GraphEnum.GRAPH_B;
    this.configChange.emit(gc);
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

  ngAfterViewInit(): void { }

  ngOnDestroy(): void { }

  constructor(private ms: ModalService, private cd: ChangeDetectorRef, private dataService: DataService) {


    this.genesets = [];
    this.cohorts = [];

    this.cid = Math.random().toString(36).replace(/[^a-z]+/g, '');
    this.methodOptions = [];
    this.visualizationOptions = [
      { value: VisualizationEnum.BOX_WHISKERS, label: 'Box + Whisker' },
      { value: VisualizationEnum.CHROMOSOME, label: 'Chromosome' },
      { value: VisualizationEnum.HIC, label: 'Force Directed Graph' },
      { value: VisualizationEnum.GENOME, label: 'Genome' },
      { value: VisualizationEnum.DENDOGRAM, label: 'Dendogram' },
      { value: VisualizationEnum.HEATMAP, label: 'Heatmap' },
      { value: VisualizationEnum.HISTOGRAM, label: 'Histogram' },
      { value: VisualizationEnum.PATHWAYS, label: 'Pathways' },
      { value: VisualizationEnum.SURVIVAL, label: 'Survival + Hazard' },
      { value: VisualizationEnum.TIMELINES, label: 'Timelines' },
      { value: VisualizationEnum.SPREADSHEET, label: 'Spreadsheet' },
      {
        value: VisualizationEnum.DECOMPOSITION, label: 'Matrix Decomposition', methodOptions: [
          { value: VisualizationEnum.DICTIONARY_LEARNING, label: 'Dictionary Learning' },
          { value: VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING, label: 'Dictionary Learning - Mini Batch ' },
          { value: VisualizationEnum.FA, label: 'Factor Analysis' },
          { value: VisualizationEnum.FAST_ICA, label: 'Fast ICA' },
          { value: VisualizationEnum.LDA, label: 'Latent Dirichlet Allocation' },
          { value: VisualizationEnum.NMF, label: 'Non-Negative Matrix Factorization' },
          { value: VisualizationEnum.PCA, label: 'PCA' },
          { value: VisualizationEnum.INCREMENTAL_PCA, label: 'PCA - Incremental' },
          { value: VisualizationEnum.KERNAL_PCA, label: 'PCA - Kernel' },
          { value: VisualizationEnum.SPARSE_PCA, label: 'PCA - Sparse' },
          { value: VisualizationEnum.MINI_BATCH_SPARSE_PCA, label: 'PCA - Sparse - Mini Batch' },
          { value: VisualizationEnum.SPARSE_CODER, label: 'Sparse Coder' },
          { value: VisualizationEnum.TRUNCATED_SVD, label: 'Truncated SVD' }
        ]
      },
      {
        value: VisualizationEnum.MANIFOLDLEARNING, label: 'Manifold Learning', methodOptions: [
          { value: VisualizationEnum.ISOMAP, label: 'Isomap' },
          { value: VisualizationEnum.LOCALLY_LINEAR_EMBEDDING, label: 'Locally Linear Embedding' },
          { value: VisualizationEnum.MDS, label: 'MDS' },
          { value: VisualizationEnum.SPECTRAL_EMBEDDING, label: 'Spectral Embedding' },
          { value: VisualizationEnum.TSNE, label: 'T-SNE' }
        ]
      },
      // { value: VisualizationEnum.DECOMPOSITION, label: 'Cross Decomposition', methodOptions: [
      //    {
      //         value: VisualizationEnum.SUPPORT_VECTOR_MACHINES, label: 'Support Vector Machines', methodOptions: [
      // svm.LinearSVC([penalty, loss, dual, tol, C, …])	Linear Support Vector Classification.
      // svm.LinearSVR([epsilon, tol, C, loss, …])	Linear Support Vector Regression.
      // svm.NuSVC([nu, kernel, degree, gamma, …])	Nu-Support Vector Classification.
      // svm.NuSVR([nu, C, kernel, degree, gamma, …])	Nu Support Vector Regression.
      // svm.OneClassSVM([kernel, degree, gamma, …])	Unsupervised Outlier Detection.
      // svm.SVC([C, kernel, degree, gamma, coef0, …])	C-Support Vector Classification.
      // svm.SVR([kernel, degree, gamma, coef0, tol, …])	Epsilon-Support Vector Regression.
      //         ]
      //       }
      // Decomposition


      // Manifold learning

      // Discriminant Analysis
      // { value: VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS, label: 'Linear Discriminat Analysis' },
      // { value: VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS, label: 'Quadratic Discriminant Analysis' },
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
    ];
  }
}
