import { CollectionTypeEnum } from './../model/enum.model';
import { Observable } from 'rxjs/Observable';
import { DataFieldFactory } from 'app/model/data-field.model';
import { DataField } from './../model/data-field.model';
import { DataCollection } from './../model/data-collection.model';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';
import * as jstat from 'jstat';
import Dexie from 'dexie';



@Injectable()
export class DatasetService {

  // Can I make these private?
  public static API_PATH = '/assets/tcga/';
  public static db: Dexie;
  public static dataTables: Array<{ tbl: string, map: string, label: string, type: CollectionTypeEnum }>;


  public getDataset(dataset: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Dexie.exists('notitia-dataset').then(exists => {
        if (exists) {
          DatasetService.db = new Dexie('notitia-dataset');
          DatasetService.db.open().then(v => {
            DatasetService.db.table('dataset').where({ name: dataset }).first().then( result => {
              resolve(result);
            });
          });
        } else {
          reject();
        }
      });
    });
  }


  public loadTcga(disease: any): Observable<any> {

    disease.name = 'gbm';
    return Observable.fromPromise(Dexie.exists('notitia-dataset'))
      .switchMap(exists => {
        if (exists) { Dexie.delete('notitia-dataset'); }
        return Observable.forkJoin([
          this.http.get(DatasetService.API_PATH + disease.name + '.json'),
          this.http.get(DatasetService.API_PATH + disease.name + '-events.json')
          ]);
      })
      .flatMap((res: any) => {

        const cm = res[0].json();
        let events = res[1].json();

        const db = DatasetService.db = new Dexie('notitia-dataset');
        DatasetService.db.on('versionchange', function (event) { });
        DatasetService.db.on('blocked', () => { });

        db.version(1).stores({
          dataset: 'name',
          events: '++, p',
          gistic: 'm',
          gisticT: 'm',
          gisticMap: 's',
          mut: 'm',
          gismutMap: 's',
          rna: 'm',
          rnaMap: 's',
          patient: 'p,' + cm.clinical.fields.map(field => field.key).join(','),
          patientMap: 'p',
          patientMeta: 'key',
          patientSampleMap: 's, p'
        });


        // Events
        events = events.events.map(v => {
            return {
              p: v[0],
              type: events.typeMap[v[1]],
              subtype: events.subtypeMap[v[2]],
              start: new Date( v[3] * 1000),
              end: new Date( v[4] * 1000),
              data: v[5]
              };
          });


        const patientSampleMap = cm.gistic.samples.map( v => ({s: v, p: v.substr(0, 7) }));

        // Gistic
        const gistic = cm.gistic.markers.map((marker, m) => {
          const data = cm.gistic.samples.map((sample, s) => cm.gistic.data[s][m]);
          return {
            m: marker,
            d: data,
            mean: jstat.mean(data),
            median: jstat.median(data),
            mode: jstat.mode(data),
            min: jstat.min(data),
            max: jstat.max(data),
            quartiles: jstat.quartiles(data),
          };
        });

        // Gistic Map
        const gisticMap = cm.gistic.samples.map((s, i) => ({ s: s, i: i }));

        // Rna
        const rna = cm.rna.markers.map((marker, m) => {
          const data = cm.rna.samples.map((sample, s) => cm.rna.data[s][m]);
          return {
            m: marker,
            d: data,
            mean: jstat.mean(data),
            median: jstat.median(data),
            mode: jstat.mode(data),
            min: jstat.min(data),
            max: jstat.max(data),
            quartiles: jstat.quartiles(data),
          };
        });

        // Rna Map
        const rnaMap = cm.rna.samples.map((s, i) => ({ s: s, i: i }));

        const mutations = {
          'Missense_Mutation': 1,
          'Silent': 2,
          'Frame_Shift_Del': 4,
          'Splice_Site': 8,
          'Nonsense_Mutation': 16,
          'Frame_Shift_Ins': 32,
          'RNA': 64,
          'In_Frame_Del': 128,
          'In_Frame_Ins': 256,
          'g2': 512,
          'g1': 1024,
          'g0': 2048,
          'gm1': 4096,
          'gm2': 8192
        };

        // Gistic Thresholded
        const gisticT = cm.gismut.markers.map((marker, m) => {
          const rv = {
            m: marker,
            mean: 0,
            median: 0,
            mode: 0,
            min: 0,
            max: 0,
            quartiles: [],
            d: cm.gismut.samples.map((sample, s) => {
              const score = cm.gismut.data[s][m];
              // tslint:disable-next-line:no-bitwise
              return (score & mutations.g0) ? 0 :
                // tslint:disable-next-line:no-bitwise
                (score & mutations.g1) ? 1 :
                  // tslint:disable-next-line:no-bitwise
                  (score & mutations.g2) ? 2 :
                    // tslint:disable-next-line:no-bitwise
                    (score & mutations.gm1) ? -1 :
                      // tslint:disable-next-line:no-bitwise
                      (score & mutations.gm2) ? - 2 :
                        0;
            })
          };
          rv.mean = jstat.mean(rv.d);
          rv.median = jstat.median(rv.d);
          rv.mode = jstat.mode(rv.d);
          rv.min = jstat.min(rv.d);
          rv.max = jstat.max(rv.d);
          rv.quartiles = jstat.quartiles(rv.d);
          return rv;
        });

        // Mutation (TODO: Remove Nested Lookup In Loop res.gismut.data[s][m])
        const mut = cm.gismut.markers.map((marker, m) => {
          const rv = {
            m: marker,
            mean: 0,
            median: 0,
            mode: 0,
            min: 0,
            max: 0,
            quartiles: [],
            d: cm.gismut.samples.map((sample, s) => {
              let score = cm.gismut.data[s][m];
              // tslint:disable-next-line:no-bitwise
              score &= ~mutations.g0;
              // tslint:disable-next-line:no-bitwise
              score &= ~mutations.g1;
              // tslint:disable-next-line:no-bitwise
              score &= ~mutations.g2;
              // tslint:disable-next-line:no-bitwise
              score &= ~mutations.gm1;
              // tslint:disable-next-line:no-bitwise
              score &= ~mutations.gm2;
              return score;
            })
          };
          rv.mean = jstat.mean(rv.d);
          rv.median = jstat.median(rv.d);
          rv.mode = jstat.mode(rv.d);
          rv.min = jstat.min(rv.d);
          rv.max = jstat.max(rv.d);
          rv.quartiles = jstat.quartiles(rv.d);
          return rv;
        });

        const gismutMap = cm.gismut.samples.map((s, i) => ({ s: s, i: i }));
        const patientMap = cm.clinical.patients.map((p, i) => ({ p: p, i: i }));
        const patient = cm.clinical.patients.map((patientDatum, pi) => {
          return cm.clinical.fields.reduce((obj, field, fi) => {
            obj[field.key] = (field.type === 'number') ?
            cm.clinical.data[fi][pi] :
              field.values[cm.clinical.data[fi][pi]];
            return obj;
          }, { p: patientDatum });
        });

        // Extract Min Max From Molecular Table
        const molecularMinMax = (tbl) => {
          return tbl.reduce((p, c) => {
            const sampleMinMax = c.d.reduce((p2, c2) => {
              if (p2.min > c2) { p2.min = c2; }
              if (p2.max < c2) { p2.max = c2; }
              return p2;
            }, { min: Infinity, max: -Infinity });
            if (p.min > sampleMinMax.min) { p.min = sampleMinMax.min; }
            if (p.max < sampleMinMax.max) { p.max = sampleMinMax.max; }
            return p;
          }, { min: Infinity, max: -Infinity });
        };

        // Build Fields Collection
        const fields = cm.clinical.fields.map(v => Object.assign(v, { 
          ctype: CollectionTypeEnum.PATIENT,
          tbl: 'patient', type: v.type.toUpperCase(),
        label: v.key.replace(/_/gi, ' ')
          .replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })}));
        fields.push({ key: 'gistic', label: 'Gistic', type: 'NUMBER', tbl: 'gistic',
          values: molecularMinMax(gistic), ctype: CollectionTypeEnum.GISTIC  } );
        fields.push({ key: 'rna', label: 'RNA', type: 'NUMBER', tbl: 'rna',
          values: molecularMinMax(rna), ctype: CollectionTypeEnum.MRNA } );
        fields.push({ key: 'gistic_threshold', label: 'Gistic Thresholded', type: 'STRING',
          tbl: 'gisticT', values: [-2, -1, 0, 1, 2], ctype: CollectionTypeEnum.GISTIC_THRESHOLD } );

        const dataset = {
          name: disease.name,
          tables: [
            { tbl: 'gistic', map: 'gisticMap', label: 'Gistic', ctype: CollectionTypeEnum.GISTIC },
            { tbl: 'gisticT', map: 'gismutMap', label: 'Gistic Thresholded', ctype: CollectionTypeEnum.GISTIC_THRESHOLD },
            { tbl: 'mut', map: 'gismutMap', label: 'Mutation', ctype: CollectionTypeEnum.MUTATION },
            { tbl: 'rna', map: 'rnaMap', label: 'Rna', ctype: CollectionTypeEnum.MRNA },
            { tbl: 'patient', map: 'patientMap', label: 'Patient', ctype: CollectionTypeEnum.PATIENT }
          ],
          fields: fields
        };

        return Observable.fromPromise(
          Promise.all([
            DatasetService.db.table('dataset').add(dataset),
            DatasetService.db.table('patientSampleMap').bulkAdd(patientSampleMap),
            DatasetService.db.table('events').bulkAdd(events),
            DatasetService.db.table('mut').bulkAdd(mut),
            DatasetService.db.table('gismutMap').bulkAdd(gismutMap),
            DatasetService.db.table('gisticT').bulkAdd(gisticT),
            DatasetService.db.table('patientMeta').bulkAdd(cm.clinical.fields),
            DatasetService.db.table('patientMap').bulkAdd(patientMap),
            DatasetService.db.table('patient').bulkAdd(patient),
            DatasetService.db.table('rnaMap').bulkAdd(rnaMap),
            DatasetService.db.table('rna').bulkAdd(rna),
            DatasetService.db.table('gisticMap').bulkAdd(gisticMap),
            DatasetService.db.table('gistic').bulkAdd(gistic)
          ]));
      });
  }

  constructor(private http: HttpClient) { }
}
