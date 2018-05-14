import { Action } from '@ngrx/store';

export const USER_LOGIN = '[User] Login';
export const USER_LOGOUT = '[User] Logout';
export const USER_DATASET_ADDED = '[User] Dataset Added';
export const USER_DATASET_DELETED = '[User] Dataset Deleted';
export const USER_DATASETS_LOAD = '[User] Datasets Load';
export const USER_DATASETS_LOADED = '[User] Datasets Loaded';

// Action Classes
export class UserLoginAction implements Action {
    readonly type: string = USER_LOGIN;
    constructor(public payload: any) { }
}
export class UserLogoutAction implements Action {
    readonly type: string = USER_LOGOUT;
    constructor(public payload: any) { }
}
export class UserDatasetAddedAction implements Action {
    readonly type: string = USER_DATASET_ADDED;
    constructor(public payload: any) { }
}
export class UserDatasetDeletedAction implements Action {
    readonly type: string = USER_DATASET_DELETED;
    constructor(public payload: any) { }
}
export class UserDatasetsLoad implements Action {
    readonly type: string = USER_DATASETS_LOAD;
    constructor(public payload: any) { }
}
export class UserDatasetsLoaded implements Action {
    readonly type: string = USER_DATASETS_LOADED;
    constructor(public payload: any) { }
}

// Action Type
export type Actions =
    UserLoginAction | UserLogoutAction |
    UserDatasetAddedAction | UserDatasetDeletedAction |
    UserDatasetsLoad | UserDatasetsLoaded;

