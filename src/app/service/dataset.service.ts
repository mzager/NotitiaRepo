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
  public static dataTables: Array<{
    tbl: string;
    map: string;
    label: string;
    type: CollectionTypeEnum;
  }>;
  private loader$ = new Subject<any>();
  public loaderStatusUpdate = new Subject<string>();

  public deleteAllDataSets(): Promise<any> {
    return new Promise((resolve, reject) => {
      Dexie.getDatabaseNames().then((dbNames: Array<string>) => {
        Promise.all(dbNames.map(dbName => Dexie.delete(dbName))).then(resolve);
      });
    });
  }
  public getDataset(dataset: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Dexie.exists('notitia-' + dataset).then(exists => {
        if (exists) {
          DatasetService.db = new Dexie('notitia-' + dataset);
          DatasetService.db.open().then(v => {
            DatasetService.db
              .table('dataset')
              .where({ name: dataset })
              .first()
              .then(result => {
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
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Encoding', 'gzip');
<<<<<<< HEAD

=======
>>>>>>> a947a94743ca0203655e535e63bac428d1227be3
    if (manifest.hasOwnProperty('token')) {
      headers.append('zager', manifest.token);
    }
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
        // Ensure all matrices are in schema
        response.files
          .filter(v => !v.name.toLowerCase().indexOf('matrix'))
          .map(v => {
            return v.name
              .replace('matrix ', '')
              .replace('matrix_', '')
              .toLowerCase()
              .replace(/_/gi, '');
          })
          .forEach(matrix => {
            response.schema[matrix] = 'm';
            response.schema[matrix + 'Map'] = 's';
          });
        // Ensure Patient Keys Are LCase
        if (response.schema.hasOwnProperty('patient')) {
          response.schema.patient = response.schema.patient.toLowerCase();
        }
<<<<<<< HEAD
=======
        if (response.schema.hasOwnProperty('sample')) {
          response.schema.sample = response.schema.sample.toLowerCase();
        }
>>>>>>> a947a94743ca0203655e535e63bac428d1227be3
        Dexie.exists('notitia-' + manifest.uid).then(exists => {
          if (exists) {
            this.loader$.next(manifest);
            return;
          }
          // Add Chort Table Defs
          response.schema.pathways = '++, n';
          response.schema.cohorts = '++, n';
          response.schema.genesets = '++, n';
<<<<<<< HEAD
=======
          // TODO: Temp Patch For Sample Meta Data
          if (!response.schema.hasOwnProperty('sampleMeta')) {
            response.schema.sampleMeta = 'key';
          }

>>>>>>> a947a94743ca0203655e535e63bac428d1227be3
          const db = (DatasetService.db = new Dexie('notitia-' + manifest.uid));
          this.loaderStatusUpdate.next('Loading Metadata');
          DatasetService.db.on('versionchange', function(event) {});
          DatasetService.db.on('blocked', () => {});
          db.version(1).stores(response.schema);
<<<<<<< HEAD
          // Patient Meta Data
          const fields = Object.keys(response.fields).map(v => ({
            ctype: CollectionTypeEnum.PATIENT,
            key: v.toLowerCase(),
            label: v.replace(/_/gi, ' '),
            tbl: 'patient',
            type: Array.isArray(response.fields[v]) ? 'STRING' : 'NUMBER',
            values: response.fields[v]
          }));

          const events = Object.keys(response.events).map(key => ({
            type: response.events[key],
            subtype: key
          }));
          const tbls = response.files
            .map(v => {
              const dt = v.dataType.toLowerCase();
              const name = v.name
                .replace('matrix ', '')
                .replace('matrix_', '')
                .toLowerCase()
                .replace(/_/gi, '');
              return dt === 'clinical'
                ? {
                    tbl: 'patient',
                    map: 'patientMap',
                    label: 'Patient',
                    ctype: CollectionTypeEnum.PATIENT
                  }
                : dt === 'events'
                  ? { tbl: name, map: name + 'Map', label: name, ctype: CollectionTypeEnum.EVENT }
                  : dt === 'matrix'
                    ? {
                        tbl: name,
                        map: name + 'Map',
                        label: name,
                        ctype: CollectionTypeEnum.MATRIX
                      }
                    : dt === 'gistic'
                      ? {
                          tbl: name,
                          map: name + 'Map',
                          label: name,
                          ctype: CollectionTypeEnum.GISTIC
                        }
                      : dt === 'gistic_threshold'
                        ? {
                            tbl: name,
                            map: name + 'Map',
                            label: name,
                            ctype: CollectionTypeEnum.GISTIC_THRESHOLD
                          }
                        : dt === 'mut'
                          ? {
                              tbl: name,
                              map: name + 'Map',
                              label: name,
                              ctype: CollectionTypeEnum.MUTATION
                            }
                          : dt === 'rna'
                            ? {
                                tbl: name,
                                map: name + 'Map',
                                label: name,
                                ctype: CollectionTypeEnum.RNA
                              }
                            : null;
            })
            .filter(v => v);
          const dataset = {
            name: manifest.uid,
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
              if (file.dataType === '') {
                file.dataType = 'matrix';
              }
              return new Promise((resolve, reject) => {
                const loader = new Worker('/assets/loader.js');
                const onMessage = msgEvent => {
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
                loader.postMessage({
                  cmd: 'load',
                  disease: manifest.disease,
                  uid: manifest.uid,
                  baseUrl: manifest.baseUrl,
                  file: file,
                  token: manifest.token ? manifest.token : ''
                });
              });
            })
          ).then(v => {
            this.loader$.next(manifest);
            this.loaderStatusUpdate.next('Preforming Initial Analysis');
          });
=======
          if (response.hasOwnProperty('version')) {
            const patient = Object.keys(response.patient).map(v => ({
              ctype: CollectionTypeEnum.PATIENT,
              key: v
                .toLowerCase()
                .trim()
                .replace(/ /gi, '_'),
              label: v.toLowerCase().trim(),
              tbl: 'patient',
              type: Array.isArray(response.patient[v]) ? 'STRING' : 'NUMBER',
              values: response.patient[v]
            }));
            const sample = Object.keys(response.sample).map(v => ({
              ctype: CollectionTypeEnum.SAMPLE,
              key: v
                .toLowerCase()
                .trim()
                .replace(/ /gi, '_'),
              label: v.toLowerCase().trim(),
              tbl: 'sample',
              type: Array.isArray(response.sample[v]) ? 'STRING' : 'NUMBER',
              values: response.sample[v]
            }));
            const events = Object.keys(response.events).map(key => ({
              type: response.events[key],
              subtype: key
            }));

            const tbls = response.files
              .map(file => {
                const name = file.name.toLowerCase().trim();
                switch (file.dataType) {
                  case 'patient':
                    return {
                      tbl: 'patient',
                      map: 'patientMap',
                      label: 'Patient',
                      ctype: CollectionTypeEnum.PATIENT
                    };
                  case 'sample':
                    return {
                      tbl: 'sample',
                      map: 'sampleMap',
                      label: 'Sample',
                      ctype: CollectionTypeEnum.SAMPLE
                    };
                  case 'psmap':
                    return null;
                  case 'events':
                    return {
                      tbl: name,
                      map: name + 'Map',
                      label: name,
                      ctype: CollectionTypeEnum.EVENT
                    };
                  case 'mut':
                    return {
                      tbl: name,
                      map: name + 'Map',
                      label: name,
                      ctype: CollectionTypeEnum.MUTATION
                    };
                  case 'matrix':
                    return {
                      tbl: name,
                      map: name + 'Map',
                      label: name,
                      ctype: CollectionTypeEnum.MATRIX
                    };
                }
              })
              .filter(v => v);
            const dataset = {
              version: response.version,
              name: manifest.uid,
              events: events,
              patients: patient,
              samples: sample,
              tables: tbls
            };

            // Add Dataset + Meta Info
            db.table('dataset').add(dataset);
            db.table('patientMeta').bulkAdd(patient);
            db.table('sampleMeta').bulkAdd(sample);
            this.loaderStatusUpdate.next('Metadata Loaded');

            Promise.all(
              response.files.filter(file => file.name !== 'manifest.json').map(file => {
                if (file.dataType === '') {
                  file.dataType = 'matrix';
                }
                return new Promise((resolve, reject) => {
                  const loader = new Worker('/assets/loader.js');
                  const onMessage = msgEvent => {
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
                  loader.postMessage({
                    cmd: 'load',
                    version: response.version,
                    disease: manifest.disease,
                    uid: manifest.uid,
                    baseUrl: manifest.baseUrl,
                    file: file,
                    token: manifest.token ? manifest.token : ''
                  });
                });
              })
            ).then(v => {
              this.loader$.next(manifest);
              this.loaderStatusUpdate.next('Preforming Initial Analysis');
            });
          } else {
            // V1 Data Mode

            // Patient Meta Data
            const fields = Object.keys(response.fields).map(v => ({
              ctype: CollectionTypeEnum.PATIENT,
              key: v.toLowerCase(),
              label: v.replace(/_/gi, ' '),
              tbl: 'patient',
              type: Array.isArray(response.fields[v]) ? 'STRING' : 'NUMBER',
              values: response.fields[v]
            }));
            const events = Object.keys(response.events).map(key => ({
              type: response.events[key],
              subtype: key
            }));
            const tbls = response.files
              .map(v => {
                const dt = v.dataType.toLowerCase();
                const name = v.name
                  .replace('matrix ', '')
                  .replace('matrix_', '')
                  .toLowerCase()
                  .replace(/_/gi, '');
                return dt === 'clinical'
                  ? {
                      tbl: 'patient',
                      map: 'patientMap',
                      label: 'Patient',
                      ctype: CollectionTypeEnum.PATIENT
                    }
                  : dt === 'events'
                    ? { tbl: name, map: name + 'Map', label: name, ctype: CollectionTypeEnum.EVENT }
                    : dt === 'matrix'
                      ? {
                          tbl: name,
                          map: name + 'Map',
                          label: name,
                          ctype: CollectionTypeEnum.MATRIX
                        }
                      : dt === 'gistic'
                        ? {
                            tbl: name,
                            map: name + 'Map',
                            label: name,
                            ctype: CollectionTypeEnum.GISTIC
                          }
                        : dt === 'gistic_threshold'
                          ? {
                              tbl: name,
                              map: name + 'Map',
                              label: name,
                              ctype: CollectionTypeEnum.GISTIC_THRESHOLD
                            }
                          : dt === 'mut'
                            ? {
                                tbl: name,
                                map: name + 'Map',
                                label: name,
                                ctype: CollectionTypeEnum.MUTATION
                              }
                            : dt === 'rna'
                              ? {
                                  tbl: name,
                                  map: name + 'Map',
                                  label: name,
                                  ctype: CollectionTypeEnum.RNA
                                }
                              : null;
              })
              .filter(v => v);
            const dataset = {
              name: manifest.uid,
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
                if (file.dataType === '') {
                  file.dataType = 'matrix';
                }
                return new Promise((resolve, reject) => {
                  const loader = new Worker('/assets/loader.js');
                  const onMessage = msgEvent => {
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
                  loader.postMessage({
                    cmd: 'load',
                    disease: manifest.disease,
                    uid: manifest.uid,
                    baseUrl: manifest.baseUrl,
                    file: file,
                    token: manifest.token ? manifest.token : ''
                  });
                });
              })
            ).then(v => {
              this.loader$.next(manifest);
              this.loaderStatusUpdate.next('Preforming Initial Analysis');
            });
          }
>>>>>>> a947a94743ca0203655e535e63bac428d1227be3
        });
      });
    return this.loader$;
  }

  constructor(private http: HttpClient) {}
}
