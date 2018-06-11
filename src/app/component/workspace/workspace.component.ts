import { ChartSelection } from './../../model/chart-selection.model';

import { Store } from '@ngrx/store';
import { HazardConfigModel } from './../visualization/hazard/hazard.model';
import { Pathway } from './../../model/pathway.model';
import { HistogramConfigModel } from './../visualization/histogram/histogram.model';
import { DataDecorator } from './../../model/data-map.model';
import { Cohort } from './../../model/cohort.model';
import { GeneSet } from './../../model/gene-set.model';
import { HelpSetConfigAction } from './../../action/help.action';
import { SurvivalConfigModel } from './../visualization/survival/survival.model';
import { DendogramConfigModel } from './../visualization/dendogram/dendogram.model';
import { MiniBatchSparsePcaConfigModel } from 'app/component/visualization/minibatchsparsepca/minibatchsparsepca.model';
// tslint:disable-next-line:max-line-length
import { MiniBatchDictionaryLearningConfigModel } from 'app/component/visualization/minibatchdictionarylearning/minibatchdictionarylearning.model';
import { PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import { HicConfigModel } from './../visualization/hic/hic.model';
import { BoxWhiskersConfigModel } from './../visualization/boxwhiskers/boxwhiskers.model';
import { ParallelCoordsConfigModel } from './../visualization/parallelcoords/parallelcoords.model';
import { GenomeConfigModel } from './../visualization/genome/genome.model';
import { LinkedGeneConfigModel } from './../visualization/linkedgenes/linkedgenes.model';
import * as compute from 'app/action/compute.action';
import * as data from 'app/action/data.action';
import * as enums from 'app/model/enum.model';
import * as fromRoot from 'app/reducer/index.reducer';
import * as graph from 'app/action/graph.action';
import * as layout from 'app/action/layout.action';
import * as select from 'app/action/select.action';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  ChromosomeAction,
  GenomeAction,
  GraphColorAction,
  GraphSizeAction,
  PcaAction,
  SelectMarkersAction,
  TsneAction,
} from './../../action/compute.action';
import { ChromosomeConfigModel } from './../visualization/chromosome/chromosome.model';
import { GraphPanelToggleAction, ModalPanelAction, LoaderHideAction, LoaderShowAction } from './../../action/layout.action';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';
import {
  DataLoadedAction,
  DataLoadFromDexieAction,
  DataLoadFromFileAction,
  DataLoadIlluminaVcfAction,
  DataUpdateGenesetsAction,
  DataUpdateCohortsAction,
  DataUpdatePathwayAction,
  DataAddPathwayAction,
  DataDelPathwayAction,
  DataAddGenesetAction,
  DataDelGenesetAction,
  DataAddCohortAction,
  DataDelCohortAction
} from './../../action/data.action';
import { DataTable } from './../../model/data-field.model';
import { DictionaryLearningConfigModel } from './../visualization/dictionarylearning/dictionarylearning.model';
import { EdgeConfigModel } from './../visualization/edges/edges.model';
import { EntityTypeEnum, GraphEnum } from './../../model/enum.model';
import { FaConfigModel } from './../visualization/fa/fa.model';
import { FastIcaConfigModel } from './../visualization/fastica/fastica.model';
import {
  getFields,
  getGraphAConfig
} from './../../reducer/index.reducer';
import { GraphConfig } from './../../model/graph-config.model';
import { GraphTool } from 'app/model/graph-tool.model';
import { HeatmapConfigModel } from './../visualization/heatmap/heatmap.model';
import { IsoMapConfigModel } from './../visualization/isomap/isomap.model';
import { LdaConfigModel } from './../visualization/lda/lda.model';
import { Legend } from 'app/model/legend.model';
import { LocalLinearEmbeddingConfigModel } from './../visualization/locallinearembedding/locallinearembedding.model';
import { MdsConfigModel } from './../visualization/mds/mds.model';
import { NmfConfigModel } from './../visualization/nmf/nmf.model';
import { Observable } from 'rxjs/Observable';
import { PcaConfigModel } from './../visualization/pca/pca.model';
import { PcaIncrementalConfigModel } from './../visualization/pcaincremental/pcaincremental.model';
import { PcaKernalConfigModel } from './../visualization/pcakernal/pcakernal.model';
import { PcaSparseConfigModel } from './../visualization/pcasparse/pcasparse.model';
import { SomConfigModel } from './../visualization/som/som.model';
import { SpectralEmbeddingConfigModel } from './../visualization/spectralembedding/spectralembedding.model';
import { TruncatedSvdConfigModel } from './../visualization/truncatedsvd/truncatedsvd.model';
import { TsneConfigModel } from './../visualization/tsne/tsne.model';
import {
  VisibilityToggleAction, VisualizationSetAction, WorkspaceConfigAction,
  DataDecoratorCreateAction, DataDecoratorDelAction, DataDecoratorDelAllAction
} from './../../action/graph.action';
import { WorkspaceConfigModel } from './../../model/workspace.model';
// tslint:disable-next-line:max-line-length
import { LinearDiscriminantAnalysisConfigModel } from 'app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.model';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisConfigModel } from 'app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {

  // Components
  @ViewChild('panelContainer') public panelContainer: ElementRef;

  overrideShowPanel = true;

  pathways: Observable<Array<any>>;
  genesets: Observable<Array<any>>;
  cohorts: Observable<Array<any>>;
  loader: Observable<boolean>;
  graphALegend: Observable<Array<Legend>>;
  graphBLegend: Observable<Array<Legend>>;
  graphAConfig: Observable<GraphConfig>;
  graphBConfig: Observable<GraphConfig>;
  helpPanelConfig: Observable<GraphConfig>;
  workspaceConfig: Observable<WorkspaceConfigModel>;
  graphAData: Observable<any>;
  graphBData: Observable<any>;
  graphADecorators: Observable<Array<DataDecorator>>;
  graphBDecorators: Observable<Array<DataDecorator>>;
  edgeDecorators: Observable<Array<DataDecorator>>;

  selectVisible: Observable<boolean>;
  selectSelection: Observable<ChartSelection>;
  selectStats: Observable<Array<any>>;

  edgeConfig: Observable<EdgeConfigModel>;
  edgeLegend: Observable<Array<Legend>>;
  $configChangeA: Subscription;
  $configChangeB: Subscription;
  $configChangeE: Subscription;

  graphPanelATab: Observable<enums.GraphPanelEnum>;
  graphPanelBTab: Observable<enums.GraphPanelEnum>;
  genesetPanelTab: Observable<enums.SinglePanelEnum>;
  modalPanel: Observable<enums.PanelEnum>;
  modalPanelNumber: number;

  selectedTool: Observable<enums.ToolEnum>;
  selectedGraph: Observable<enums.GraphEnum>;
  fields: Observable<Array<DataField>>;
  tables: Observable<Array<DataTable>>;
  events: Observable<Array<{ type: string, subtype: string }>>;
  queryData: Observable<any>;
  _selectedGraph: enums.GraphEnum; // This is super wrong

  constructor(private store: Store<fromRoot.State>) {

    this.pathways = store.select(fromRoot.getPathways);
    this.genesets = store.select(fromRoot.getGenesets);
    this.cohorts = store.select(fromRoot.getCohorts);
    this.graphPanelATab = store.select(fromRoot.getLayoutGraphPanelAState);
    this.graphPanelBTab = store.select(fromRoot.getLayoutGraphPanelBState);
    this.modalPanel = store.select(fromRoot.getLayoutModalPanelState);
    this.loader = store.select(fromRoot.getLayoutLoaderState);
    this.helpPanelConfig = store.select(fromRoot.getHelpConfigState);

    this.edgeConfig = store.select(fromRoot.getEdgesConfig);
    this.graphAConfig = store.select(fromRoot.getGraphAConfig);
    this.graphBConfig = store.select(fromRoot.getGraphBConfig);
    this.workspaceConfig = store.select(fromRoot.getWorkspaceConfig);

    this.graphAData = store.select(fromRoot.getGraphAData);
    this.graphBData = store.select(fromRoot.getGraphBData);

    this.graphADecorators = store.select(fromRoot.getGraphADecorators);
    this.graphBDecorators = store.select(fromRoot.getGraphBDecorators);
    this.edgeDecorators = store.select(fromRoot.getEdgeDecorators);

    this.selectVisible = store.select(fromRoot.getSelectVisible);
    this.selectSelection = store.select(fromRoot.getSelectSelection);
    this.selectStats = store.select(fromRoot.getSelectStats);

    this.tables = store.select(fromRoot.getTables);
    this.fields = store.select(fromRoot.getFields);
    this.events = store.select(fromRoot.getEvents);
  }

  select(selection: ChartSelection): void {
    switch (selection.type) {
      case EntityTypeEnum.SAMPLE:
        this.store.dispatch(new compute.SelectSamplesAction({ samples: selection.ids }));
        break;
      case EntityTypeEnum.GENE:
        this.store.dispatch(new compute.SelectMarkersAction({ markers: selection.ids }));
        break;
    }
  }
  // uploadExcel(): void {
  //   alert('upload a file');
  // }
  // fileOpen(value: DataTransfer) {
  //   this.store.dispatch(new data.DataLoadFromFileAction(value));
  // }

  edgeConfigChange(value: EdgeConfigModel): void {
    this.store.dispatch(new compute.EdgesAction({ config: value }));
  }

  graphPanelSetConfig(value: GraphConfig) {
    this.store.dispatch(new LoaderShowAction());
    switch (value.visualization) {
      case enums.VisualizationEnum.NONE:
        this.store.dispatch(new compute.NoneAction({ config: value as GraphConfig }));
        break;
      case enums.VisualizationEnum.EDGES:
        this.store.dispatch(new compute.EdgesAction({ config: value as EdgeConfigModel }));
        break;
      case enums.VisualizationEnum.PCA:
        this.store.dispatch(new compute.PcaAction({ config: value as PcaConfigModel }));
        break;
      case enums.VisualizationEnum.PATHWAYS:
        this.store.dispatch(new compute.PathwaysAction({ config: value as PathwaysConfigModel }));
        break;
      case enums.VisualizationEnum.CHROMOSOME:
        this.store.dispatch(new compute.ChromosomeAction({ config: value as ChromosomeConfigModel }));
        break;
      case enums.VisualizationEnum.GENOME:
        this.store.dispatch(new compute.GenomeAction({ config: value as GenomeConfigModel }));
        break;
      case enums.VisualizationEnum.TSNE:
        this.store.dispatch(new compute.TsneAction({ config: value as TsneConfigModel }));
        break;
      case enums.VisualizationEnum.TIMELINES:
        this.store.dispatch(new compute.TimelinesAction({ config: value as TimelinesConfigModel }));
        break;
      case enums.VisualizationEnum.HEATMAP:
        this.store.dispatch(new compute.HeatmapAction({ config: value as HeatmapConfigModel }));
        break;
      case enums.VisualizationEnum.DENDOGRAM:
        this.store.dispatch(new compute.DendogramAction({ config: value as DendogramConfigModel }));
        break;
      case enums.VisualizationEnum.PARALLEL_COORDS:
        this.store.dispatch(new compute.ParallelCoordsAction({ config: value as ParallelCoordsConfigModel }));
        break;
      case enums.VisualizationEnum.BOX_WHISKERS:
        this.store.dispatch(new compute.BoxWhiskersAction({ config: value as BoxWhiskersConfigModel }));
        break;
      case enums.VisualizationEnum.LINKED_GENE:
        this.store.dispatch(new compute.LinkedGeneAction({ config: value as LinkedGeneConfigModel }));
        break;
      case enums.VisualizationEnum.HIC:
        this.store.dispatch(new compute.HicAction({ config: value as HicConfigModel }));
        break;
      case enums.VisualizationEnum.SOM:
        this.store.dispatch(new compute.SomAction({ config: value as SomConfigModel }));
        break;
      case enums.VisualizationEnum.MDS:
        this.store.dispatch(new compute.MdsAction({ config: value as MdsConfigModel }));
        break;
      case enums.VisualizationEnum.FA:
        this.store.dispatch(new compute.FaAction({ config: value as FaConfigModel }));
        break;
      case enums.VisualizationEnum.LDA:
        this.store.dispatch(new compute.LdaAction({ config: value as LdaConfigModel }));
        break;
      case enums.VisualizationEnum.FAST_ICA:
        this.store.dispatch(new compute.FastIcaAction({ config: value as FastIcaConfigModel }));
        break;
      case enums.VisualizationEnum.DICTIONARY_LEARNING:
        this.store.dispatch(new compute.DictionaryLearningAction({ config: value as DictionaryLearningConfigModel }));
        break;
      case enums.VisualizationEnum.NMF:
        this.store.dispatch(new compute.NmfAction({ config: value as NmfConfigModel }));
        break;
      case enums.VisualizationEnum.TRUNCATED_SVD:
        this.store.dispatch(new compute.TruncatedSvdAction({ config: value as TruncatedSvdConfigModel }));
        break;
      case enums.VisualizationEnum.ISOMAP:
        this.store.dispatch(new compute.IsoMapAction({ config: value as IsoMapConfigModel }));
        break;
      case enums.VisualizationEnum.LOCALLY_LINEAR_EMBEDDING:
        this.store.dispatch(new compute.LocalLinearEmbeddingAction({ config: value as LocalLinearEmbeddingConfigModel }));
        break;
      case enums.VisualizationEnum.SPECTRAL_EMBEDDING:
        this.store.dispatch(new compute.SpectralEmbeddingAction({ config: value as SpectralEmbeddingConfigModel }));
        break;
      case enums.VisualizationEnum.INCREMENTAL_PCA:
        this.store.dispatch(new compute.PcaIncrementalAction({ config: value as PcaIncrementalConfigModel }));
        break;
      case enums.VisualizationEnum.KERNAL_PCA:
        this.store.dispatch(new compute.PcaKernalAction({ config: value as PcaKernalConfigModel }));
        break;
      case enums.VisualizationEnum.SPARSE_PCA:
        this.store.dispatch(new compute.PcaSparseAction({ config: value as PcaSparseConfigModel }));
        break;
      case enums.VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING:
        this.store.dispatch(new compute.MiniBatchDictionaryLearningAction({ config: value as MiniBatchDictionaryLearningConfigModel }));
        break;
      case enums.VisualizationEnum.MINI_BATCH_SPARSE_PCA:
        this.store.dispatch(new compute.MiniBatchSparsePcaAction({ config: value as MiniBatchSparsePcaConfigModel }));
        break;
      case enums.VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS:
        this.store.dispatch(new compute.LinearDiscriminantAnalysisAction({ config: value as LinearDiscriminantAnalysisConfigModel }));
        break;
      case enums.VisualizationEnum.SURVIVAL:
        this.store.dispatch(new compute.SurvivalAction({ config: value as SurvivalConfigModel }));
        break;
      case enums.VisualizationEnum.HAZARD:
        this.store.dispatch(new compute.HazardAction({ config: value as HazardConfigModel }));
        break;
      case enums.VisualizationEnum.HISTOGRAM:
        this.store.dispatch(new compute.HistogramAction({ config: value as HistogramConfigModel }));
        break;
      case enums.VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS:
        this.store.dispatch(new compute.QuadraticDiscriminantAnalysisAction(
          { config: value as QuadradicDiscriminantAnalysisConfigModel }));
        break;
    }
  }

  edgeAddDecorator(e: { config: EdgeConfigModel, decorator: DataDecorator }): void {
    this.store.dispatch(new DataDecoratorCreateAction({ config: e.config, decorator: e.decorator }));
  }
  edgeDelDecorator(e: { config: EdgeConfigModel, decorator: DataDecorator }): void {
    this.store.dispatch(new DataDecoratorDelAction({ config: e.config, decorator: e.decorator }));
  }
  graphPanelAddDecorator(e: { config: GraphConfig, decorator: DataDecorator }): void {
    this.store.dispatch(new DataDecoratorCreateAction({ config: e.config, decorator: e.decorator }));
  }
  graphPanelDelDecorator(e: { config: GraphConfig, decorator: DataDecorator }): void {
    this.store.dispatch(new DataDecoratorDelAction({ config: e.config, decorator: e.decorator }));
  }
  graphPanelDelAllDecorators(e: { config: GraphConfig }): void {
    this.store.dispatch(new DataDecoratorDelAllAction({ config: e.config }));
  }
  addPathway(value: { database: string, pathway: Pathway }): void {
    this.store.dispatch(new DataAddPathwayAction(value));
  }
  delPathway(value: { database: string, pathway: Pathway }): void {
    this.store.dispatch(new DataDelPathwayAction(value));
  }
  addGeneset(value: { database: string, geneset: GeneSet }): void {
    this.store.dispatch(new DataAddGenesetAction(value));
  }
  delGeneset(value: { database: string, geneset: GeneSet }): void {
    this.store.dispatch(new DataDelGenesetAction(value));
  }
  addCohort(value: { database: string, cohort: Cohort }): void {
    this.store.dispatch(new DataAddCohortAction(value));
  }
  delCohort(value: { database: string, cohort: Cohort }): void {
    this.store.dispatch(new DataDelCohortAction(value));
  }
  helpPanelToggle(config: GraphConfig): void {
    this.store.dispatch(new HelpSetConfigAction(config));
    this.store.dispatch(new ModalPanelAction(enums.PanelEnum.HELP));
  }
  splitScreenChange(value: boolean): void {
    const model = new WorkspaceConfigModel();
    model.layout = (value) ? enums.WorkspaceLayoutEnum.HORIZONTAL : enums.WorkspaceLayoutEnum.SINGLE;
    this.store.dispatch(new WorkspaceConfigAction(model));
    this.store.dispatch(new GraphPanelToggleAction(enums.GraphPanelEnum.GRAPH_B));
  }
  setPanel(value: enums.PanelEnum): void {
    if (value === enums.PanelEnum.NONE && this.overrideShowPanel) {
      value = enums.PanelEnum.DATA;
    }
    this.store.dispatch(new ModalPanelAction(value));
  }

  workspacePanelSetConfig(value: WorkspaceConfigModel) {
    this.store.dispatch(new WorkspaceConfigAction(value));
  }
  fileLoadTcga(value: string) {
    this.overrideShowPanel = false;
    this.store.dispatch(new data.DataLoadFromTcga(value));
    this.store.dispatch(new ModalPanelAction(enums.PanelEnum.NONE));
    this.store.dispatch(new LoaderShowAction());
  }
}
