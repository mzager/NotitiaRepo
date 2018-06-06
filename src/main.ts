
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
import Amplify from 'aws-amplify';
// if (environment.production) {
enableProdMode();
// }

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: 'us-west-2',
    userPoolId: 'us-west-2_09KsqtrrT',
    userPoolWebClientId: '3lqgr051gsupoa8jo24n1kugfd',
    identityPoolId: 'us-west-2:109beda4-7960-4451-8697-bbbbfb0278ea',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false,
    // OPTIONAL - Configuration for cookie storage
    // cookieStorage: {
    //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //   domain: 'https://oncoscape.v3.sttrcancer.org/',
    //   // OPTIONAL - Cookie path
    //   path: '/',
    //   // OPTIONAL - Cookie expiration in days
    //   expires: 365,
    //   // OPTIONAL - Cookie secure flag
    //   secure: true
    // }
  },
  Storage: {
    region: 'us-west-2',
    bucket: 'oncoscape-user-data',
    identityPoolId: 'us-west-2:109beda4-7960-4451-8697-bbbbfb0278ea'
  },
  API: {
    endpoints: [
      {
        name: 'dataset',
        endpoint: 'https://ce50ir0brf.execute-api.us-west-2.amazonaws.com/prod',
        region: 'us-west-2'
      },
    ]
  }
});

platformBrowserDynamic().bootstrapModule(AppModule);
