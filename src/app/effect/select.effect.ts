import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';







import { State } from './../reducer/layout.reducer';

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
        // private actions$: Actions,
        // private store$: Store<State>
    ) { }
}
