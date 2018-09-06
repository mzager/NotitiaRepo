import { GeneSet } from './../model/gene-set.model';
import { Cohort } from './../model/cohort.model';
import {
  DataAddCohortAction,
  DataUpdateCohortsAction,
  DataUpdateGenesetsAction
} from './../action/data.action';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as compute from 'app/action/compute.action';
import * as graph from 'app/action/graph.action';
import { EntityTypeEnum } from 'app/model/enum.model';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from 'rxjs/Rx';
// tslint:disable-next-line:max-line-length
import {
  BoxWhiskersCompleteAction,
  ChromosomeCompleteAction,
  DendogramCompleteAction,
  DictionaryLearningCompleteAction,
  EdgesCompleteAction,
  FaCompleteAction,
  FastIcaCompleteAction,
  GenomeCompleteAction,
  HazardCompleteAction,
  HeatmapCompleteAction,
  HicCompleteAction,
  HistogramCompleteAction,
  IsoMapCompleteAction,
  LdaCompleteAction,
  LinearDiscriminantAnalysisCompleteAction,
  LinkedGeneCompleteAction,
  LocalLinearEmbeddingCompleteAction,
  MdsCompleteAction,
  MiniBatchDictionaryLearningCompleteAction,
  MiniBatchSparsePcaCompleteAction,
  NmfCompleteAction,
  NoneCompleteAction,
  NullDataAction,
  ParallelCoordsCompleteAction,
  PathwaysCompleteAction,
  PcaCompleteAction,
  PcaIncrementalCompleteAction,
  PcaKernalCompleteAction,
  PcaSparseCompleteAction,
  QuadraticDiscriminantAnalysisCompleteAction,
  SomCompleteAction,
  SpectralEmbeddingCompleteAction,
  SurvivalCompleteAction,
  TimelinesCompleteAction,
  TruncatedSvdCompleteAction,
  TsneCompleteAction
} from './../action/compute.action';
import {
  DataDecoratorAddAction,
  DataDecoratorCreateAction
} from './../action/graph.action';
import { LoaderHideAction } from './../action/layout.action';
import { UnsafeAction } from './../action/unsafe.action';
import { GraphData } from './../model/graph-data.model';
import { State } from './../reducer/index.reducer';
import { ComputeService } from './../service/compute.service';
import { DataService } from './../service/data.service';

