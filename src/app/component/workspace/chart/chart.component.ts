
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { FontService } from './../../../service/font.service';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { getGraphAConfig, getEdgesData } from './../../../reducer/index.reducer';
import * as e from 'app/model/enum.model';
import * as fromRoot from 'app/reducer/index.reducer';
import * as select from 'app/action/select.action';
import { Action, Store } from '@ngrx/store';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { ChartScene } from './chart.scene';
import { GraphConfig } from './../../../model/graph-config.model';
import { Observable } from 'rxjs/Observable';
import { GraphEnum, VisualizationEnum } from 'app/model/enum.model';
import { PcaIncrementalGraph } from './../../visualization/pcaincremental/pcaincremental.graph';
import { PcaSparseGraph } from './../../visualization/pcasparse/pcasparse.graph';
import { PcaKernalGraph } from './../../visualization/pcakernal/pcakernal.graph';
import { SpectralEmbeddingGraph } from './../../visualization/spectralembedding/spectralembedding.graph';
import { IsoMapGraph } from './../../visualization/isomap/isomap.graph';
import { IsoMapFormComponent } from './../../visualization/isomap/isomap.form.component';
import { LocalLinearEmbeddingGraph } from './../../visualization/locallinearembedding/locallinearembedding.graph';
import { NmfGraph } from './../../visualization/nmf/nmf.graph';
import { LdaGraph } from './../../visualization/lda/lda.graph';
import { DictionaryLearningGraph } from './../../visualization/dictionarylearning/dictionarylearning.graph';
import { FastIcaGraph } from './../../visualization/fastica/fastica.graph';
import { TruncatedSvdGraph } from './../../visualization/truncatedsvd/truncatedsvd.graph';
import { FaGraph } from './../../visualization/fa/fa.graph';
import { MdsGraph } from './../../visualization/mds/mds.graph';
import { SomGraph } from './../../visualization/som/som.graph';
import { HeatmapGraph } from './../../visualization/heatmap/heatmap.graph';
import { EdgesGraph } from './../../visualization/edges/edges.graph';
import { PlsGraph } from './../../visualization/pls/pls.graph';
import { TsneGraph } from './../../visualization/tsne/tsne.graph';
import { ChromosomeGraph } from './../../visualization/chromosome/chromosome.graph';
import { HistogramGraph } from './../../visualization/histogram/histogram.graph';
import { BoxWhiskersGraph } from './../../visualization/boxwhiskers/boxwhiskers.graph';
import { DendogramGraph } from './../../visualization/dendogram/dendogram.graph';
import { SurvivalGraph } from './../../visualization/survival/survival.graph';
import { LinearDiscriminantAnalysisGraph } from './../../visualization/lineardiscriminantanalysis/lineardiscriminantanalysis';
import { MiniBatchDictionaryLearningGraph } from './../../visualization/minibatchdictionarylearning/minibatchdictionarylearning';
import { MiniBatchSparsePcaGraph } from './../../visualization/minibatchsparsepca/minibatchsparsepca';
import { PathwaysGraph } from './../../visualization/pathways/pathways.graph';
import { TimelinesGraph } from './../../visualization/timelines/timelines.graph';
import { HicGraph } from './../../visualization/hic/hic.graph';
import { ParallelCoordsGraph } from './../../visualization/parallelcoords/parallelcoords.graph';
import { GenomeGraph } from './../../visualization/genome/genome.graph';
import { LinkedGeneGraph } from './../../visualization/linkedgenes/linkedgenes.graph';
import { PcaGraph } from '../../visualization/pca/pca.graph';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisGraph } from 'app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis';

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
  public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
  @Output()
  public configChange: EventEmitter<GraphConfig> =
    new EventEmitter<GraphConfig>();

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

      // FontService.getInstance().then( fontFactoy => {

      // }
      const chartScene: ChartScene = new ChartScene(this.fontService);
      chartScene.init(this.container.nativeElement, this.labelsA.nativeElement,
        this.labelsB.nativeElement, this.labelsE.nativeElement);

      chartScene.onSelect.subscribe((evt) => {
        this.onSelect.next(evt);
      });
      chartScene.onConfigEmit.subscribe((evt) => {
        this.configChange.next(evt.type);
      });

      const workspaceConfig: Observable<WorkspaceConfigModel> = this.store.select(fromRoot.getWorkspaceConfig);
      workspaceConfig.subscribe(v => chartScene.workspaceConfig = v);

      const selectedGraphAConfig: Observable<GraphConfig> = this.store.select(fromRoot.getGraphAConfig);
      const updateDataGraphA: Observable<any> = this.store
        .select(fromRoot.getGraphAData)
        .withLatestFrom(selectedGraphAConfig)
        .filter(v => v[0] !== null);
      updateDataGraphA.subscribe(v => {
        this.labelA = v[1].label;
        this.cdr.markForCheck();
        const coi = this.createVisualization((v[1] as GraphConfig).visualization, this.fontService);
        return chartScene.updateData(GraphEnum.GRAPH_A, v[1], v[0], coi);
      });

      const updateDecoratorGraphA: Observable<any> = this.store
        .select(fromRoot.getGraphADecorators)
        .withLatestFrom(selectedGraphAConfig)
        .filter(v => v[0] !== null);
      updateDecoratorGraphA.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.GRAPH_A, v[1], v[0]);
      });


      const selectedGraphBConfig: Observable<GraphConfig> = this.store.select(fromRoot.getGraphBConfig);
      const updateDataGraphB: Observable<any> = this.store
        .select(fromRoot.getGraphBData)
        .withLatestFrom(selectedGraphBConfig)
        .filter(v => v[0] !== null);
      updateDataGraphB.subscribe(v => {
        this.labelB = v[1].label;
        this.cdr.markForCheck();
        const coi = this.createVisualization((v[1] as GraphConfig).visualization, this.fontService);
        return chartScene.updateData(GraphEnum.GRAPH_B, v[1], v[0], coi);
      });

      const updateDecoratorGraphB: Observable<any> = this.store
        .select(fromRoot.getGraphBDecorators)
        .withLatestFrom(selectedGraphBConfig)
        .filter(v => v[0] !== null);
      updateDecoratorGraphB.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.GRAPH_B, v[1], v[0]);
      });


      const selectedEdgesConfig: Observable<GraphConfig> = this.store.select(fromRoot.getEdgesConfig);
      const updateEdges: Observable<any> = this.store
        .select(fromRoot.getEdgesData)
        .withLatestFrom(selectedEdgesConfig)
        .filter(v => (v[0] !== null) && (v[0] !== null));
      updateEdges.subscribe(v => {
        const coi = this.createVisualization((v[1] as GraphConfig).visualization, this.fontService);
        chartScene.updateData(GraphEnum.EDGES, v[1], v[0], coi);
      });
    });
  }


  public createVisualization(visualization: VisualizationEnum, fontService: FontService): ChartObjectInterface {
    switch (visualization) {
      case VisualizationEnum.TIMELINES: return new TimelinesGraph(fontService);
      case VisualizationEnum.HEATMAP: return new HeatmapGraph();
      case VisualizationEnum.PATHWAYS: return new PathwaysGraph(fontService);
      case VisualizationEnum.EDGES: return new EdgesGraph();
      case VisualizationEnum.PCA: return new PcaGraph(fontService);
      case VisualizationEnum.CHROMOSOME: return new ChromosomeGraph(fontService);
      case VisualizationEnum.GENOME: return new GenomeGraph(fontService);
      case VisualizationEnum.TSNE: return new TsneGraph(fontService);
      case VisualizationEnum.PLS: return new PlsGraph();
      case VisualizationEnum.MDS: return new MdsGraph(fontService);
      case VisualizationEnum.FA: return new FaGraph(fontService);
      case VisualizationEnum.LINKED_GENE: return new LinkedGeneGraph();
      case VisualizationEnum.HIC: return new HicGraph(fontService);
      case VisualizationEnum.PARALLEL_COORDS: return new ParallelCoordsGraph();
      case VisualizationEnum.BOX_WHISKERS: return new BoxWhiskersGraph(fontService);
      case VisualizationEnum.SOM: return new SomGraph();
      case VisualizationEnum.TRUNCATED_SVD: return new TruncatedSvdGraph(fontService);
      case VisualizationEnum.FAST_ICA: return new FastIcaGraph(fontService);
      case VisualizationEnum.DICTIONARY_LEARNING: return new DictionaryLearningGraph(fontService);
      case VisualizationEnum.LDA: return new LdaGraph(fontService);
      case VisualizationEnum.NMF: return new NmfGraph(fontService);
      case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING: return new LocalLinearEmbeddingGraph(fontService);
      case VisualizationEnum.ISOMAP: return new IsoMapGraph(fontService);
      case VisualizationEnum.SPECTRAL_EMBEDDING: return new SpectralEmbeddingGraph(fontService);
      case VisualizationEnum.KERNAL_PCA: return new PcaKernalGraph(fontService);
      case VisualizationEnum.SPARSE_PCA: return new PcaSparseGraph(fontService);
      case VisualizationEnum.INCREMENTAL_PCA: return new PcaIncrementalGraph(fontService);
      case VisualizationEnum.MINI_BATCH_SPARSE_PCA: return new MiniBatchSparsePcaGraph(fontService);
      case VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING: return new MiniBatchDictionaryLearningGraph(fontService);
      case VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS: return new LinearDiscriminantAnalysisGraph(fontService);
      case VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS: return new QuadradicDiscriminantAnalysisGraph(fontService);
      case VisualizationEnum.SURVIVAL: return new SurvivalGraph(fontService);
      case VisualizationEnum.DENDOGRAM: return new DendogramGraph();
      case VisualizationEnum.HISTOGRAM: return new HistogramGraph(fontService);
    }
  }

  constructor(private ngZone: NgZone,
    private store: Store<any>,
    private cdr: ChangeDetectorRef,
    private chartFactory: ChartFactory,
    private fontService: FontService) { }
}
