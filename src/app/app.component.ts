import { DataLoadIlluminaVcfAction } from './action/data.action';
import { IlluminaService } from './service/illumina.service';
import { Store } from '@ngrx/store';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //constructor(private store: Store<any>, private illuminaService: IlluminaService) {
  constructor(private store: Store<any>) {
    // illuminaService.onData.subscribe( data => {
    //   store.dispatch(new DataLoadIlluminaVcfAction(data));
    // });
  }

}
