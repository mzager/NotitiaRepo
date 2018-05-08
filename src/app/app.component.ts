import { DataHubService } from './service/datahub.service';
import { AmplifyService } from 'aws-amplify-angular';
import { DataLoadIlluminaVcfAction } from './action/data.action';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private store: Store<any>, public amplifyService: AmplifyService, public datahubService: DataHubService) {
    // debugger;


    // datahubService.authStateChange$.subscribe(authState => {

    // });

    // Auth.federatedSignIn('google', {
    //   // the JWT token
    //   token: id_token,
    //   // the expiration time
    //   expires_at
    // },
    //   // a user object
    //   user
    // ).then(() => {
    //   // ...
    // });
    // )




    //   this.amplify = amplify;
    //   this.amplify.authStateChange$
    //     .subscribe(authState => {

    //       // this.authenticated = authState.state === 'signedIn';
    //       // if (!authState.user) {
    //       //   this.user = null;
    //       // } else {
    //       //   this.user = authState.user;
    //       // }
    //     });
  }

}
