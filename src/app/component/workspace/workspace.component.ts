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
import * as XLSX from 'xlsx';
import { Action, Store } from '@ngrx/store';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ChromosomeAction,
  GenomeAction,
  GraphColorAction,
  GraphSizeAction,
  PcaAction,
  SelectMarkersAction,
  TsneAction
  } from './../../action/compute.action';
import { ChromosomeConfigModel } from './../visualization/chromosome/chromosome.model';
import {
  CohortPanelShowTabAction,
  DataPanelShowTabAction,
  WorkspacePanelShowTabAction,
  WorkspacePanelToggleAction
  } from './../../action/layout.action';
import { DataField } from 'app/model/data-field.model';
import {
  DataLoadedAction,
  DataLoadFromDexieAction,
  DataLoadFromFileAction,
  DataLoadIlluminaVcfAction
  } from './../../action/data.action';
import { DataTable } from './../../model/data-field.model';
import { DictionaryLearningConfigModel } from './../visualization/dictionarylearning/dictionarylearning.model';
import { EdgeConfigModel } from './../visualization/edges/edges.model';
import { EntityTypeEnum, GraphEnum } from './../../model/enum.model';
import { FaConfigModel } from './../visualization/fa/fa.model';
import { FastIcaConfigModel } from './../visualization/fastica/fastica.model';
import {
  getFields,
  getGraphAConfig,
  getLayoutCohortPanelState,
  getLayoutFilePanelState,
  getQueryData
  } from './../../reducer/index.reducer';
