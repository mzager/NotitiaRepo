import { DataCollection } from './../model/data-collection.model';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class NcbiService {
  private API_PATH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

  constructor(private http: HttpClient) { }

  resolveGenes(genes: Array<string>): Observable<any> {
    return this.http
      .post(this.API_PATH + 'lookup/symbol/homo_sapiens', genes)
      .map(res => {
          return res.json();
      });
  }
}
