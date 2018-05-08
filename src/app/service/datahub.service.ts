import { Subject } from 'rxjs/Subject';
import Amplify, { APIClass, StorageClass, AuthClass, AnalyticsClass, Auth } from 'aws-amplify';
import { Injectable } from '@angular/core';

export interface AuthState {
    state: string; // signedOut, signedIn, mfaRequired, newPasswordRequired
    user: any;
}

@Injectable()
export class DataHubService {

    // private _auth: AuthClass;
    // private _analytics: AnalyticsClass;
    // private _storage: StorageClass;
    // private _api: APIClass;
    // private _cache: any;
    // private _pubsub: any;
    private _authState = new Subject<AuthState>();
    authStateChange$ = this._authState.asObservable();


    constructor() {

    }

    login(user: any): void {
        debugger;

    }
    logout(): void {
        window['gapi'].auth2.getAuthInstance().signOut().then(function () {
            console.log('User signed out.');
        });
    }

}
