import { LoaderHideAction } from './../action/layout.action';
import { UnsafeAction } from './../action/unsafe.action';
import { boxwhiskersCompute } from './../component/visualization/boxwhiskers/boxwhiskers.compute';
import { GraphData } from './../model/graph-data.model';
import { EdgeConfigModel, EdgeDataModel } from './../component/visualization/edges/edges.model';
import { edgesCompute } from './../component/visualization/edges/edges.compute';
import { State } from './../reducer/index.reducer';
import * as compute from 'app/action/compute.action';
import * as data from 'app/action/data.action';
import * as moment from 'moment';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import {
  COMPUTE_CHROMOSOME,
  COMPUTE_CHROMOSOME_COMPLETE,
  COMPUTE_PCA,
  COMPUTE_EDGES,
  PcaCompleteAction,
  SomCompleteAction,
  ChromosomeCompleteAction,
  GenomeCompleteAction,
  TsneCompleteAction,
  EdgesCompleteAction,
  DendogramCompleteAction,
  HeatmapCompleteAction,
  PathwaysCompleteAction,
  ParallelCoordsCompleteAction,
  BoxWhiskersCompleteAction,
  LinkedGeneCompleteAction,
  TimelinesCompleteAction,
  HicCompleteAction,
  MdsCompleteAction,
  FaCompleteAction,
  DictionaryLearningCompleteAction,
  NmfCompleteAction,
  LdaCompleteAction,
  FastIcaCompleteAction,
  TruncatedSvdCompleteAction,
  LocalLinearEmbeddingCompleteAction,
  SpectralEmbeddingCompleteAction,
  IsoMapCompleteAction,
  PcaIncrementalCompleteAction,
  PcaKernalCompleteAction,
  PcaSparseCompleteAction,
  NoneCompleteAction,
  NullDataAction,
  MiniBatchDictionaryLearningCompleteAction,
  MiniBatchSparsePcaCompleteAction,
  LinearDiscriminantAnalysisCompleteAction,
  QuadraticDiscriminantAnalysisCompleteAction,
  SurvivalCompleteAction
} from './../action/compute.action';
import { ComputeService } from './../service/compute.service';
import { DataService } from './../service/data.service';
import { GraphEnum, VisualizationEnum } from 'app/model/enum.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeUntil';

@Injectable()
export class ComputeEffect {

