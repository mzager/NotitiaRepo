import { EdgeConfigModel, EdgeDataModel } from './../component/visualization/edges/edges.model';
import { edgesCompute } from './../component/visualization/edges/edges.compute';
import { State } from './../reducer/index.reducer';
import * as compute from 'app/action/compute.action';
import * as data from 'app/action/data.action';
import * as moment from 'moment';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import {
  COMPUTE_CHROMOSOME,
  COMPUTE_CHROMOSOME_COMPLETE,
  COMPUTE_PCA,
  COMPUTE_EDGES,
  PcaCompleteAction,
  SomCompleteAction,
  ChromosomeCompleteAction,
  TsneCompleteAction,
  EdgesCompleteAction,
  HeatmapCompleteAction,
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
  NullDataAction
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
    .map(toPayload)
    .switchMap( (payload: any) => {
      const config: EdgeConfigModel = payload.config;
      return this.computeService.edges(payload.config)
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

  @Effect() loadFa: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_FA)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.fa(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new FaCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadMds: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MDS)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.mds(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new MdsCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadTsne: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TSNE)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.tsne(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new TsneCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadPca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.pca(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new PcaCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadSom: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SOM)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.pca(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new SomCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadChromosome: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_CHROMOSOME)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.chromosome(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new ChromosomeCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadHeatmap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HEATMAP)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.heatmap(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new HeatmapCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadDictionaryLearning: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_DICTIONARY_LEARNING)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.dictionaryLearning(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new DictionaryLearningCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadTruncatedSvd: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TRUNCATED_SVD)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.truncatedSvd(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new TruncatedSvdCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadFastIca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_FAST_ICA)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.fastIca(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new FastIcaCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadLda: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LDA)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.lda(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new LdaCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadNmf: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_NMF)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.nmf(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new NmfCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadLocalLinearEmbedding: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LOCAL_LINEAR_EMBEDDING)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.nmf(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new LocalLinearEmbeddingCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadIsoMap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_ISO_MAP)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.isoMap(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new IsoMapCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadSpectralEmbedding: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SPECTRAL_EMBEDDING)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.spectralEmbedding(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new SpectralEmbeddingCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadPcaIncremental: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_INCREMENTAL)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.pcaIncremental(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new PcaIncrementalCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadPcaKernal: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_KERNAL)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.pcaKernal(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new PcaKernalCompleteAction({ config: result.config, data: result.data }));
        });
    });

  @Effect() loadPcaSparse: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_SPARSE)
    .map(toPayload)
    .switchMap(payload => {
      return this.computeService.pcaSparse(payload.config)
        .switchMap(result => {
          return Observable.of((result === null) ? new NullDataAction() :
            new PcaSparseCompleteAction({ config: result.config, data: result.data }));
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
