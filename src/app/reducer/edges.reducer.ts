import * as e from 'app/model/enum.model';
import { COMPUTE_EDGES_COMPLETE } from './../action/compute.action';
import { EdgeConfigModel, EdgeDataModel } from './../component/visualization/edges/edges.model';
import { DataDecorator } from './../model/data-map.model';

export const DATA_DECORATOR_ADD = '[GRAPH] Data Decorator Add';
export const DATA_DECORATOR_DEL = '[GRAPH] Data Decorator Remove';

export interface State {
    config: EdgeConfigModel;
    data: EdgeDataModel;
    decorators: Array<DataDecorator>;
}

const initialState: State = {
    config: new EdgeConfigModel(),
    data: null,
    decorators: []
};

export function reducer(state = initialState, action: any): State {
    switch (action.type) {
        case COMPUTE_EDGES_COMPLETE:
            return Object.assign({}, state,
                { data: action.payload.data, config: action.payload.config });
        case DATA_DECORATOR_ADD:
            if (action.payload.config.graph !== e.GraphEnum.EDGES) { return state; }
            const decorator = action.payload.decorator;
            const decorators = state.decorators.filter(v => v.type !== decorator.type);
            decorators.push(decorator);
            return Object.assign({}, state, { decorators: decorators });
        case DATA_DECORATOR_DEL:
            if (action.payload.config.graph !== e.GraphEnum.EDGES) { return state; }
            return Object.assign({}, state, { decorators: state.decorators.filter(v => v.type !== action.payload.decorator.type) });
        default:
            return state;
    }
}

export const getConfig = (state: State) => state.config;
