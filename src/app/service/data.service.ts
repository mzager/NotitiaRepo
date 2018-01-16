import { DataFieldFactory } from 'app/model/data-field.model';
import { DataField } from './../model/data-field.model';
import { DataCollection } from './../model/data-collection.model';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';
import { Observable } from 'rxjs/Observable';
import Dexie from 'dexie';
import * as _ from 'lodash';
import * as JStat from 'jstat';
import { QueryBuilderConfig } from 'app/component/workspace/query-panel/query-builder/query-builder.interfaces';


@Injectable()
export class DataService {

  public static db: Dexie;
  public static instance: DataService;

  public static API_PATH = 'http://dev.oncoscape.sttrcancer.io/api/';

  getGeneMap(): Observable<any> {
    return Observable.fromPromise(DataService.db.table('genemap').toArray());
  }
  getChromosomeGeneCoords(): Observable<any> {
    return Observable.fromPromise(DataService.db.table('genecoords').toArray());
  }
  getChromosomeBandCoords(): Observable<any> {
    return Observable.fromPromise(DataService.db.table('bandcoords').toArray());
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
      .map(res => res.json());
  }

  getDatasetInfo(database: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('dataset').toArray().then(result => {
          resolve(result[0]);
        });
      });
    });
  }

  getHelpInfo(method: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia');
      db.open().then(v => {
        v.table('docs').get({ 'method': method }).then(result => {
          resolve(result);
        });
      });
    });
  }

  getEvents(database: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('dataset').toArray().then(result => {
          resolve(result[0].events);
        });
      });
    });
  }

  getQueryBuilderConfig(database: string): Promise<QueryBuilderConfig> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        console.log('need to ensure it has the table');
        v.table('patientMeta').toArray().then(result => {
          const config = result.reduce((fields, field) => {
            switch (field.type) {
              case 'NUMBER':
                fields[field.key] = { name: field.label, type: field.type.toLowerCase() };
                return fields;
              case 'STRING':
                if (field.values.length <= 10) {
                  fields[field.key] = {
                    name: field.label, type: 'category',
                    options: field.values.map(val => ({ name: val, value: val }))
                  };
                } else {
                  fields[field.key] = { name: field.label, type: 'string' };
                }
                return fields;
            }
          }, {});
          resolve({ fields: config });
        });
      });
    });
  }

  getSampleIdsWithPatientIds(database: string, patientIds: Array<string>): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(connection => {
        connection.table('patientSampleMap').where('p').anyOf(patientIds).toArray().then(result => {
          resolve(Array.from(new Set(result.map(v => v.s))));
        });
      });
    });
  }

  getPatientStats(database: string, ids: Array<string>): Promise<any> {

    return new Promise((resolve, reject) => {

      this.getQueryBuilderConfig(database).then(config => {

        // Pull field Meta Data
        const fields = Object.keys(config.fields)
          .map(field => Object.assign(config.fields[field], { field: field }))
          .filter(item => item.type !== 'string')
          .sort((a, b) => (a.type !== b.type) ? a.type.localeCompare(b.type) : a.name.localeCompare(b.name));
          // debugger;

        const db = new Dexie('notitia-' + database);
        db.open().then(connection => {
          const query = (ids.length === 0) ?
            connection.table('patient') :
            connection.table('patient').where('p').anyOfIgnoreCase(ids);

          query.toArray().then(result => {

            const cat = fields.filter(v => v.type === 'category').map(f => { 
              const arr = result.map(v => v[f.field]);
              const stat = arr.reduce( (p, c) => { 
                if (!p.hasOwnProperty(c)) { p[c] = 1; } else { p[c] += 1; } 
                return p; }, {});
              const stats = Object.keys(stat).map(v => ({label: v, value: stat[v]}))
              return Object.assign(f, { stat: stats });
            })

            const num = fields.filter(v => v.type === 'number').map(f => {
              const arr = result.map(v => v[f.field]);
              const first = JStat.min(arr);
              const binCnt = 10;
              const binWidth = (JStat.max(arr) - first) / binCnt;
              const len = arr.length;
              const bins = [];
              let i;
              for (i = 0; i < binCnt; i++) { bins[i] = 0; }
              for (i = 0; i < len; i++) { bins[Math.min(Math.floor(((arr[i] - first) / binWidth)), binCnt - 1)] += 1; }
              const stats = bins.map((v, i) => ({ label: Math.round(first + (i * binWidth)).toString(), value: v }));
              return Object.assign(f, { stat: stats });
            });

            resolve(num.concat(cat));
          });
        });
      });
    });
  }

  getPatientIdsWithQueryBuilderCriteria(database: string, config: QueryBuilderConfig,
    criteria: { condition: string, rules: Array<{ field: string, operator: string, value: any }> }): Promise<Array<string>> {
    return new Promise((resolve, reject) => {

      const db = new Dexie('notitia-' + database);
      db.open().then(connection => {

        Promise.all(criteria.rules.map(rule => {
          console.log(config.fields[rule.field].type);
          switch (config.fields[rule.field].type) {
            case 'number':
              switch (rule.operator) {
                case '=':
                  return connection.table('patient').where(rule.field).equals(rule.value).toArray();
                case '!=':
                  return connection.table('patient').where(rule.field).notEqual(rule.value).toArray();
                case '>':
                  return connection.table('patient').where(rule.field).above(rule.value).toArray();
                case '>=':
                  return connection.table('patient').where(rule.field).aboveOrEqual(rule.value).toArray();
                case '<':
                  return connection.table('patient').where(rule.field).below(rule.value).toArray();
                case '<=':
                  return connection.table('patient').where(rule.field).belowOrEqual(rule.value).toArray();
              }
              break;

            case 'string':
              switch (rule.operator) {
                case '=':
                  return connection.table('patient').where(rule.field).equalsIgnoreCase(rule.value).toArray();
                case '!=':
                  return connection.table('patient').where(rule.field).notEqual(rule.value).toArray();
                case 'contains':
                  // return connection.table('patient').where(rule.field).(rule.value).toArray();
                  alert('Query Contains Operator Not Yet Implemented - Ignoring');
                  return null;
                case 'like':
                  alert('Query Like Operator Not Yet Implemented - Ignoring');
                  return null;
              }
              break;

            case 'category':
              switch (rule.operator) {
                case '=':
                  return connection.table('patient').where(rule.field).equalsIgnoreCase(rule.value).toArray();
                case '!=':
                  return connection.table('patient').where(rule.field).notEqual(rule.value).toArray();
              }
              break;
          }
        }).filter(v => v)).then(v => {
          let ids: Array<string>;
          if (criteria.condition === 'or') {
            ids = Array.from(new Set(v.reduce((p, c) => { p = p.concat(c.map(cv => cv.p)); return p; }, [])));
          } else if (criteria.condition === 'and') {
            const sets = v.map(c => new Set(c.map(cv => cv.p)));
            ids = Array.from(sets[0]);
            for (let i = 1; i < sets.length; i++) {
              const set = sets[i];
              ids = ids.filter(item => set.has(item));
            }
          }
          resolve(ids);
        });

      });
    });
  }

  constructor(private http: HttpClient) {

    DataService.instance = this;

    Dexie.exists('notitia').then(exists => {
      DataService.db = new Dexie('notitia');

      if (exists) {
        DataService.db.open();
        DataService.db.on('versionchange', function (event) { });
        DataService.db.on('blocked', () => { });
        return;
      }

      DataService.db.version(1).stores({
        genecoords: 'gene, chr, arm, type',
        bandcoords: '++id',
        genemap: 'hugo',
        genelinks: '++id, source, target',
        genetrees: '++id',
        docs: '++id, method'
      });
      DataService.db.open();
      DataService.db.on('versionchange', function (event) { });
      DataService.db.on('blocked', () => { });

      requestAnimationFrame(v => {
        DataService.db.table('genemap').count().then(count => {
          if (count > 0) { return; }
          const docs = this.http.get('https://s3-us-west-2.amazonaws.com/notitia/reference/scikit.json.gz').map(res => res.json());
          const genecoords = this.http
            .get('https://s3-us-west-2.amazonaws.com/notitia/reference/genecoords.json.gz').map(res => res.json());
          const bandcoords = this.http
            .get('https://s3-us-west-2.amazonaws.com/notitia/reference/bandcoords.json.gz').map(res => res.json());
          const genemap = this.http.get('https://s3-us-west-2.amazonaws.com/notitia/reference/genemap.json.gz').map(res => res.json());
          const genelinks = this.http.get('https://s3-us-west-2.amazonaws.com/notitia/reference/genelinks.json.gz').map(res => res.json());

          Observable.zip(genecoords, bandcoords, genemap, genelinks, docs).subscribe(result => {
            const hugoLookup = result[2];
            hugoLookup.forEach(gene => {
              gene.hugo = gene.hugo.toUpperCase();
              gene.symbols = gene.symbols.map(sym => sym.toUpperCase());
            });

            const validHugoGenes = new Set(hugoLookup.map(gene => gene.hugo));

            const geneLinksData = result[3].map(d => ({ source: d[0].toUpperCase(), target: d[1].toUpperCase(), tension: d[2] }));
            const allGenes = Array.from(new Set([
              ...Array.from(new Set(geneLinksData.map(gene => gene.source))),
              ...Array.from(new Set(geneLinksData.map(gene => gene.target)))
            ]));
            const missingGenes = allGenes.filter(gene => !validHugoGenes.has(gene));

            const missingMap = missingGenes.reduce((p, c) => {
              const value = hugoLookup.find(geneLookup => geneLookup.symbols.indexOf(c) >= 0);
              if (value) { p[c.toString()] = value; }
              return p;
            }, {});


            geneLinksData.forEach(link => {
              link.target = (validHugoGenes.has(link.target)) ? link.target :
                (missingMap.hasOwnProperty(link.target)) ? missingMap[link.target].hugo :
                  null;
              link.source = (validHugoGenes.has(link.source)) ? link.source :
                (missingMap.hasOwnProperty(link.source)) ? missingMap[link.source].hugo :
                  null;
            });

            // Filter Out Links That Could Not Be Resolved + Suplement With Additonal Data
            const geneLookup = result[0].reduce((p, c) => {
              p[c.gene] = c;
              return p;
            }, {});

            const links = geneLinksData.filter(link => (link.source !== null && link.target !== null)).map(link => {
              link.sourceData = geneLookup[link.source];
              link.targetData = geneLookup[link.target];
              return link;
            });

            DataService.db.table('genecoords').bulkAdd(result[0]);
            DataService.db.table('bandcoords').bulkAdd(result[1]);
            DataService.db.table('genemap').bulkAdd(result[2]);
            DataService.db.table('genelinks').bulkAdd(links);
            DataService.db.table('docs').bulkAdd(result[4]);
          });
        });
      });
    });
  }
}
