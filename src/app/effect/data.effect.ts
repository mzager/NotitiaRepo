import { DatasetDescription } from './../model/dataset-description.model';
import { from as observableFrom, of as observableOf } from 'rxjs';
import { mergeMap, switchMap, map } from 'rxjs/operators';
import { ScatterConfigModel } from './../component/visualization/scatter/scatter.model';
import { Observable } from 'rxjs/Rx';
import { TipSetVisualizationAction } from './../action/tip.action';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as data from 'app/action/data.action';
import * as tip from 'app/action/tip.action';
import { GraphEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import * as compute from './../action/compute.action';
// tslint:disable-next-line:max-line-length
import {
  DataAddCohortAction,
  DataAddGenesetAction,
  DataAddPathwayAction,
  DataDelCohortAction,
  DataDelGenesetAction,
  DataDelPathwayAction,
  DataLoadedAction,
  DataLoadFromDexieAction,
  DataUpdateCohortsAction,
  DataUpdateGenesetsAction,
  DataAddPreprocessingAction,
  DataDelPreprocessingAction,
  DataUpdatePreprocessingAction,
  DataUpdatePathwayAction
} from './../action/data.action';
import { WorkspaceConfigAction } from './../action/graph.action';
import { LoaderShowAction } from './../action/layout.action';
import { UnsafeAction } from './../action/unsafe.action';
import { EdgeConfigModel } from './../component/visualization/edges/edges.model';
import { GenomeConfigModel } from './../component/visualization/genome/genome.model';
import { CollectionTypeEnum, WorkspaceLayoutEnum } from './../model/enum.model';
import { WorkspaceConfigModel } from './../model/workspace.model';
import { DataService } from './../service/data.service';
import { DatasetService } from './../service/dataset.service';
import { PcaConfigModel } from '../component/visualization/pca/pca.model';

@Injectable()
export class DataEffect {
  // Pathway Crud
  @Effect()
  addPathway: Observable<Action> = this.actions$.ofType(data.DATA_ADD_PATHWAY).pipe(
    switchMap((args: DataAddPathwayAction) => {
      return observableFrom(
        this.dataService
          .createCustomPathway(args.payload.database, args.payload.pathway)
          .then(() => this.dataService.getCustomPathways(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdatePathwayAction(args));
    })
  );

  @Effect()
  loadVisualizationTip: Observable<Action> = this.actions$.ofType(tip.TIP_SET_VISUALIZATION).pipe(
    switchMap((args: TipSetVisualizationAction) => {
      return observableFrom(this.dataService.getVisualizationTip(args.payload));
    }),
    switchMap((args: any) => {
      return observableOf(new tip.TipSetVisualizationCompleteAction(args));
    })
  );

  @Effect()
  delPathway: Observable<Action> = this.actions$.ofType(data.DATA_DEL_PATHWAY).pipe(
    switchMap((args: DataDelPathwayAction) => {
      return observableFrom(
        this.dataService
          .deleteCustomPathway(args.payload.database, args.payload.pathway)
          .then(() => this.dataService.getCustomPathways(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdatePathwayAction(args));
    })
  );

  // Cohort Crud
  @Effect()
  addCohort: Observable<Action> = this.actions$.ofType(data.DATA_ADD_COHORT).pipe(
    switchMap((args: DataAddCohortAction) => {
      return observableFrom(
        this.dataService
          .createCustomCohort(args.payload.database, args.payload.cohort)
          .then(() => this.dataService.getCustomCohorts(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdateCohortsAction(args));
    })
  );

  @Effect()
  delCohort: Observable<Action> = this.actions$.ofType(data.DATA_DEL_COHORT).pipe(
    switchMap((args: DataDelCohortAction) => {
      return observableFrom(
        this.dataService
          .deleteCustomCohort(args.payload.database, args.payload.cohort)
          .then(() => this.dataService.getCustomCohorts(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdateCohortsAction(args));
    })
  );

  // Geneset Crud
  @Effect()
  addGeneset: Observable<Action> = this.actions$.ofType(data.DATA_ADD_GENESET).pipe(
    switchMap((args: DataAddGenesetAction) => {
      return observableFrom(
        this.dataService
          .createCustomGeneset(args.payload.database, args.payload.geneset)
          .then(() => this.dataService.getCustomGenesets(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdateGenesetsAction(args));
    })
  );

  @Effect()
  delGeneset: Observable<Action> = this.actions$.ofType(data.DATA_DEL_GENESET).pipe(
    switchMap((args: DataDelGenesetAction) => {
      return observableFrom(
        this.dataService
          .deleteCustomGeneset(args.payload.database, args.payload.geneset)
          .then(() => this.dataService.getCustomGenesets(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdateGenesetsAction(args));
    })
  );

  // Geneset Crud
  @Effect()
  addPreprocessing: Observable<Action> = this.actions$.ofType(data.DATA_ADD_PREPROCESSING).pipe(
    switchMap((args: DataAddPreprocessingAction) => {
      return observableFrom(
        this.dataService
          .createCustomPreprocessing(args.payload.database, args.payload.preprocessing)
          .then(() => this.dataService.getCustomPreprocessing(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdatePreprocessingAction(args));
    })
  );

  @Effect()
  delPreprocessing: Observable<Action> = this.actions$.ofType(data.DATA_DEL_PREPROCESSING).pipe(
    switchMap((args: DataDelPreprocessingAction) => {
      return observableFrom(
        this.dataService
          .deleteCustomPreprocessing(args.payload.database, args.payload.preprocessing)
          .then(() => this.dataService.getCustomPreprocessing(args.payload.database))
      );
    }),
    switchMap((args: any) => {
      return observableOf(new DataUpdatePreprocessingAction(args));
    })
  );

  // Load Data From Public
  @Effect()
  dataLoadFromPublic$: Observable<any> = this.actions$.ofType(data.DATA_LOAD_FROM_PUBLIC).pipe(
    map((action: UnsafeAction) => action.payload),
    switchMap(args => {
      if (args['src'] === 'tcga') {
        args['baseUrl'] = 'https://oncoscape.v3.sttrcancer.org/data/' + args['src'] + '/';
        args['manifest'] =
          'https://oncoscape.v3.sttrcancer.org/data/' + args['src'] + '/' + args['prefix'] + 'manifest.json.gz';
      } else {
        args['baseUrl'] = 'https://oncoscape.v3.sttrcancer.org/data/zbd' + args['src'] + '/';
        args['manifest'] = 'https://oncoscape.v3.sttrcancer.org/data/zbd' + args['src'] + '/manifest.json.gz';
        args['token'] = '';
      }
      return this.datasetService.load(args);
    }),
    mergeMap(args => {
      return [
        // new FilePanelToggleAction(),
        new DataLoadFromDexieAction(args.uid, args.name)
      ];
    })
  );

  // Load Data From Public
  @Effect()
  dataLoadFromPrivate$: Observable<any> = this.actions$.ofType(data.DATA_LOAD_FROM_PRIVATE).pipe(
    map((action: UnsafeAction) => action.payload),
    switchMap(args => {
      args['uid'] = args['bucket'];
      args['baseUrl'] = 'https://oncoscape.v3.sttrcancer.org/datasets/' + args['bucket'] + '/';
      args['manifest'] = 'https://oncoscape.v3.sttrcancer.org/datasets/' + args['bucket'] + '/manifest.json.gz';
      return this.datasetService.load(args);
    }),
    mergeMap(args => {
      return [
        // new FilePanelToggleAction(),
        new DataLoadFromDexieAction(args.uid, args.name)
      ];
    })
  );

  // Load Data From Dexie
  @Effect()
  dataLoadFromDexie$: Observable<DataLoadedAction> = this.actions$.ofType(data.DATA_LOAD_FROM_DEXIE).pipe(
    switchMap((args: DataLoadFromDexieAction) => {
      GraphConfig.database = args.dataset;
      GraphConfig.datasetName = args.datasetname;
      return observableFrom(
        Promise.all([
          this.datasetService.getDataset(args.dataset),
          this.dataService.getCustomGenesets(args.dataset),
          this.dataService.getCustomCohorts(args.dataset),
          this.dataService.getCustomPathways(args.dataset),
          this.dataService.getCustomPreprocessing(args.dataset),
          this.dataService.getRowCount(args.dataset, 'mut'),
          new Promise((resolve, reject) => {
            resolve(args.datasetname);
          })
        ])
      );
    }),
    switchMap(args => {
      if (args[1] === undefined) {
        args[1] = [];
      }
      if (args[2] === undefined) {
        args[2] = [];
      }

      // Temp Fix While Converting To New Data Model
      const fields = args[0].hasOwnProperty('fields') ? args[0].fields : args[0].patients.concat(args[0].samples);

      const dsd = new DatasetDescription();
      dsd.hasEvents = args[0].events.length > 0;
      dsd.hasPatientFields = args[0].fields.filter(v => v.tbl === 'patient').length > 0;
      dsd.hasSampleFields = args[0].fields.filter(v => v.tbl === 'sample').length > 0;
      dsd.hasMatrixFields = args[0].tables.filter(v => v.ctype & CollectionTypeEnum.MOLECULAR).length > 0;
      dsd.hasMutations = args[5] > 1;
      dsd.hasSurvival =
        args[0].fields.filter(v => {
          return v.key === 'days_to_last_follow_up' || v.key === 'vital_status' || v.key === 'days_to_last_follow_up';
        }).length === 3;

      return observableOf(
        new DataLoadedAction(
          args[0].name,
          args[0].tables,
          fields,
          args[0].events,
          args[1],
          args[2],
          args[3],
          args[4],
          args[6].toString(),
          dsd
        )
      );
    })
  );

  @Effect()
  dataLoaded$: Observable<Action> = this.actions$.ofType(data.DATA_LOADED).pipe(
    mergeMap((args: DataLoadedAction) => {
      const workspaceConfig = new WorkspaceConfigModel();
      workspaceConfig.layout = WorkspaceLayoutEnum.SINGLE;
      const edgeConfig = new EdgeConfigModel();

      // const survivalConfig = new SurvivalConfigModel();
      // survivalConfig.graph = GraphEnum.GRAPH_A;
      // survivalConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      // const pathwaysConfig = new PathwaysConfigModel();
      // pathwaysConfig.graph = GraphEnum.GRAPH_A;
      // pathwaysConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      const genomeConfig = new GenomeConfigModel();
      genomeConfig.graph = GraphEnum.GRAPH_B;
      genomeConfig.datasetName = args.datasetName;
      genomeConfig.table = args.tables.filter(v => (v.ctype & CollectionTypeEnum.MOLECULAR) > 0)[0];

      // const chromosomeConfig = new ChromosomeConfigModel();
      // chromosomeConfig.graph = GraphEnum.GRAPH_A;
      // chromosomeConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      // const boxWhiskersConfig = new BoxWhiskersConfigModel();
      // boxWhiskersConfig.graph = GraphEnum.GRAPH_B;
      // boxWhiskersConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[0];

      // const timelinesConfigA = new TimelinesConfigModel();
      // timelinesConfigA.graph = GraphEnum.GRAPH_A;
      // timelinesConfigA.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[0];

      // const timelinesConfigB = new TimelinesConfigModel();
      // timelinesConfigB.graph = GraphEnum.GRAPH_B;
      // timelinesConfigB.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[0];

      // const graphBConfig = new PcaIncrementalConfigModel();
      // graphBConfig.graph = GraphEnum.GRAPH_A;
      // graphBConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      // const hicConfig = new HicConfigModel();
      // hicConfig.graph = GraphEnum.GRAPH_B;
      // hicConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

      // const graphAConfig = new LinkedGeneConfigModel();
      // graphAConfig.graph = GraphEnum.GRAPH_A;
      // graphAConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

      // const pcaIncConfig2 = new PcaIncrementalConfigModel();
      // pcaIncConfig2.graph = GraphEnum.GRAPH_B;
      // pcaIncConfig2.table = args.tables.filter(
      //   v => (v.ctype & CollectionTypeEnum.MOLECULAR) > 0
      // )[1];

      // const pcaIncConfig = new PcaIncrementalConfigModel();
      // pcaIncConfig.graph = GraphEnum.GRAPH_A;
      // pcaIncConfig.table = args.tables.filter(v => (v.ctype & CollectionTypeEnum.MOLECULAR) > 0)[0];

      // const graphBConfig = new PcaIncrementalConfigModel();
      // graphBConfig.graph = GraphEnum.GRAPH_A;
      // graphBConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      const pcaConfig = new PcaConfigModel();
      pcaConfig.graph = GraphEnum.GRAPH_A;
      pcaConfig.datasetName = args.datasetName;
      pcaConfig.table = args.tables.filter(v => (v.ctype & CollectionTypeEnum.MOLECULAR) > 0)[0];

      // scatterConfig.datasetName = args.datasetName;
      // const histogramConfig = new HistogramConfigModel();
      // histogramConfig.graph = GraphEnum.GRAPH_A;
      // histogramConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      // const heatmapConfig = new HeatmapConfigModel();
      // heatmapConfig.graph = GraphEnum.GRAPH_B;
      // heatmapConfig.table = args.tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0))[1];

      // const pathwaysConfig = new PathwaysConfigModel();
      // pathwaysConfig.graph = GraphEnum.GRAPH_A;
      // pathwaysConfig.table = args.tables.filter(v => (v.ctype & CollectionTypeEnum.MOLECULAR) > 0)[1];

      return [
        new DataUpdateCohortsAction(args.cohorts),
        new DataUpdateGenesetsAction(args.genesets),
        new DataUpdatePreprocessingAction(args.preprocessings),
        new WorkspaceConfigAction(workspaceConfig),
        new compute.EdgesAction({ config: edgeConfig }),
        // new compute.LinkedGeneAction( { config: graphAConfig } ),
        // new compute.PcaIncrementalAction({ config: graphBConfig }),
        // new compute.HicAction( { config: hicConfig }),
        // new compute.BoxWhiskersAction({ config: boxWhiskersConfig }),
        // new compute.TimelinesAction({ config: timelinesConfigA }),
        // new compute.TimelinesAction( { config: timelinesConfigB})
        // new compute.ChromosomeAction({ config: chromosomeConfig }),
        // new compute.HeatmapAction({ config: heatmapConfig }),
        // new compute.SurvivalAction({ config: survivalConfig }),
        // new compute.ChromosomeAction( { config: chromosomeConfig } )
        // new compute.PathwaysAction({ config: pathwaysConfig }),
        new compute.GenomeAction({ config: genomeConfig }),
        // new compute.PcaIncrementalAction({ config: pcaIncConfig }),
        // new compute.PcaIncrementalAction({ config: pcaIncConfig2 }),
        // new GraphPanelToggleAction( GraphPanelEnum.GRAPH_A )
        new compute.PcaAction({ config: pcaConfig }),
        // new compute.ScatterAction({ config: scatterConfig }),
        new LoaderShowAction()
        // new TipSetVisualizationAction(VisualizationEnum.INCREMENTAL_PCA)
      ];
    })
  );

  constructor(private actions$: Actions, private dataService: DataService, private datasetService: DatasetService) {}
}
