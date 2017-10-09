import { GraphConfig } from 'app/model/graph-config.model';
import { SelectGraphCompleteAction } from './../action/select.action';
import { State } from './../reducer/layout.reducer';
import { ChromosomeConfigModel } from './../component/visualization/chromosome/chromosome.model';
import { PcaConfigModel } from './../component/visualization/pca/pca.model';
import { WorkbookService } from './../service/workbook.service';
import * as compute from './../action/compute.action';
import * as select from 'app/action/select.action';
import * as service from 'app/service/http.client';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { GraphEnum } from 'app/model/enum.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/skip';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/debounceTime';

@Injectable()
export class SelectEffect {

    // ZAGER --- TODAY
    // @Effect() selectGraph$: Observable<SelectGraphCompleteAction> = this.actions$
    //     .ofType(select.SELECT_GRAPH)
    //     .switchMap( (config) => {
    //         return Observable.of(new SelectGraphCompleteAction( config ));
    //     });

    // @Effect() selectGraph$: Observable<SelectGraphCompleteAction> = this.actions$
    //     .ofType(select.SELECT_GRAPH)
    //     .withLatestFrom(this.store$)
    //     .switchMap( (state) => {
    //         const graph = state[0].payload as GraphEnum;
    //         const config = state[1][ (graph === GraphEnum.GRAPH_A) ? 'graphA' : 'graphB'].config as GraphConfig;
    //         return Observable.of(new SelectGraphCompleteAction( { graph: graph, config: config}));
    //     });

    constructor(
        private actions$: Actions,
        private store$: Store<State>
    ) { }
}
