import { HeatmapConfigModel } from './../component/visualization/heatmap/heatmap.model';
import { HicConfigModel } from './../component/visualization/hic/hic.model';
import { BoxWhiskersConfigModel } from './../component/visualization/boxwhiskers/boxwhiskers.model';
import { GenomeConfigModel } from './../component/visualization/genome/genome.model';
import { graph } from 'ngraph.graph';
import { LinkedGeneConfigModel } from './../component/visualization/linkedgenes/linkedgenes.model';
import { FaConfigModel } from './../component/visualization/fa/fa.model';
import { PcaKernalConfigModel } from './../component/visualization/pcakernal/pcakernal.model';
import { PcaIncrementalConfigModel } from './../component/visualization/pcaincremental/pcaincremental.model';
import { TcgaPanelToggleAction } from './../action/layout.action';
import { DatasetService } from './../service/dataset.service';
import { IlluminaService } from './../service/illumina.service';
import { EdgeConfigModel } from './../component/visualization/edges/edges.model';
import { WorkspaceConfigAction } from './../action/graph.action';
import { WorkspaceConfigModel } from './../model/workspace.model';
import { UnsafeAction } from './../action/unsafe.action';
import { PlsConfigModel } from './../component/visualization/pls/pls.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { SelectGraphAction, SelectToolAction } from './../action/select.action';
import { ChromosomeConfigModel } from './../component/visualization/chromosome/chromosome.model';
import { PcaConfigModel } from './../component/visualization/pca/pca.model';
import { WorkbookService } from './../service/workbook.service';
import * as _ from 'lodash';
import * as compute from './../action/compute.action';
import * as data from 'app/action/data.action';
import * as select from 'app/action/select.action';
import * as fromRoot from 'app/reducer/index.reducer';
import * as moment from 'moment';
import * as service from 'app/service/http.client';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { ComputeService } from './../service/compute.service';
import { DataField } from 'app/model/data-field.model';
import { DataLoadedAction, DataLoadIlluminaVcfAction, DATA_LOADED, DataLoadFromDexieAction } from './../action/data.action';
import { DataService } from './../service/data.service';
import { DataTypeEnum, WorkspaceLayoutEnum, CollectionTypeEnum } from './../model/enum.model';
import { GraphEnum, ToolEnum } from 'app/model/enum.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skip';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/debounceTime';
import { TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';

@Injectable()
export class DataEffect {

    // Load Data From TCGA
    @Effect() dataLoadFromTcga$: Observable<any> = this.actions$
        .ofType(data.DATA_LOAD_FROM_TCGA)
        .map(toPayload)
        .switchMap( (args) => {
            return this.datasetService.loadTcga(args);
        })
        .mergeMap( (args) => {
            return [
                new TcgaPanelToggleAction(),
                new DataLoadFromDexieAction(args[0])
            ];
        });

    // Load Data From Dexie
    @Effect() dataLoadFromDexie$: Observable<DataLoadedAction> = this.actions$
        .ofType(data.DATA_LOAD_FROM_DEXIE)
        .switchMap( (args: DataLoadFromDexieAction) => {
            return Observable.fromPromise(this.datasetService.getDataset(args.dataset));
        })
        .switchMap( (args) => {
            return Observable.of(new DataLoadedAction(args.name, args.tables, args.fields, args.events));
        });

    // Sweet we got the data... now we configure our views.  T
    // this will ultimately get replaced with a wizard.
    @Effect() dataLoaded$: Observable<Action> = this.actions$
        .ofType(data.DATA_LOADED)
        .mergeMap( (args: DataLoadedAction) => {

            const workspaceConfig = new WorkspaceConfigModel();
            workspaceConfig.layout = WorkspaceLayoutEnum.HORIZONTAL;

            // const graphBConfig = new GenomeConfigModel();
            // graphBConfig.graph = GraphEnum.GRAPH_A;
            // graphBConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const chromosomeConfig = new ChromosomeConfigModel();
            // chromosomeConfig.graph = GraphEnum.GRAPH_B;
            // chromosomeConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            const boxWhiskersConfig = new BoxWhiskersConfigModel();
            boxWhiskersConfig.graph = GraphEnum.GRAPH_B;
            boxWhiskersConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[0];

            // const timelinesConfig = new TimelinesConfigModel();
            // timelinesConfig.graph = GraphEnum.GRAPH_B;
            //timelinesConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[0];

            // const graphAConfig = new PcaIncrementalConfigModel();
            // graphAConfig.graph = GraphEnum.GRAPH_B;
            // graphAConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const hicConfig = new HicConfigModel();
            // hicConfig.graph = GraphEnum.GRAPH_A;
            // hicConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const graphAConfig = new LinkedGeneConfigModel();
            // graphAConfig.graph = GraphEnum.GRAPH_A;
            // graphAConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            const graphAConfig = new PcaIncrementalConfigModel();
            // graphAConfig.graph = GraphEnum.GRAPH_B;
            graphAConfig.graph = GraphEnum.GRAPH_A
            graphAConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];


            // const graphBConfig = new PcaIncrementalConfigModel();
            // graphBConfig.graph = GraphEnum.GRAPH_B;
            // graphBConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const heatmapConfig = new HeatmapConfigModel();
            // heatmapConfig.graph = GraphEnum.GRAPH_A;
            // heatmapConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            return [
                new WorkspaceConfigAction( workspaceConfig ),
                // new compute.LinkedGeneAction( { config: graphAConfig } ),
                new compute.PcaIncrementalAction( { config: graphAConfig } ),
                // new compute.PcaIncrementalAction( { config: graphBConfig } ),
                // new compute.HicAction( { config: hicConfig }),
                // new compute.BoxWhiskersAction( { config: boxWhiskersConfig } ),
                // new compute.TimelinesAction( { config: timelinesConfig})
                // new compute.GenomeAction( { config: graphBConfig }),
                // new compute.ChromosomeAction( { config: chromosomeConfig } )
                // new compute.HeatmapAction( { config: heatmapConfig })
                // new compute.ChromosomeAction( { config: graphBConfig } )
                // new compute.GenomeAction( { config: graphBConfig })
                // , new compute.PcaIncrementalAction( { config: graphBConfig } )
            ];
        });

    constructor(
        private actions$: Actions,
        private computeService: ComputeService,
        private dataService: DataService,
        private datasetService: DatasetService,
        private workbookService: WorkbookService,
        private illunimaService: IlluminaService
    ) { }
}
