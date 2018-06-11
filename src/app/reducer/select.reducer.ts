import { EntityTypeEnum } from './../model/enum.model';
import { SELECT_SAMPLES_COMPLETE, SELECT_MARKERS_COMPLETE } from './../action/compute.action';
import { UnsafeAction } from './../action/unsafe.action';
import { ChartSelection } from './../model/chart-selection.model';

export interface State {
    visible: boolean;
    selection: ChartSelection;
    stats: Array<any>;
}

const initialState: State = {
    visible: false,
    selection: { type: EntityTypeEnum.NONE, ids: [] },
    stats: []
};

export function reducer(state = initialState, action: UnsafeAction): State {
    switch (action.type) {
        case SELECT_SAMPLES_COMPLETE:
            return Object.assign({}, state,
                { selection: action.payload.selection, stats: action.payload.stats, visible: true });
        case SELECT_MARKERS_COMPLETE:
            return Object.assign({}, state,
                { selection: action.payload.selection, stats: action.payload.stats, visible: true });
        default:
            return state;
    }
}

export const getVisible = (state: State) => state.visible;
export const getSelection = (state: State) => state.selection;
export const getStats = (state: State) => state.stats;
