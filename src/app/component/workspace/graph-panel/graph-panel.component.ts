import { EdgeConfigModel } from './../../visualization/edges/edges.model';
import { HazardConfigModel } from './../../visualization/hazard/hazard.model';
import { ChartScene } from './../chart/chart.scene';
import { DataDecorator } from './../../../model/data-map.model';
import { DataService } from 'app/service/data.service';
import { DendogramConfigModel } from './../../visualization/dendogram/dendogram.model';
import { SurvivalConfigModel } from './../../visualization/survival/survival.model';
import { ModalService } from './../../../service/modal-service';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisConfigModel } from './../../visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.model';
// tslint:disable-next-line:max-line-length
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
import { DataTable, DataFieldFactory } from './../../../model/data-field.model';
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
import { EntityTypeEnum, GraphPanelEnum, PanelEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
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
import { WorkspaceConfigModel } from '../../../model/workspace.model';
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
  @Input() entityType: EntityTypeEnum;
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
  @Output() workspaceConfigChange: EventEmitter<{ config: WorkspaceConfigModel }> = new EventEmitter();
  @Output() edgeConfigChange: EventEmitter<{ config: EdgeConfigModel }> = new EventEmitter();

  methodName = '';
  methodSummary = '';
  workspaceLayoutOptions = [
    WorkspaceLayoutEnum.HORIZONTAL, WorkspaceLayoutEnum.VERTICAL, WorkspaceLayoutEnum.OVERLAY
  ];
  workspaceEdgeOptions: Array<DataField> = [];

  _decorators: Array<DataDecorator>;
  get decoratorsWithLegends(): Array<DataDecorator> {
    return this._decorators.filter(v => v.legend);
  }
  get decorators(): Array<DataDecorator> { return this._decorators; }
  @Input() set decorators(value: Array<DataDecorator>) {
    this._decorators = value;
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }

  _data: GraphData;
  get data(): GraphData { return this._data; }
  @Input() set data(value: GraphData) {
    this._data = value;
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

  _pathways: Array<any>;
  public get pathways(): Array<any> { return this._pathways; }
  @Input() public set pathways(value: Array<any>) {
    this._pathways = value;
    requestAnimationFrame(() => {
      this.cd.markForCheck();
    });
  }

  private _config: GraphConfig = null;
  get config(): GraphConfig { return this._config; }
  @Input() set config(value: GraphConfig) {
    let updateEdges = false;
    let updateHelp = false;
    if (value === null) { return; }
    if (this._config === null) {
      updateHelp = true;
    } else if (this._config.visualization !== value.visualization) {
      updateHelp = true;
    }
    if (value.graph === GraphEnum.GRAPH_B) {
      if (this._config === null) {
        updateEdges = true;
      } else if (this._config.entity !== value.entity) {
        updateEdges = true;
      }
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
  }


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

  onCohortChange($event: Event) {
    const selected = this.cohorts.find(v => v.n === $event.target['value']);
    this.config.patientFilter = selected.pids;
    this.config.sampleFilter = selected.sids;
    this.config.dirtyFlag = DirtyEnum.LAYOUT;
    this.configChange.emit(this.config);
  }
  onGenesetChange($event: Event) {
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
      case VisualizationEnum.SPREADSHEET:
        this.showPanel.emit(PanelEnum.SPREADSHEET);
        return;
      case VisualizationEnum.DASHBOARD:
        this.showPanel.emit(2048);
        return;
      case VisualizationEnum.DECOMPOSITION:
        this.setVisualization(VisualizationEnum.INCREMENTAL_PCA);
        return;
      case VisualizationEnum.MANIFOLDLEARNING:
        this.setVisualization(VisualizationEnum.TSNE);
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
      case VisualizationEnum.HAZARD:
        gc = new HazardConfigModel();
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
  }
}
