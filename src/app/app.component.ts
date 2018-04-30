import { DataLoadIlluminaVcfAction } from './action/data.action';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';
import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private store: Store<any>) {
    Amplify.configure(aws_exports);
  }

}
