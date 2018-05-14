import { UnsafeAction } from './../action/unsafe.action';
import { UserDataSet } from './../model/user-data-set.model';
import * as user from './../action/user.action';
export interface State {
    userData: any;
    userDatasets: Array<UserDataSet>;
}

const initialState: State = {
    userData: null,
    userDatasets: []
};

export function reducer(state = initialState, action: UnsafeAction): State {
    switch (action.type) {
        case user.USER_LOGIN:
            return Object.assign({}, state, { userData: action.payload });
        case user.USER_LOGOUT:
            return Object.assign({}, state, { userData: null });
        case user.USER_DATASETS_LOADED:
            return Object.assign({}, state, { userDatasets: action.payload });
        default:
            return state;
    }
}

export const getUserData = (state: State) => state.userData;
export const getUserDataSets = (state: State) => state.userDatasets;