import { getHistoryPanelState, getToolPanelState, getWorkspacePanelState } from './../../reducer/layout.reducer';
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
import { VisibilityToggleAction, VisualizationSetAction, WorkspaceConfigAction } from './../../action/graph.action';
import { WorkspaceConfigModel } from './../../model/workspace.model';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {

  // graphTool: Observable<GraphTool>;
  graphALegend: Observable<Array<Legend>>;
  graphBLegend: Observable<Array<Legend>>;
  graphAConfig: Observable<GraphConfig>;
  graphBConfig: Observable<GraphConfig>;
  workspaceConfig: Observable<WorkspaceConfigModel>;
  graphAData: Observable<any>;
  graphBData: Observable<any>;
  edgeConfig: Observable<GraphConfig>;
  edgeLegend: Observable<Array<Legend>>;
  filePanelTab: Observable<enums.FilePanelEnum>;
  legendPanelTab: Observable<enums.LegendPanelEnum>;
  graphPanelTab: Observable<enums.GraphPanelEnum>;
  genesetPanelTab: Observable<enums.SinglePanelEnum>;
  statPanelTab: Observable<enums.StatPanelEnum>;
  queryPanelTab: Observable<enums.QueryPanelEnum>;
  edgePanelTab: Observable<enums.EdgePanelEnum>;
  toolPanelTab: Observable<enums.ToolPanelEnum>;
  workspacePanelTab: Observable<enums.WorkspacePanelEnum>;
  historyPanelTab: Observable<enums.HistoryPanelEnum>;
  cohortPanelTab: Observable<enums.GraphPanelEnum>;
  dataPanelTab: Observable<enums.DataPanelEnum>;
  geneSignaturePanelTab: Observable<enums.SinglePanelEnum>;
  clusteringAlgorithmPanelTab: Observable<enums.SinglePanelEnum>;
  selectedTool: Observable<enums.ToolEnum>;
  selectedGraph: Observable<enums.GraphEnum>;
  fields: Observable<Array<DataField>>;
  tables: Observable<Array<DataTable>>;
  events: Observable<Array<{type: string, subtype: string}>>;
  queryData: Observable<any>;
  _selectedGraph: enums.GraphEnum; // This is super wrong

  constructor(private store: Store<fromRoot.State>) {
    this.clusteringAlgorithmPanelTab = store.select(fromRoot.getLayoutClusteringAlgorithmPanelState);
    this.geneSignaturePanelTab = store.select(fromRoot.getLayoutGeneSignaturePanelState);
    this.edgePanelTab = store.select(fromRoot.getLayoutEdgePanelState);
    this.filePanelTab = store.select(fromRoot.getLayoutFilePanelState);
    this.legendPanelTab = store.select(fromRoot.getLayoutLegendPanelState);
    this.graphPanelTab = store.select(fromRoot.getLayoutGraphPanelState);
    this.genesetPanelTab = store.select(fromRoot.getLayoutGenesetPanelState);
    this.statPanelTab = store.select(fromRoot.getLayoutPopulationPanelState);
    this.queryPanelTab = store.select(fromRoot.getLayoutQueryPanelState);
    this.toolPanelTab = store.select(fromRoot.getLayoutToolPanelState);
    this.workspacePanelTab = store.select(fromRoot.getWorkspacePanelState);
    this.historyPanelTab = store.select(fromRoot.getLayoutHistoryPanelState);
    this.cohortPanelTab = store.select(fromRoot.getLayoutCohortPanelState);
    this.dataPanelTab = store.select(fromRoot.getLayoutDataPanelState);
    this.edgeConfig = store.select(fromRoot.getEdgesConfig);
    this.graphAConfig = store.select(fromRoot.getGraphAConfig);
    this.graphBConfig = store.select(fromRoot.getGraphBConfig);
    this.workspaceConfig = store.select(fromRoot.getWorkspaceConfig);
    this.graphAData = store.select(fromRoot.getGraphAData);
    this.graphBData = store.select(fromRoot.getGraphBData);
    this.tables = store.select(fromRoot.getTables);
    this.fields = store.select(fromRoot.getFields);
    this.events = store.select(fromRoot.getEvents);
    this.queryData = store.select(fromRoot.getQueryData);
    this.store.dispatch( new DataLoadFromDexieAction('gbm') );
  }

  select(selection: {type: EntityTypeEnum, ids: Array<string>}): void {
    switch (selection.type) {
      case EntityTypeEnum.SAMPLE:
        this.store.dispatch(new compute.SelectSamplesAction({samples: selection.ids}));
        break;
      case EntityTypeEnum.GENE:
        this.store.dispatch(new compute.SelectMarkersAction({markers: selection.ids}));
        break;
    }
  }
  queryPanelToggle() {
    this.store.dispatch(new layout.QueryPanelToggleAction());
  }
  queryPanelSetTab(value: enums.QueryPanelEnum) {
    this.store.dispatch(new layout.QueryPanelShowTabAction(value));
  }
  fileOpen(value: DataTransfer) {
    this.store.dispatch(new data.DataLoadFromFileAction(value));
  }
  fileLoadTcga(value: string) {
    this.store.dispatch(new data.DataLoadFromTcga(value));
  }

  genesetPanelToggle() {
    this.store.dispatch(new layout.GenesetPanelToggleAction());
  }
  genesetPanelSetTab(value: enums.SinglePanelEnum) {
    this.store.dispatch(new layout.GenesetPanelShowTabAction(value));
  }

  graphPanelToggle() {
    this.store.dispatch(new layout.GraphPanelToggleAction());
  }
  graphPanelSetTab(value: enums.GraphPanelEnum) {
    this.store.dispatch(new layout.GraphPanelShowTabAction(value));
  }
  graphPanelSelectClusteringAlgorithm(value: GraphConfig) {
    this.store.dispatch(new layout.ClusteringAlgorithmPanelShowAction(value));
  }
  graphPanelSelectGeneSignature(value: GraphConfig) {
    this.store.dispatch(new layout.GeneSignaturePanelShowAction(value));
  }

  graphPanelSetConfig(value: GraphConfig) {
    switch (value.visualization) {
      case enums.VisualizationEnum.NONE:
        this.store.dispatch( new compute.NoneAction( { config: value as GraphConfig } ));
        break;
      case enums.VisualizationEnum.EDGES:
        this.store.dispatch( new compute.EdgesAction( { config: value as EdgeConfigModel} ));
        break;
      case enums.VisualizationEnum.PCA:
        this.store.dispatch( new compute.PcaAction( { config: value as PcaConfigModel} ));
        break;
      case enums.VisualizationEnum.PATHWAYS:
        this.store.dispatch( new compute.PathwaysAction( { config: value as PathwaysConfigModel} ));
        break;
      case enums.VisualizationEnum.CHROMOSOME:
        this.store.dispatch( new compute.ChromosomeAction( { config: value as ChromosomeConfigModel} ));
        break;
      case enums.VisualizationEnum.GENOME:
        this.store.dispatch( new compute.GenomeAction( { config: value as GenomeConfigModel} ));
        break;
      case enums.VisualizationEnum.TSNE:
        this.store.dispatch( new compute.TsneAction( { config: value as TsneConfigModel} ));
        break;
      case enums.VisualizationEnum.TIMELINES:
        this.store.dispatch( new compute.TimelinesAction( { config: value as TimelinesConfigModel }));
        break;
      case enums.VisualizationEnum.HEATMAP:
        this.store.dispatch( new compute.HeatmapAction( { config: value as HeatmapConfigModel} ));
        break;
      case enums.VisualizationEnum.PARALLEL_COORDS:
        this.store.dispatch( new compute.ParallelCoordsAction( { config: value as ParallelCoordsConfigModel} ));
        break;
      case enums.VisualizationEnum.BOX_WHISKERS:
        this.store.dispatch( new compute.BoxWhiskersAction( { config: value as BoxWhiskersConfigModel} ));
        break;
      case enums.VisualizationEnum.LINKED_GENE:
        this.store.dispatch( new compute.LinkedGeneAction( { config: value as LinkedGeneConfigModel} ));
        break;
      case enums.VisualizationEnum.HIC:
        this.store.dispatch( new compute.HicAction( { config: value as HicConfigModel} ));
        break;
      case enums.VisualizationEnum.SOM:
        this.store.dispatch( new compute.SomAction( { config: value as SomConfigModel} ));
        break;
      case enums.VisualizationEnum.MDS:
        this.store.dispatch( new compute.MdsAction( { config: value as MdsConfigModel} ));
        break;
      case enums.VisualizationEnum.FA:
        this.store.dispatch( new compute.FaAction( { config: value as FaConfigModel} ));
        break;
      case enums.VisualizationEnum.LDA:
        this.store.dispatch( new compute.LdaAction( { config: value as LdaConfigModel} ));
        break;
      case enums.VisualizationEnum.FAST_ICA:
        this.store.dispatch( new compute.FastIcaAction( { config: value as FastIcaConfigModel} ));
        break;
      case enums.VisualizationEnum.DICTIONARY_LEARNING:
        this.store.dispatch( new compute.DictionaryLearningAction( { config: value as DictionaryLearningConfigModel} ));
        break;
      case enums.VisualizationEnum.NMF:
        this.store.dispatch( new compute.NmfAction( { config: value as NmfConfigModel} ));
        break;
      case enums.VisualizationEnum.TRUNCATED_SVD:
        this.store.dispatch( new compute.TruncatedSvdAction( { config: value as TruncatedSvdConfigModel} ));
        break;
      case enums.VisualizationEnum.ISOMAP:
        this.store.dispatch( new compute.IsoMapAction( { config: value as IsoMapConfigModel} ));
        break;
      case enums.VisualizationEnum.LOCALLY_LINEAR_EMBEDDING:
        this.store.dispatch( new compute.LocalLinearEmbeddingAction( { config: value as LocalLinearEmbeddingConfigModel} ));
        break;
      case enums.VisualizationEnum.SPECTRAL_EMBEDDING:
        this.store.dispatch( new compute.SpectralEmbeddingAction( { config: value as SpectralEmbeddingConfigModel} ));
        break;
      case enums.VisualizationEnum.INCREMENTAL_PCA:
        this.store.dispatch( new compute.PcaIncrementalAction( { config: value as PcaIncrementalConfigModel} ));
        break;
      case enums.VisualizationEnum.KERNAL_PCA:
        this.store.dispatch( new compute.PcaKernalAction( { config: value as PcaKernalConfigModel} ));
        break;
      case enums.VisualizationEnum.SPARSE_PCA:
        this.store.dispatch( new compute.PcaSparseAction( { config: value as PcaSparseConfigModel} ));
        break;
    }
  }

  workspacePanelToggle() {
    this.store.dispatch(new layout.WorkspacePanelToggleAction());
  }
  workspacePanelSetTab(value) {
    this.store.dispatch(new layout.WorkspacePanelShowTabAction(value));
  }
  workspacePanelSetConfig(value: WorkspaceConfigModel) {
    this.store.dispatch( new WorkspaceConfigAction( value ));
  }

  filesLoad(value) {
    this.store.dispatch( new DataLoadIlluminaVcfAction( value ));
  }
  filePanelToggle() {
    this.store.dispatch(new layout.FilePanelToggleAction());
  }
  filePanelSetTab(value: enums.FilePanelEnum) {
    this.store.dispatch(new layout.FilePanelShowTabAction(value) );
  }

  edgePanelToggle() {
    this.store.dispatch(new layout.EdgePanelToggleAction());
  }
  edgePanelSetTab(value: enums.EdgePanelEnum) {
    this.store.dispatch(new layout.EdgePanelShowTabAction(value));
  }

  toolPanelToggle() {
    this.store.dispatch(new layout.ToolPanelToggleAction());
  }
  toolPanelSetTab(value: enums.ToolPanelEnum) {
    this.store.dispatch(new layout.ToolPanelShowTabAction(value));
  }

  statPanelToggle() {
    this.store.dispatch(new layout.PopulationPanelToggleAction());
  }
  statPanelSetTab(value: enums.StatPanelEnum) {
    this.store.dispatch(new layout.PopulationPanelShowTabAction(value));
  }

  legendPanelToggle() {
    this.store.dispatch(new layout.LegendPanelToggleAction());
  }
  legendPanelSetTab(value: enums.LegendPanelEnum) {
    this.store.dispatch(new layout.LegendPanelShowTabAction(value));
  }

  historyPanelToggle() {
    this.store.dispatch(new layout.HistoryPanelToggleAction());
  }
  historyPanelSetTab(value: enums.HistoryPanelEnum) {
    this.store.dispatch(new layout.HistoryPanelShowTabAction(value));
  }

  dataPanelToggle() {
    this.store.dispatch(new layout.DataPanelToggleAction());
  }
  dataPanelSetTab(value: enums.DataPanelEnum) {
    this.store.dispatch(new layout.DataPanelShowTabAction(value));
  }

  cohortPanelToggle() {
    this.store.dispatch(new layout.CohortPanelToggleAction());
  }
  cohortPanelSetTab(value: enums.GraphPanelEnum) {
    this.store.dispatch(new layout.CohortPanelShowTabAction(value));
  }

}
