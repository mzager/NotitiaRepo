import { ScatterGraph } from './../../visualization/scatter/scatter.graph';
import { UmapGraph } from './../../visualization/umap/umap.graph';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { EdgeConfigModel } from 'app/component/visualization/edges/edges.model';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisGraph } from 'app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphEnum, VisualizationEnum } from 'app/model/enum.model';
import * as fromRoot from 'app/reducer/index.reducer';

import { Observable } from 'rxjs/Rx';
import { PcaGraph } from '../../visualization/pca/pca.graph';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { BoxWhiskersGraph } from './../../visualization/boxwhiskers/boxwhiskers.graph';
import { ChromosomeGraph } from './../../visualization/chromosome/chromosome.graph';
import { DendogramGraph } from './../../visualization/dendogram/dendogram.graph';
import { DictionaryLearningGraph } from './../../visualization/dictionarylearning/dictionarylearning.graph';
import { EdgesGraph } from './../../visualization/edges/edges.graph';
import { FaGraph } from './../../visualization/fa/fa.graph';
import { FastIcaGraph } from './../../visualization/fastica/fastica.graph';
import { GenomeGraph } from './../../visualization/genome/genome.graph';
import { HazardGraph } from './../../visualization/hazard/hazard.graph';
import { HeatmapGraph } from './../../visualization/heatmap/heatmap.graph';
import { HicGraph } from './../../visualization/hic/hic.graph';
import { HistogramGraph } from './../../visualization/histogram/histogram.graph';
import { IsoMapGraph } from './../../visualization/isomap/isomap.graph';
import { LdaGraph } from './../../visualization/lda/lda.graph';
import { LinearDiscriminantAnalysisGraph } from './../../visualization/lineardiscriminantanalysis/lineardiscriminantanalysis';
import { LinkedGeneGraph } from './../../visualization/linkedgenes/linkedgenes.graph';
import { LocalLinearEmbeddingGraph } from './../../visualization/locallinearembedding/locallinearembedding.graph';
import { MdsGraph } from './../../visualization/mds/mds.graph';
import { MiniBatchDictionaryLearningGraph } from './../../visualization/minibatchdictionarylearning/minibatchdictionarylearning';
import { MiniBatchSparsePcaGraph } from './../../visualization/minibatchsparsepca/minibatchsparsepca';
import { NmfGraph } from './../../visualization/nmf/nmf.graph';
import { ParallelCoordsGraph } from './../../visualization/parallelcoords/parallelcoords.graph';
import { PathwaysGraph } from './../../visualization/pathways/pathways.graph';
import { PcaIncrementalGraph } from './../../visualization/pcaincremental/pcaincremental.graph';
import { PcaKernalGraph } from './../../visualization/pcakernal/pcakernal.graph';
import { PcaSparseGraph } from './../../visualization/pcasparse/pcasparse.graph';
import { PlsGraph } from './../../visualization/pls/pls.graph';
import { SomGraph } from './../../visualization/som/som.graph';
import { SpectralEmbeddingGraph } from './../../visualization/spectralembedding/spectralembedding.graph';
import { SurvivalGraph } from './../../visualization/survival/survival.graph';
import { TimelinesGraph } from './../../visualization/timelines/timelines.graph';
import { TruncatedSvdGraph } from './../../visualization/truncatedsvd/truncatedsvd.graph';
import { TsneGraph } from './../../visualization/tsne/tsne.graph';
import {PlsSvdGraph} from './../../visualization/pls-svd/pls-svd.graph';
import {PlsRegressionGraph} from './../../visualization/plsregression/plsregression.graph';
import {PlsCanonicalGraph} from './../../visualization/plscanonical/plscanonical.graph';
import { ChartScene } from './chart.scene';

@Component({
  selector: 'app-workspace-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartScene]
})
export class ChartComponent implements AfterViewInit {
  labelA = '';
  labelB = '';