@Injectable()
export class ComputeEffect {
  @Effect()
  loadEdges: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_EDGES)
    .map((action: UnsafeAction) => action.payload)
    .switchMap((payload: any) => {
      return this.computeService.edges(payload['config']).switchMap(result => {
        return Observable.of(
          result === null
            ? new NullDataAction()
            : new EdgesCompleteAction({
                config: result.config,
                data: result.data
              })
        );
      });
    });

  // @Effect() selectMarkers: Observable<any> = this.actions$
  //   .ofType(compute.COMPUTE_SELECT_MARKERS)
  //   .map((action: UnsafeAction) => action.payload)
  //   .withLatestFrom(this.store$)
  //   .switchMap((value: [any, State], index: number) => {
  //     const markerIds = value[0].markers;
  //     const database = value[1].graphA.config.database;
  //     return Observable.fromPromise(this.dataService.getMarkerStatsText(database, markerIds))
  //       .mergeMap(data => {
  //         return [
  //           new compute.SelectMarkersCompleteAction({ selection: { ids: value[0].markers, type: EntityTypeEnum.GENE }, stats: data })
  //         ];
  //       });
  //   });

  @Effect()
  selectSamples: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SELECT_SAMPLES)
    .map((action: UnsafeAction) => action.payload)
    .withLatestFrom(this.store$)
    .switchMap((value: [any, State], index: number) => {
      const sampleIds = value[0].samples;
      const database = value[1].graphA.config.database;
      return Observable.fromPromise(
        this.dataService.getPatientIdsWithSampleIds(database, sampleIds)
      ).switchMap(patientIds => {
        return Observable.fromPromise(
          this.dataService.getPatientStatsText(database, patientIds, sampleIds)
        ).mergeMap(data => {
          return [
            new compute.SelectSamplesCompleteAction({
              selection: { ids: value[0].samples, type: EntityTypeEnum.SAMPLE },
              stats: data
            })
          ];
        });
      });
    });

  @Effect()
  saveSampleSelection: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SELECT_SAMPLES_SAVE)
    .map((action: UnsafeAction) => action.payload)
    .withLatestFrom(this.store$)
    .switchMap((value: [any, State], index: number) => {
      const payload = {
        database: value[1].graphA.config.database,
        cohort: {
          n: value[0].name,
          pids: [],
          sids: value[0].selection.ids,
          conditions: {}
        }
      };
      return Observable.fromPromise(
        this.dataService.getPatientIdsWithSampleIds(
          payload.database,
          payload.cohort.sids
        )
      ).switchMap(data => {
        payload.cohort.pids = data;
        return Observable.fromPromise(
          this.dataService
            .createCustomCohortFromSelect(
              payload.database,
              payload.cohort as Cohort
            )
            .then(v => this.dataService.getCustomCohorts(payload.database))
        ).mergeMap((args: any) => {
          return Observable.of(new DataUpdateCohortsAction(args));
        });
      });
    });

  @Effect()
  saveMarkerSelection: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SELECT_MARKERS_SAVE)
    .map((action: UnsafeAction) => action.payload)
    .withLatestFrom(this.store$)
    .switchMap((value: [any, State], index: number) => {
      const payload = {
        database: value[1].graphA.config.database,
        geneset: {
          n: value[0].name,
          g: value[0].selection.ids
        }
      };
      return Observable.fromPromise(
        this.dataService
          .createCustomGenesetFromSelect(
            payload.database,
            payload.geneset as GeneSet
          )
          .then(v => this.dataService.getCustomGenesets(payload.database))
      ).mergeMap((args: any) => {
        return Observable.of(new DataUpdateGenesetsAction(args));
      });
    });

  @Effect()
  loadNone: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_NONE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      const graphData: GraphData = {
        result: null,
        resultScaled: null,
        sid: [],
        mid: [],
        pid: [],
        legends: []
      };
      return Observable.of(
        new NoneCompleteAction({ config: payload['config'], data: graphData })
      );
    });

  @Effect()
  loadFa: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_FA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.fa(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new FaCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadMds: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MDS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.mds(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new MdsCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadMiniBatchDictionaryLearning: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MINI_BATCH_DICTIONARY_LEARNING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .miniBatchDictionaryLearning(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new MiniBatchDictionaryLearningCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadMiniBatchSparsePca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_MINI_BATCH_SPARSE_PCA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .miniBatchSparsePca(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new MiniBatchSparsePcaCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadLinearDiscriminantAnalysis: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .linearDiscriminantAnalysis(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new LinearDiscriminantAnalysisCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });
  @Effect()
  loadQuadraticDiscriminantAnalysis: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .linearDiscriminantAnalysis(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new QuadraticDiscriminantAnalysisCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadTsne: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TSNE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.tsne(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new TsneCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadUmap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_UMAP)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.umap(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new compute.UmapCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadPca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pca(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new PcaCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadPathways: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PATHWAYS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .pathways(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new PathwaysCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadSurvival: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SURVIVAL)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .survival(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new SurvivalCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });
  @Effect()
  loadHazard: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HAZARD)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.hazard(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new HazardCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadHistogram: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HISTOGRAM)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .histogram(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new HistogramCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadSom: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SOM)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.pca(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new SomCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadChromosome: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_CHROMOSOME)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .chromosome(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new ChromosomeCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadGenome: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_GENOME)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.genome(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new GenomeCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadTimelines: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TIMELINES)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .timelines(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new TimelinesCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadHeatmap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HEATMAP)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.heatmap(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new HeatmapCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadDendogram: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_DENDOGRAM)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .dendogram(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new DendogramCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadBoxWhiskers: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_BOX_WHISKERS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .boxWhiskers(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new BoxWhiskersCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadParallelCoords: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PARALLEL_COORDS)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .boxWhiskers(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new ParallelCoordsCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadLinkedGene: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LINKED_GENE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .linkedGene(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new LinkedGeneCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadHic: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_HIC)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.hic(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new HicCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadDictionaryLearning: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_DICTIONARY_LEARNING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .dictionaryLearning(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new DictionaryLearningCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadTruncatedSvd: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_TRUNCATED_SVD)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .truncatedSvd(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new TruncatedSvdCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadFastIca: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_FAST_ICA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.fastIca(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new FastIcaCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadLda: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LDA)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.lda(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new LdaCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadNmf: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_NMF)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.nmf(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new NmfCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadLocalLinearEmbedding: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_LOCAL_LINEAR_EMBEDDING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.nmf(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new LocalLinearEmbeddingCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadIsoMap: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_ISO_MAP)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService.isoMap(payload['config']).mergeMap(result => {
        return [
          result === null
            ? new NullDataAction()
            : new IsoMapCompleteAction({
                config: result.config,
                data: result.data
              }),
          new LoaderHideAction()
        ];
      });
    });

  @Effect()
  loadSpectralEmbedding: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_SPECTRAL_EMBEDDING)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .spectralEmbedding(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new SpectralEmbeddingCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadPcaIncremental: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_INCREMENTAL)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .pcaIncremental(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new PcaIncrementalCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadPcaKernal: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_KERNAL)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .pcaKernal(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new PcaKernalCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  loadPcaSparse: Observable<any> = this.actions$
    .ofType(compute.COMPUTE_PCA_SPARSE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(payload => {
      return this.computeService
        .pcaSparse(payload['config'])
        .mergeMap(result => {
          return [
            result === null
              ? new NullDataAction()
              : new PcaSparseCompleteAction({
                  config: result.config,
                  data: result.data
                }),
            new LoaderHideAction()
          ];
        });
    });

  @Effect()
  addDataDecorator: Observable<any> = this.actions$
    .ofType(graph.DATA_DECORATOR_CREATE)
    .map((action: DataDecoratorCreateAction) => action.payload)
    .switchMap(payload => {
      return this.dataService
        .createDataDecorator(payload.config, payload.decorator)
        .mergeMap(result => {
          return [
            new DataDecoratorAddAction({
              config: payload.config,
              decorator: result
            }),
            new LoaderHideAction()
          ];
        });
    });

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private computeService: ComputeService,
    private dataService: DataService
  ) {}
}
