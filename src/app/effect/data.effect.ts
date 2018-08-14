import { TipSetVisualizationAction } from "./../action/tip.action";
import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import * as data from "app/action/data.action";
import * as tip from "app/action/tip.action";
import { PathwaysConfigModel } from "app/component/visualization/pathways/pathways.model";
import { GraphEnum, VisibilityEnum, VisualizationEnum } from "app/model/enum.model";
import { GraphConfig } from "app/model/graph-config.model";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/skip";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/takeUntil";
import "rxjs/add/operator/withLatestFrom";
import { Observable } from "rxjs/Observable";
import * as compute from "./../action/compute.action";
// tslint:disable-next-line:max-line-length
import { DataAddCohortAction, DataAddGenesetAction, DataAddPathwayAction, DataDelCohortAction, DataDelGenesetAction, DataDelPathwayAction, DataLoadedAction, DataLoadFromDexieAction, DataUpdateCohortsAction, DataUpdateGenesetsAction, DataUpdatePathwayAction } from "./../action/data.action";
import { WorkspaceConfigAction } from "./../action/graph.action";
import { LoaderShowAction } from "./../action/layout.action";
import { UnsafeAction } from "./../action/unsafe.action";
import { EdgeConfigModel } from "./../component/visualization/edges/edges.model";
import { GenomeConfigModel } from "./../component/visualization/genome/genome.model";
import { PcaIncrementalConfigModel } from "./../component/visualization/pcaincremental/pcaincremental.model";
import { CollectionTypeEnum, WorkspaceLayoutEnum } from "./../model/enum.model";
import { WorkspaceConfigModel } from "./../model/workspace.model";
import { DataService } from "./../service/data.service";
import { DatasetService } from "./../service/dataset.service";
import { PcaConfigModel } from "../component/visualization/pca/pca.model";

@Injectable()
export class DataEffect {
  // Pathway Crud
  @Effect()
  addPathway: Observable<Action> = this.actions$
    .ofType(data.DATA_ADD_PATHWAY)
    .switchMap((args: DataAddPathwayAction) => {
      return Observable.fromPromise(this.dataService.createCustomPathway(args.payload.database, args.payload.pathway).then(() => this.dataService.getCustomPathways(args.payload.database)));
    })
    .switchMap((args: any) => {
      return Observable.of(new DataUpdatePathwayAction(args));
    });

  @Effect()
  loadVisualizationTip: Observable<Action> = this.actions$
    .ofType(tip.TIP_SET_VISUALIZATION)
    .switchMap((args: TipSetVisualizationAction) => {
      return Observable.fromPromise(this.dataService.getVisualizationTip(args.payload));
    })
    .switchMap((args: any) => {
      return Observable.of(new tip.TipSetVisualizationCompleteAction(args));
    });

  @Effect()
  delPathway: Observable<Action> = this.actions$
    .ofType(data.DATA_DEL_PATHWAY)
    .switchMap((args: DataDelPathwayAction) => {
      return Observable.fromPromise(this.dataService.deleteCustomPathway(args.payload.database, args.payload.pathway).then(() => this.dataService.getCustomPathways(args.payload.database)));
    })
    .switchMap((args: any) => {
      return Observable.of(new DataUpdatePathwayAction(args));
    });

  // Cohort Crud
  @Effect()
  addCohort: Observable<Action> = this.actions$
    .ofType(data.DATA_ADD_COHORT)
    .switchMap((args: DataAddCohortAction) => {
      return Observable.fromPromise(this.dataService.createCustomCohort(args.payload.database, args.payload.cohort).then(() => this.dataService.getCustomCohorts(args.payload.database)));
    })
    .switchMap((args: any) => {
      return Observable.of(new DataUpdateCohortsAction(args));
    });

  @Effect()
  delCohort: Observable<Action> = this.actions$
    .ofType(data.DATA_DEL_COHORT)
    .switchMap((args: DataDelCohortAction) => {
      return Observable.fromPromise(this.dataService.deleteCustomCohort(args.payload.database, args.payload.cohort).then(() => this.dataService.getCustomCohorts(args.payload.database)));
    })
    .switchMap((args: any) => {
      return Observable.of(new DataUpdateCohortsAction(args));
    });

