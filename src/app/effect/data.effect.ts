import { SurvivalConfigModel } from './../component/visualization/survival/survival.model';
import { genomeCompute } from './../component/visualization/genome/genome.compute';
import { HeatmapConfigModel } from './../component/visualization/heatmap/heatmap.model';
import { HicConfigModel } from './../component/visualization/hic/hic.model';
import { BoxWhiskersConfigModel } from './../component/visualization/boxwhiskers/boxwhiskers.model';
import { GenomeConfigModel } from './../component/visualization/genome/genome.model';
import { graph } from 'ngraph.graph';
import { LinkedGeneConfigModel } from './../component/visualization/linkedgenes/linkedgenes.model';
import { FaConfigModel } from './../component/visualization/fa/fa.model';
import { PcaKernalConfigModel } from './../component/visualization/pcakernal/pcakernal.model';
import { PcaIncrementalConfigModel } from './../component/visualization/pcaincremental/pcaincremental.model';
import { TcgaPanelToggleAction, FilePanelToggleAction, GraphPanelToggleAction } from './../action/layout.action';
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
import { DataTypeEnum, WorkspaceLayoutEnum, CollectionTypeEnum, GraphPanelEnum } from './../model/enum.model';
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
import { PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { single } from 'rxjs/operator/single';

@Injectable()
export class DataEffect {

    // Load Data From TCGA
    @Effect() dataLoadFromTcga$: Observable<any> = this.actions$
        .ofType(data.DATA_LOAD_FROM_TCGA)
        .map(toPayload)
        .switchMap( (args) => {
            // TODO: Move Into Config
            // args.manifest = 'https://canaantt-test.s3.amazonaws.com/5a7e7be1a5a1b333f4e9989b_manifest_json.gz?AWSAccessKeyId=AKIAIKDBEKXIPN4XUFTA&Expires=1534025109&Signature=9xOf6j6LAQ4MvNg63B5bO%2B2n9vA%3D';
            //'https://canaantt-test.s3.amazonaws.com/5a7e7be1a5a1b333f4e9989b_manifest_json.gz?AWSAccessKeyId=AKIAIKDBEKXIPN4XUFTA&Expires=1533864341&Signature=nboSjgz99Qs3IUsgCx%2BTs06aYo0%3D'
            args.manifest = 'https://s3-us-west-2.amazonaws.com/notitia/tcga/tcga_' + args.disease + '_manifest.json.gz';
            return this.datasetService.load(args);
        }).
        mergeMap( (args) => {
            return [
                new FilePanelToggleAction(),
                new DataLoadFromDexieAction(args.disease)
            ];
        });

    // Load Data From Dexie
    @Effect() dataLoadFromDexie$: Observable<DataLoadedAction> = this.actions$
        .ofType(data.DATA_LOAD_FROM_DEXIE)
        .switchMap( (args: DataLoadFromDexieAction) => {
            GraphConfig.database = args.dataset;
            return Observable.fromPromise(this.datasetService.getDataset(args.dataset));
        })
        .switchMap( (args) => {
            return Observable.of(new DataLoadedAction(args.name, args.tables, args.fields, args.events));
        });

    @Effect() dataLoaded$: Observable<Action> = this.actions$
        .ofType(data.DATA_LOADED)
        .mergeMap( (args: DataLoadedAction) => {

            const workspaceConfig = new WorkspaceConfigModel();
            workspaceConfig.layout = WorkspaceLayoutEnum.HORIZONTAL;

            // const survivalConfig = new SurvivalConfigModel();
            // survivalConfig.graph = GraphEnum.GRAPH_A;
            const pathwaysConfig = new PathwaysConfigModel();
            pathwaysConfig.graph = GraphEnum.GRAPH_B;
            pathwaysConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const genomeConfig = new GenomeConfigModel();
            // genomeConfig.graph = GraphEnum.GRAPH_B;
            // genomeConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const chromosomeConfig = new ChromosomeConfigModel();
            // chromosomeConfig.graph = GraphEnum.GRAPH_A;
            // chromosomeConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const boxWhiskersConfig = new BoxWhiskersConfigModel();
            // boxWhiskersConfig.graph = GraphEnum.GRAPH_A;
            // boxWhiskersConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[0];

            // const timelinesConfigA = new TimelinesConfigModel();
            // timelinesConfigA.graph = GraphEnum.GRAPH_A;
            // timelinesConfigA.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[0];

            // const timelinesConfigB = new TimelinesConfigModel();
            // timelinesConfigB.graph = GraphEnum.GRAPH_B;
            // timelinesConfigB.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[0];

            // const graphBConfig = new PcaIncrementalConfigModel();
            // graphBConfig.graph = GraphEnum.GRAPH_B;
            // graphBConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const hicConfig = new HicConfigModel();
            // hicConfig.graph = GraphEnum.GRAPH_B;
            // hicConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const graphAConfig = new LinkedGeneConfigModel();
            // graphAConfig.graph = GraphEnum.GRAPH_A;
            // graphAConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];


            const graphAConfig = new PcaIncrementalConfigModel();
            graphAConfig.graph = GraphEnum.GRAPH_A;
            graphAConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            // const graphBConfig = new PcaIncrementalConfigModel();
            // graphBConfig.graph = GraphEnum.GRAPH_B;
            // graphBConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];


            // const heatmapConfig = new HeatmapConfigModel();
            // heatmapConfig.graph = GraphEnum.GRAPH_B;
            // heatmapConfig.table = args.tables.filter( v => ( (v.ctype & CollectionTypeEnum.MOLECULAR) > 0) )[1];

            return [
                new WorkspaceConfigAction( workspaceConfig ),
                // new compute.LinkedGeneAction( { config: graphAConfig } ),
                new compute.PcaIncrementalAction( { config: graphAConfig } ),
                // new compute.HicAction( { config: hicConfig }),
                // new compute.BoxWhiskersAction( { config: boxWhiskersConfig } ),

                // new compute.TimelinesAction( { config: timelinesConfigA}),
                // new compute.TimelinesAction( { config: timelinesConfigB})

                //  new compute.ChromosomeAction( { config: chromosomeConfig } ),
                // new compute.HeatmapAction( { config: heatmapConfig })
                // new compute.SurvivalAction( { config: survivalConfig })
                // new compute.ChromosomeAction( { config: chromosomeConfig } )
                new compute.PathwaysAction( { config: pathwaysConfig }),
                // new compute.GenomeAction( { config: genomeConfig }),
                // new compute.PcaIncrementalAction( { config: graphBConfig } )
                // new GraphPanelToggleAction( GraphPanelEnum.GRAPH_A )
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