  @Output()
  public onSelect: EventEmitter<{
    type: EntityTypeEnum;
    ids: Array<string>;
  }> = new EventEmitter<{
    type: EntityTypeEnum;
    ids: Array<string>;
  }>();
  @Output()
  public configChange: EventEmitter<GraphConfig> = new EventEmitter<
    GraphConfig
  >();

  // Components
  @ViewChild('container')
  private container: ElementRef;

  @ViewChild('labelsA')
  private labelsA: ElementRef;

  @ViewChild('labelsB')
  private labelsB: ElementRef;

  @ViewChild('labelsE')
  private labelsE: ElementRef;

  @ViewChild('labelAContainer')
  private labelsAContainer: ElementRef;

  @ViewChild('labelBContainer')
  private labelsBContainer: ElementRef;

  /* LIFECYCLE */
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // }
      const chartScene: ChartScene = new ChartScene();
      chartScene.init(
        this.container.nativeElement,
        this.labelsA.nativeElement,
        this.labelsB.nativeElement,
        this.labelsE.nativeElement
      );

      chartScene.onSelect.subscribe(evt => {
        this.onSelect.next(evt);
      });
      chartScene.onConfigEmit.subscribe(evt => {
        this.configChange.next(evt.type);
      });

      const workspaceConfig: Observable<
        WorkspaceConfigModel
      > = this.store.select(fromRoot.getWorkspaceConfig);
      workspaceConfig.subscribe(v => (chartScene.workspaceConfig = v));

      const selectedGraphAConfig: Observable<GraphConfig> = this.store.select(
        fromRoot.getGraphAConfig
      );
      const updateDataGraphA: Observable<any> = this.store
        .select(fromRoot.getGraphAData)
        .withLatestFrom(selectedGraphAConfig)
        .filter(v => v[0] !== null);
      updateDataGraphA.subscribe(v => {
        this.labelA = v[1].label;
        this.cdr.detectChanges();
        const coi = this.createVisualization(
          (v[1] as GraphConfig).visualization
        );
        return chartScene.updateData(GraphEnum.GRAPH_A, v[1], v[0], coi);
      });

