import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

export interface AuthState {
    state: string; // signedOut, signedIn, mfaRequired, newPasswordRequired
    user: any;
}

@Injectable()
export class DataHubService {

    private gapiAuth: any;
    private _authState = new Subject<AuthState>();
    authStateChange$ = this._authState.asObservable();

    onSignIn(user: any): void {

    }


    login(user: any): void {



    }
    logout(): void {
        // window['gapi'].auth2.getAuthInstance().signOut().then(function () {
        //     console.log('User signed out.');
        // });
    }

    init(): void {
        const a = arguments;
        // this.gapiAuth;
        // debugger;

    }
    constructor() {
        this.gapiAuth = window['gapi'];
        // gapi.load('auth2', thins.init);
        // gapi.load('client:auth2', this.init);

        // gapi.load('auth2', initSigninV2);

        // debugger;
        // // window['gapi'].auth2.getAuthInstance().signIn().then(function () {
        // //     debugger;
        // //     console.log('signin');
        // // });
    }

}