  // Geneset Crud
  @Effect()
  addGeneset: Observable<Action> = this.actions$
    .ofType(data.DATA_ADD_GENESET)
    .switchMap((args: DataAddGenesetAction) => {
      return Observable.fromPromise(this.dataService.createCustomGeneset(args.payload.database, args.payload.geneset).then(() => this.dataService.getCustomGenesets(args.payload.database)));
    })
    .switchMap((args: any) => {
      return Observable.of(new DataUpdateGenesetsAction(args));
    });

  @Effect()
  delGeneset: Observable<Action> = this.actions$
    .ofType(data.DATA_DEL_GENESET)
    .switchMap((args: DataDelGenesetAction) => {
      return Observable.fromPromise(this.dataService.deleteCustomGeneset(args.payload.database, args.payload.geneset).then(() => this.dataService.getCustomGenesets(args.payload.database)));
    })
    .switchMap((args: any) => {
      return Observable.of(new DataUpdateGenesetsAction(args));
    });

  // Load Data From Public
  @Effect()
  dataLoadFromPublic$: Observable<any> = this.actions$
    .ofType(data.DATA_LOAD_FROM_PUBLIC)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(args => {
      args["baseUrl"] = "https://oncoscape.v3.sttrcancer.org/data/" + args["src"] + "/";
      args["manifest"] = "https://oncoscape.v3.sttrcancer.org/data/" + args["src"] + "/" + args["prefix"] + "manifest.json.gz";
      return this.datasetService.load(args);
    })
    .mergeMap(args => {
      return [
        // new FilePanelToggleAction(),
        new DataLoadFromDexieAction(args.uid)
      ];
    });

  // Load Data From Public
  @Effect()
  dataLoadFromPrivate$: Observable<any> = this.actions$
    .ofType(data.DATA_LOAD_FROM_PRIVATE)
    .map((action: UnsafeAction) => action.payload)
    .switchMap(args => {
      args["uid"] = args["bucket"];
      args["baseUrl"] = "https://oncoscape.v3.sttrcancer.org/datasets/" + args["bucket"] + "/";
      args["manifest"] = "https://oncoscape.v3.sttrcancer.org/datasets/" + args["bucket"] + "/manifest.json.gz";
      return this.datasetService.load(args);
    })
    .mergeMap(args => {
      return [
        // new FilePanelToggleAction(),
        new DataLoadFromDexieAction(args.uid)
      ];
    });

  // Load Data From Dexie
  @Effect()
  dataLoadFromDexie$: Observable<DataLoadedAction> = this.actions$
    .ofType(data.DATA_LOAD_FROM_DEXIE)
    .switchMap((args: DataLoadFromDexieAction) => {
      GraphConfig.database = args.dataset;
      return Observable.fromPromise(Promise.all([this.datasetService.getDataset(args.dataset), this.dataService.getCustomGenesets(args.dataset), this.dataService.getCustomCohorts(args.dataset), this.dataService.getCustomPathways(args.dataset)]));
    })
    .switchMap(args => {
      if (args[1] === undefined) {
        args[1] = [];
      }
      if (args[2] === undefined) {
        args[2] = [];
      }
      return Observable.of(new DataLoadedAction(args[0].name, args[0].tables, args[0].fields, args[0].events, args[1], args[2], args[3]));
    });

  @Effect()
  dataLoaded$: Observable<Action> = this.actions$.ofType(data.DATA_LOADED).mergeMap((args: DataLoadedAction) => {
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
    pcaConfig.table = args.tables.filter(v => (v.ctype & CollectionTypeEnum.MOLECULAR) > 0)[1];

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
      new LoaderShowAction(),
      new TipSetVisualizationAction(VisualizationEnum.INCREMENTAL_PCA)
    ];
  });

  constructor(private actions$: Actions, private dataService: DataService, private datasetService: DatasetService) {}
}
