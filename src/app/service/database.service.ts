
import { DataField } from './../model/data-field.model';
import { DataCollection } from './../model/data-collection.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

declare var PouchDB;

@Injectable()
export class DatabaseService {

  private DB_NAME = 'Notitia';
  private db: any;

  constructor() {
    this.db = new PouchDB(this.DB_NAME, {adapter: 'idb'});
  }

  private upsert(key: string, data: any): Promise<any> {
      return this.db.get(key).catch(err => {
        return {};
      }).then(doc => {
        const d2 = Object.assign({}, data, {_id: key, _rev: doc._rev});
        return this.db.put(d2).then(
          res => {
            return {updated: true, rev: res.rev, id: key}; },
          err => {
            return this.upsert(key, data); }
        );
      });
  }

  upsertData(key: string, data: any): Observable<any> {
      return Observable.fromPromise(this.upsert(key, data));
  }

  private selectDataFields(key: string): Promise<Array<DataField>> {
    return this.db.get(key).catch(err => {
        return [] as Array<DataField>;
      }).then(doc => {
        return doc.patientDataFields as Array<DataField>;
      });
  }

  private selectMetadata(key: string): Promise<any> {
       return this.db.get(key).catch(err => {
        return [] as Array<DataField>;
      }).then(doc => {
        if (doc.length === 0) { return null; }
        return {
          patientFields: doc.patientDataFields,
          events: doc.patientEventsTypes,
          molec: doc.molecularData.map( v => v.name )
        };
      });
  }

  getDataFields(key: string): Observable<any> {
      return Observable.fromPromise(this.selectDataFields(key));
  }
  getMetadata(key: string): Observable<any> {
      return Observable.fromPromise(this.selectMetadata(key));
  }

}