  @Effect() loadEdges: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_EDGES)
    .map((action: UnsafeAction) => action.payload)
    .switchMap( (payload: any) => {
      const config: EdgeConfigModel = payload['config'];
      return this.computeService.edges(payload['config'])
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new EdgesCompleteAction({ config: result.config, data: result.data }));
        });
    });

  // @Effect() selectMarkers: Observable<any> = this.actions$
  //   .ofType(compute.SELECT_MARKERS)
  //   .withLatestFrom(this.store$)
  //   .switchMap((value: [any, State], index: number) => {
  //     const markers = value[0].payload.markers;
  //     return [
  //       this.visualizationToComputeAction(Object.assign({}, value[1].graphA.config, { markerFilter: markers })),
  //       this.visualizationToComputeAction(Object.assign({}, value[1].graphB.config, { markerFilter: markers }))
  //     ];
  //   });

  // @Effect() selectSamples: Observable<any> = this.actions$
  //   .ofType(compute.SELECT_SAMPLES)
  //   .withLatestFrom(this.store$)
  //   .switchMap((value: [any, State], index: number) => {
  //     const samples = value[0].payload.samples;
  //     return [
  //       this.visualizationToComputeAction(Object.assign({}, value[1].graphA.config, { sampleFilter: samples })),
  //       this.visualizationToComputeAction(Object.assign({}, value[1].graphB.config, { sampleFilter: samples }))
  //     ];
  //   });

  @Effect() loadNone: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_NONE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      const data:  GraphData = {
        legendItems: null,
        result: null,
        resultScaled: null,
        pointColor: null,
        pointSize: [],
        pointShape: [],
        sampleIds: [],
        markerIds: [],
        patientIds: []
      };
      return Observable.of( new NoneCompleteAction({ config: payload['config'], data: data }) );
    });

  @Effect() loadFa: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_FA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.fa(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new FaCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadMds: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MDS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.mds(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new MdsCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadMiniBatchDictionaryLearning: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MINI_BATCH_DICTIONARY_LEARNING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.miniBatchDictionaryLearning(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new MiniBatchDictionaryLearningCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadMiniBatchSparsePca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MINI_BATCH_SPARSE_PCA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.miniBatchSparsePca(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new MiniBatchSparsePcaCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

    @Effect() loadLinearDiscriminantAnalysis: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.linearDiscriminantAnalysis(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new LinearDiscriminantAnalysisCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });
    @Effect() loadQuadraticDiscriminantAnalysis: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.linearDiscriminantAnalysis(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new QuadraticDiscriminantAnalysisCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadTsne: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TSNE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.tsne(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new TsneCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadPca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pca(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new PcaCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadPathways: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PATHWAYS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pathways(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new PathwaysCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadSurvival: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SURVIVAL)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      debugger
      return this.computeService.survival(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new SurvivalCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadSom: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SOM)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pca(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new SomCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadChromosome: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_CHROMOSOME)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.chromosome(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new ChromosomeCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadGenome: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_GENOME)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.genome(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new GenomeCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadTimelines: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TIMELINES)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.timelines(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new TimelinesCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadHeatmap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HEATMAP)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.heatmap(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new HeatmapCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });
  
  @Effect() loadDendogram: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_DENDOGRAM)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.dendogram(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new DendogramCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadBoxWhiskers: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_BOX_WHISKERS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.boxWhiskers(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new BoxWhiskersCompleteAction({ config: result.config, data: result.data}),
            new LoaderHideAction()];
        });
    });

  @Effect() loadParallelCoords: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PARALLEL_COORDS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.boxWhiskers(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new ParallelCoordsCompleteAction({ config: result.config, data: result.data}),
            new LoaderHideAction()];
        });
    });

  @Effect() loadLinkedGene: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LINKED_GENE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.linkedGene(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new LinkedGeneCompleteAction({ config: result.config, data: result.data}),
            new LoaderHideAction()];
        });
    });

  @Effect() loadHic: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HIC)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.hic(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new HicCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadDictionaryLearning: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_DICTIONARY_LEARNING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.dictionaryLearning(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new DictionaryLearningCompleteAction({ config: result.config, data: result.data}),
            new LoaderHideAction()];
        });
    });

  @Effect() loadTruncatedSvd: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TRUNCATED_SVD)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.truncatedSvd(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new TruncatedSvdCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadFastIca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_FAST_ICA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.fastIca(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new FastIcaCompleteAction({ config: result.config, data: result.data}),
            new LoaderHideAction()];
        });
    });

  @Effect() loadLda: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LDA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.lda(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new LdaCompleteAction({ config: result.config, data: result.data}),
            new LoaderHideAction()];
        });
    });

  @Effect() loadNmf: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_NMF)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.nmf(payload['config'])
      .mergeMap(result => {
        return [(result === null) ? new NullDataAction() :
            new NmfCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadLocalLinearEmbedding: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LOCAL_LINEAR_EMBEDDING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.nmf(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new LocalLinearEmbeddingCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadIsoMap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_ISO_MAP)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.isoMap(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new IsoMapCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadSpectralEmbedding: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SPECTRAL_EMBEDDING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.spectralEmbedding(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new SpectralEmbeddingCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction() ];
        });
    });

  @Effect() loadPcaIncremental: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_INCREMENTAL)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pcaIncremental(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new PcaIncrementalCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadPcaKernal: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_KERNAL)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pcaKernal(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new PcaKernalCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });

  @Effect() loadPcaSparse: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_SPARSE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pcaSparse(payload['config'])
        .mergeMap(result => {
          return [(result === null) ? new NullDataAction() :
            new PcaSparseCompleteAction({ config: result.config, data: result.data }),
            new LoaderHideAction()];
        });
    });



  // visualizationToComputeAction(config: any): Action {
  //   switch (config.visualization) {
  //     case VisualizationEnum.CHROMOSOME:
  //       return new compute.ChromosomeAction({ config: config });
  //     case VisualizationEnum.PCA:
  //       return new compute.PcaAction({ config: config });
  //     case VisualizationEnum.HEATMAP:
  //       return new compute.HeatmapAction({ config: config });
  //   }
  // }

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private computeService: ComputeService
  ) { }
}
