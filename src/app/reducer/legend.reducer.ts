import { UnsafeAction } from './../action/unsafe.action';
import { Action, ActionReducer } from '@ngrx/store';
import { Legend } from '../model/legend.model';

export const createLegendReducer = (type: String) => {
    const ADD = `${type}_ADD_LEGEND`;
    const DEL = `${type}_DEL_LEGEND`;
    return (state: any = [], action: UnsafeAction) => {
        switch (action.type) {
            case ADD:
                return [...state, action.payload];
            case DEL:
                return state.filter(legend => legend === action.payload);
            default:
                return state;
        }
    };
};
