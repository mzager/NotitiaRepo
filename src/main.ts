
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';
import Amplify from 'aws-amplify';
if (environment.production) {
  enableProdMode();
}

Amplify.configure({
  Auth: {
    // REQUIRED - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-west-2:ae6c7447-b915-4e5b-b369-c103f6fdfa81',
    // REQUIRED - Amazon Cognito Region
    region: 'us-west-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-west-2_ChZkbi2c9',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2ge2vnueo2e7mkv99u23tctgjf',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
    // OPTIONAL - Configuration for cookie storage
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: 'http://oncoscape.v3.sttrcancer.org/',
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - Cookie secure flag
      secure: true
    }
  }
});

platformBrowserDynamic().bootstrapModule(AppModule);