      const updateDecoratorGraphA: Observable<any> = this.store
        .select(fromRoot.getGraphADecorators)
        .withLatestFrom(selectedGraphAConfig)
        .filter(v => v[0] !== null);
      updateDecoratorGraphA.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.GRAPH_A, v[1], v[0]);
      });

      const selectedGraphBConfig: Observable<GraphConfig> = this.store.select(
        fromRoot.getGraphBConfig
      );
      const updateDataGraphB: Observable<any> = this.store
        .select(fromRoot.getGraphBData)
        .withLatestFrom(selectedGraphBConfig)
        .filter(v => v[0] !== null);
      updateDataGraphB.subscribe(v => {
        this.labelB = v[1].label;
        this.cdr.detectChanges();
        const coi = this.createVisualization(
          (v[1] as GraphConfig).visualization
        );
        return chartScene.updateData(GraphEnum.GRAPH_B, v[1], v[0], coi);
      });

      const updateDecoratorGraphB: Observable<any> = this.store
        .select(fromRoot.getGraphBDecorators)
        .withLatestFrom(selectedGraphBConfig)
        .filter(v => v[0] !== null);
      updateDecoratorGraphB.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.GRAPH_B, v[1], v[0]);
      });

      const selectedEdgeConfig: Observable<EdgeConfigModel> = this.store.select(
        fromRoot.getEdgesConfig
      );
      const updateDecoratorEdge: Observable<any> = this.store
        .select(fromRoot.getEdgeDecorators)
        .withLatestFrom(selectedEdgeConfig)
        .filter(v => v[0] !== null);
      updateDecoratorEdge.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.EDGES, v[1], v[0]);
      });

      const selectedEdgesConfig: Observable<GraphConfig> = this.store.select(
        fromRoot.getEdgesConfig
      );
      const updateEdges: Observable<any> = this.store
        .select(fromRoot.getEdgesData)
        .withLatestFrom(selectedEdgesConfig)
        .filter(v => v[0] !== null && v[0] !== null);
      updateEdges.subscribe(v => {
        const coi = this.createVisualization(
          (v[1] as GraphConfig).visualization
        );
        chartScene.updateData(GraphEnum.EDGES, v[1], v[0], coi);
      });
    });
  }

  public createVisualization(
    visualization: VisualizationEnum
  ): ChartObjectInterface {
    switch (visualization) {
      case VisualizationEnum.TIMELINES:
        return new TimelinesGraph();
      case VisualizationEnum.HEATMAP:
        return new HeatmapGraph();
      case VisualizationEnum.PATHWAYS:
        return new PathwaysGraph();
      case VisualizationEnum.EDGES:
        return new EdgesGraph();
      case VisualizationEnum.PCA:
        return new PcaGraph();
      case VisualizationEnum.CHROMOSOME:
        return new ChromosomeGraph();
      case VisualizationEnum.GENOME:
        return new GenomeGraph();
      case VisualizationEnum.TSNE:
        return new TsneGraph();
      case VisualizationEnum.UMAP:
        return new UmapGraph();
      case VisualizationEnum.SCATTER:
        return new ScatterGraph();
      case VisualizationEnum.PLS:
        return new PlsGraph();
      case VisualizationEnum.MDS:
        return new MdsGraph();
      case VisualizationEnum.FA:
        return new FaGraph();
      case VisualizationEnum.LINKED_GENE:
        return new LinkedGeneGraph();
      case VisualizationEnum.HIC:
        return new HicGraph();
      case VisualizationEnum.PARALLEL_COORDS:
        return new ParallelCoordsGraph();
      case VisualizationEnum.BOX_WHISKERS:
        return new BoxWhiskersGraph();
      case VisualizationEnum.SOM:
        return new SomGraph();
      case VisualizationEnum.TRUNCATED_SVD:
        return new TruncatedSvdGraph();
      case VisualizationEnum.FAST_ICA:
        return new FastIcaGraph();
      case VisualizationEnum.DICTIONARY_LEARNING:
        return new DictionaryLearningGraph();
      case VisualizationEnum.LDA:
        return new LdaGraph();
      case VisualizationEnum.NMF:
        return new NmfGraph();
      case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING:
        return new LocalLinearEmbeddingGraph();
      case VisualizationEnum.ISOMAP:
        return new IsoMapGraph();
      case VisualizationEnum.SPECTRAL_EMBEDDING:
        return new SpectralEmbeddingGraph();
      case VisualizationEnum.KERNAL_PCA:
        return new PcaKernalGraph();
      case VisualizationEnum.SPARSE_PCA:
        return new PcaSparseGraph();
      case VisualizationEnum.INCREMENTAL_PCA:
        return new PcaIncrementalGraph();
      case VisualizationEnum.MINI_BATCH_SPARSE_PCA:
        return new MiniBatchSparsePcaGraph();
      case VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING:
        return new MiniBatchDictionaryLearningGraph();
      case VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS:
        return new LinearDiscriminantAnalysisGraph();
      case VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS:
        return new QuadradicDiscriminantAnalysisGraph();
      case VisualizationEnum.SURVIVAL:
        return new SurvivalGraph();
      case VisualizationEnum.HAZARD:
        return new HazardGraph();
      case VisualizationEnum.DENDOGRAM:
        return new DendogramGraph();
      case VisualizationEnum.HISTOGRAM:
        return new HistogramGraph();
      case VisualizationEnum.PLSSVD:
        return new PlsSvdGraph();
      case VisualizationEnum.PLSREGRESSION:
        return new PlsRegressionGraph();
      case VisualizationEnum.PLSCANONICAL:
        return new PlsCanonicalGraph();
    }
  }

  constructor(
    private ngZone: NgZone,
    private store: Store<any>,
    private cdr: ChangeDetectorRef,
    private chartFactory: ChartFactory
  ) {}
}
