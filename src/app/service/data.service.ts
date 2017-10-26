import { DataFieldFactory } from 'app/model/data-field.model';
import { DataField } from './../model/data-field.model';
import { DataCollection } from './../model/data-collection.model';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';
import { Observable } from 'rxjs/Observable';
import Dexie from 'dexie';


@Injectable()
export class DataService {

  public static db: Dexie;

  public static API_PATH = 'https://dev.oncoscape.sttrcancer.io/api/';

  getGeneMap(): Observable<any> {
    return Observable.fromPromise( DataService.db.table('genemap').toArray() );
  }
  getChromosomeGeneCoords(): Observable<any> {
    return Observable.fromPromise( DataService.db.table('genecoords').toArray() );
  }
  getChromosomeBandCoords(): Observable<any> {
    return Observable.fromPromise( DataService.db.table('bandcoords').toArray() );
  }
  getGeneSetByCategory(categoryCode: string): Observable<any> {
    return this.http
    .get(DataService.API_PATH +
      'z_lookup_geneset/%7B%22$fields%22:[%22name%22,%22hugo%22,%22summary%22],%20%22$query%22:%7B%22category%22:%22' +
      categoryCode +
      '%22%7D%20%7D')
    .map(res => res.json());
  }
  getGeneSetQuery(categoryCode: string, searchTerm: string): Observable<any> {
    return this.http
    .get(DataService.API_PATH +
      'z_lookup_geneset/%20%7B%22category%22%3A%22' +
      categoryCode +
      '%22%2C%20%20%22%24text%22%3A%20%7B%20%22%24search%22%3A%20%22' +
      searchTerm +
      '%22%20%7D%20%20%7D')
    .map(res => res.json());
  }
  getGeneSetCategories(): Observable<any> {
    return this.http
      .get(DataService.API_PATH + 'z_lookup_geneset_categories')
      .map(res => res.json() );
  }

  constructor(private http: HttpClient) {

      Dexie.exists('notitia').then( exists => {
        DataService.db = new Dexie('notitia');

        if (exists) {
          DataService.db.open();
          DataService.db.on('versionchange', function (event) { });
          DataService.db.on('blocked',  () => { });
          return;
        }
        DataService.db.version(1).stores({
          genecoords: 'gene, chr, arm, type',
          bandcoords: '++id',
          genemap: 'hugo',
          genelinks: '++id, source, target'
        });
        DataService.db.open();
        DataService.db.on('versionchange', function (event) { });
        DataService.db.on('blocked',  () => { });

        requestAnimationFrame( v => {
          DataService.db.table('genemap').count().then( count => {
            if (count > 0) { return; }
            const genecoords = this.http.get('assets/data/genecoords.json').map(res => res.json());
            const bandcoords = this.http.get('assets/data/bandcoords.json').map(res => res.json());
            const genemap    = this.http.get('assets/data/genemap.json').map(res => res.json());
            const genelinks  = this.http.get('assets/data/genelinks.json').map(res => res.json());
            


            Observable.zip( genecoords, bandcoords, genemap, genelinks ).subscribe( result => {
              const geneLinksData = result[3].map( d => ({ source: d[0], target: d[1], tension: d[2]}));
              DataService.db.table('genecoords').bulkAdd(result[0]);
              DataService.db.table('bandcoords').bulkAdd(result[1]);
              DataService.db.table('genemap').bulkAdd(result[2]);
              DataService.db.table('genelinks').bulkAdd(geneLinksData);
            });
          });
      });
    });
  }
}
