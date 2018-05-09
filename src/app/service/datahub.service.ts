import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
declare var AWS: any;
export interface AuthState {
    state: string; // signedOut, signedIn, mfaRequired, newPasswordRequired
    user: any;
}

@Injectable()
export class DataHubService {

    public static SESSION_STORAGE_KEY = 'accessToken';
    private user: any;
    private _authState = new Subject<AuthState>();
    authStateChange$ = this._authState.asObservable();


    public getToken(): string {
        const token = sessionStorage.getItem(DataHubService.SESSION_STORAGE_KEY);
        if (!token) {
            throw new Error("no token set , authentication required");
        }
        return sessionStorage.getItem(DataHubService.SESSION_STORAGE_KEY);
    }

    public signIn(): void {
        this.googleAuth.getAuth()
            .subscribe((auth) => {
                auth.signIn().then(res => this.signInSuccessHandler(res));
            });
    }

    private signInSuccessHandler(res: any) {

        const identityPoolId = 'us-west-2:1860ae0e-6343-4afb-a0c2-5bddd99a1be6';
        const tok = res.Zi.id_token;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: identityPoolId
        });
        AWS.config.credentials.get(response => {
            debugger;
        });


        // const iam = new AWS.IAM();
        // const apigateway = new AWS.APIGateway();

        debugger;
        // this.user = res;
        sessionStorage.setItem(
            DataHubService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
        );
    }

    constructor(private googleAuth: GoogleAuthService) {
    }

}
