import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CollectionTypeEnum } from './../model/enum.model';
import { HttpClient } from './http.client';

@Injectable()
export class DatasetService {

  // Can I make these private?
  public static API_PATH = '/assets/tcga/';
  public static db: Dexie;
  public static dataTables: Array<{ tbl: string, map: string, label: string, type: CollectionTypeEnum }>;
  private loader$ = new Subject<any>();
  public loaderStatusUpdate = new Subject<string>();


  public getDataset(dataset: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Dexie.exists('notitia-' + dataset).then(exists => {
        if (exists) {
          DatasetService.db = new Dexie('notitia-' + dataset);
          DatasetService.db.open().then(v => {
            DatasetService.db.table('dataset').where({ name: dataset }).first().then(result => {
              resolve(result);
            });
          });
        } else {
          reject();
        }
      });
    });
  }

  public load(manifest: any): Observable<any> {
    const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    headers.append('Accept-Encoding', 'gzip');
    const requestInit: RequestInit = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };
    this.loaderStatusUpdate.next('Creating Local Database');
    fetch(manifest.manifest, requestInit)
      .then(response => response.json())
      .then(response => {
        Dexie.exists('notitia-' + manifest.disease)
          .then(exists => {
            if (exists) {
              this.loader$.next(manifest);
              return;
            }
            // Add Chort Table Defs
            response.schema.pathways = '++, n';
            response.schema.cohorts = '++, n';
            response.schema.genesets = '++, n';
            const db = DatasetService.db = new Dexie('notitia-' + manifest.disease);
            this.loaderStatusUpdate.next('Loading Metadata');
            DatasetService.db.on('versionchange', function (event) { });
            DatasetService.db.on('blocked', () => { });
            db.version(1).stores(response.schema);
            // Patient Meta Data
            const fields = Object.keys(response.fields).map(v => ({
              ctype: CollectionTypeEnum.PATIENT,
              key: v,
              label: v.replace(/_/gi, ' '),
              tbl: 'patient',
              type: Array.isArray(response.fields[v]) ? 'STRING' : 'NUMBER',
              values: response.fields[v]
            }));

            const events = Object.keys(response.events).map(key => ({ type: response.events[key], subtype: key }));
            const tbls = response.files.map(v => {
              const dt = v.dataType.toLowerCase();
              return (dt === 'clinical') ?
                { tbl: 'patient', map: 'patientMap', label: 'Patient', ctype: CollectionTypeEnum.PATIENT } :
                (dt === 'events') ?
                  { tbl: v.name, map: v.name + 'Map', label: v.name, ctype: CollectionTypeEnum.EVENT } :
                  (dt === 'gistic') ?
                    { tbl: v.name, map: v.name + 'Map', label: v.name, ctype: CollectionTypeEnum.GISTIC } :
                    (dt === 'gistic_threshold') ?
                      { tbl: v.name, map: v.name + 'Map', label: v.name, ctype: CollectionTypeEnum.GISTIC_THRESHOLD } :
                      (dt === 'mut') ?
                        { tbl: v.name, map: v.name + 'Map', label: v.name, ctype: CollectionTypeEnum.MUTATION } :
                        (dt === 'rna') ?
                          { tbl: v.name, map: v.name + 'Map', label: v.name, ctype: CollectionTypeEnum.RNA } :
                          null;
            }).filter(v => v);
            const dataset = {
              name: manifest.disease,
              events: events,
              fields: fields,
              tables: tbls
            };

            // Add Dataset + Meta Info
            db.table('dataset').add(dataset);
            db.table('patientMeta').bulkAdd(fields);
            this.loaderStatusUpdate.next('Metadata Loaded');
            Promise.all(
              response.files.filter(file => file.name !== 'manifest.json').map(file => {
                return new Promise((resolve, reject) => {
                  const loader = new Worker('/assets/loader.js');
                  const onMessage = (msgEvent) => {
                    const msg = JSON.parse(msgEvent.data);
                    if (msg.cmd === 'terminate') {
                      loader.removeEventListener('message', onMessage);
                      loader.terminate();
                      resolve();
                    } else {
                      this.loaderStatusUpdate.next(msg.msg);
                    }
                  };
                  loader.addEventListener('message', onMessage);
                  loader.postMessage({ cmd: 'load', disease: manifest.disease, file: file });
                });
              })
            ).then(v => {
              this.loader$.next(manifest);
              this.loaderStatusUpdate.next('Preforming Initial Analysis');
            });
          });
      });
    return this.loader$;
  }

  constructor(private http: HttpClient) { }
}
