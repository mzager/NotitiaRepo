import { EntityTypeEnum } from './../model/enum.model';
import { COMPUTE_SELECT_SAMPLES_COMPLETE, COMPUTE_SELECT_MARKERS_COMPLETE, COMPUTE_SELECT_HIDE } from './../action/compute.action';
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
        case COMPUTE_SELECT_SAMPLES_COMPLETE:
            return Object.assign({}, state,
                { selection: action.payload.selection, stats: action.payload.stats, visible: true });
        case COMPUTE_SELECT_MARKERS_COMPLETE:
            return Object.assign({}, state,
                { selection: action.payload.selection, stats: action.payload.stats, visible: true });
        case COMPUTE_SELECT_HIDE:
            return Object.assign({}, state,
                { selection: { type: EntityTypeEnum.NONE, ids: [] }, stats: [], visible: false });
        default:
            return state;
    }
}

export const getVisible = (state: State) => state.visible;
export const getSelection = (state: State) => state.selection;
export const getStats = (state: State) => state.stats;
