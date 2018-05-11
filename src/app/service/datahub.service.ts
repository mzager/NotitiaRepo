// import { User, Project } from './../model/aws-models';
// import { Subject } from 'rxjs/Subject';
// import { Injectable } from '@angular/core';
// import { GoogleAuthService } from 'ng-gapi';
// import { Permission } from '../model/aws-models';
// declare var AWS: any;
// declare var apigClientFactory: any;

// export interface AuthState {
//     state: string; // signedOut, signedIn, mfaRequired, newPasswordRequired
//     user: any;
// }

// @Injectable()
export class DataHubService {

    // public static clientHeaders = {
    //     headers: { 'Content-Type': 'application/json' }
    // };
    // public static SESSION_STORAGE_KEY = 'accessToken';
    // private _authState = new Subject<any>();
    // authStateChange$ = this._authState.asObservable();
    // private client: any;

    // public getToken(): string {
    //     const token = sessionStorage.getItem(DataHubService.SESSION_STORAGE_KEY);
    //     if (!token) {
    //         throw new Error('no token set, authentication required');
    //     }
    //     return sessionStorage.getItem(DataHubService.SESSION_STORAGE_KEY);
    // }

    // public signIn(): void {
    //     this.googleAuth.getAuth()
    //         .subscribe((auth) => {
    //             auth.signIn().then(res => this.signInSuccessHandler(res));
    //         });
    // }


    // // Project Calls
    // public getProject(project: Project): Promise<Array<any>> {
    //     return this.client.projectssGet({ 'projectId': project._id }, {}, DataHubService.clientHeaders);
    // }
    // public createProject(project: Project): Promise<any> {
    //     return this.client.permissionsPost({}, project, DataHubService.clientHeaders);
    // }
    // public updateProject(project: Project): Promise<any> {
    //     return this.client.permissionsPut({}, project, DataHubService.clientHeaders);
    // }
    // public deleteProject(permission: Permission): Promise<any> {
    //     return this.client.permissionsDelete({ 'permissionId': permission._id }, {}, DataHubService.clientHeaders);
    // }

    // // Permissions Calls
    // public getPermissionsByUser(): Promise<Array<any>> {
    //     return this.client.permissionsGet({}, {}, DataHubService.clientHeaders);
    // }
    // public getPermissionsByProject(projectId: string): Promise<Array<any>> {
    //     return this.client.permissionsProjectIdGet({ 'projectId': projectId }, {}, DataHubService.clientHeaders);
    // }
    // public createPermissions(permission: Permission): Promise<any> {
    //     return this.client.permissionsPost({}, permission, DataHubService.clientHeaders);
    // }
    // public updatePermissions(permission: Permission): Promise<any> {
    //     return this.client.permissionsPut({}, permission, DataHubService.clientHeaders);
    // }
    // public deletePermission(permission: Permission): Promise<any> {
    //     return this.client.permissionsDelete({ 'permissionId': permission._id }, {}, DataHubService.clientHeaders);
    // }


    private signInSuccessHandler(res: any) {

        // sessionStorage.setItem(DataHubService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token);
        // const identityPoolId = 'us-west-2:1860ae0e-6343-4afb-a0c2-5bddd99a1be6';
        // const googleToken = res.Zi.id_token;
        // AWS.config.region = 'us-west-2';
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId: identityPoolId,
        //     Logins: {
        //         'accounts.google.com': googleToken
        //     }
        // });
        // // This call populates the AWS Config
        // AWS.config.credentials.get(() => {
        //     const cred = AWS.config.credentials;
        //     this.client = apigClientFactory.newClient({
        //         accessKey: AWS.config.credentials.accessKeyId,
        //         secretKey: AWS.config.credentials.secretAccessKey,
        //         sessionToken: AWS.config.credentials.sessionToken,
        //         region: 'us-west-2'
        //     });
        //     // const p = new Project();
        //     // p
        //     // this.createProject()
        //     // this.getPermissionsByUser().then(v => {
        //     //     debugger;
        //     //     console.log(v);
        //     // });

        // });
    }



    // constructor(private googleAuth: GoogleAuthService) {
    // }

}
