import 'rxjs/add/operator/map';
import { ChartFactory } from './../component/workspace/chart/chart.factory';
import { DataDecorator, DataDecoratorTypeEnum } from './../model/data-map.model';
import { GeneSet } from './../model/gene-set.model';
import { Cohort } from './../model/cohort.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { VisualizationEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataFieldFactory } from 'app/model/data-field.model';
import { DataField } from './../model/data-field.model';
import { DataCollection } from './../model/data-collection.model';
import { Injectable } from '@angular/core';
import { HttpClient } from './http.client';
import { Observable } from 'rxjs/Observable';
import Dexie from 'dexie';
import * as _ from 'lodash';
import * as JStat from 'jstat';
import { QueryBuilderConfig } from 'app/component/workspace/query-panel/query-builder/query-builder.interfaces';
import { Legend } from '../model/legend.model';


@Injectable()
export class DataService {

  public static db: Dexie;
  public static instance: DataService;

  public static API_PATH = 'https://dev.oncoscape.sttrcancer.io/api/';

  createDataDecorator(config: GraphConfig, decorator: DataDecorator): Observable<DataDecorator> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      new Dexie('notitia-' + config.database).open().then(db => {
        Promise.all([
          db.table(decorator.field.tbl).toArray(),
          db.table('patientSampleMap').toArray()
        ])
          .then(results => {
            const items = results[0];
            const psMap = results[1].reduce((p, c) => { p[c.p] = c.s; return p; }, {});

            let scale: Function;
            // let legend: Legend;
            switch (decorator.type) {

              case DataDecoratorTypeEnum.COLOR:
                scale = (decorator.field.type === 'STRING') ?
                  ChartFactory.getScaleColorOrdinal(decorator.field.values) :
                  ChartFactory.getScaleColorLinear(decorator.field.values.min, decorator.field.values.max);
                decorator.values = items.map(v => ({
                  pid: v.p,
                  sid: psMap[v.p],
                  mid: null,
                  key: EntityTypeEnum.PATIENT,
                  label: v[decorator.field.key],
                  value: scale(v[decorator.field.key])
                }));
                decorator.legend = new Legend();
                decorator.legend.type = 'COLOR';
                decorator.legend.display = 'DISCRETE';
                decorator.legend.name = (config.entity === EntityTypeEnum.SAMPLE) ? 'Sample ' + decorator.field.label :
                  (config.entity === EntityTypeEnum.GENE) ? 'Gene ' + decorator.field.label : 'Patient ' + decorator.field.label;
                if (decorator.field.type === 'STRING') {
                  decorator.legend.labels = scale['domain']();
                  decorator.legend.values = scale['range']();
                } else {
                  decorator.legend.labels = scale['range']().map(v => scale['invertExtent'](v).map(w => Math.round(w)).join(' - '));
                  decorator.legend.values = scale['range']();
                  // decorator.legend.labels = [decorator.field.values.min, decorator.field.values.max];
                  // decorator.legend.values = [decorator.field.values.min, decorator.field.values.max];
                  // decorator.legend.display = 'CONTINUOUS';
                }
                resolve(decorator);
                break;

              case DataDecoratorTypeEnum.SHAPE:
                scale = (decorator.field.type === 'STRING') ?
                  ChartFactory.getScaleShapeOrdinal(decorator.field.values) :
                  ChartFactory.getScaleShapeLinear(decorator.field.values.min, decorator.field.values.max);
                decorator.values = items.map(v => ({
                  pid: v.p,
                  sid: psMap[v.p],
                  mid: null,
                  key: EntityTypeEnum.PATIENT,
                  label: v[decorator.field.key],
                  value: scale(v[decorator.field.key])
                }));
                decorator.legend = new Legend();
                decorator.legend.type = 'SHAPE';
                decorator.legend.display = 'DISCRETE';
                decorator.legend.name = (config.entity === EntityTypeEnum.SAMPLE) ? 'Sample ' + decorator.field.label :
                  (config.entity === EntityTypeEnum.GENE) ? 'Gene ' + decorator.field.label : 'Patient ' + decorator.field.label;
                if (decorator.field.type === 'STRING') {
                  decorator.legend.labels = scale['domain']();
                  decorator.legend.values = scale['range']();
                } else {
                  decorator.legend.labels = scale['range']().map(v => scale['invertExtent'](v).join(' - '));
                  decorator.legend.values = scale['range']();
                }
                resolve(decorator);
                break;

              case DataDecoratorTypeEnum.SIZE:
                scale = (decorator.field.type === 'STRING') ?
                  ChartFactory.getScaleSizeOrdinal(decorator.field.values) :
                  ChartFactory.getScaleSizeLinear(decorator.field.values.min, decorator.field.values.max);
                decorator.values = items.map(v => ({
                  pid: v.p,
                  sid: psMap[v.p],
                  mid: null,
                  key: EntityTypeEnum.PATIENT,
                  label: v[decorator.field.key],
                  value: scale(v[decorator.field.key])
                }));
                resolve(decorator);
                break;

              case DataDecoratorTypeEnum.TOOLTIP:
                break;
              case DataDecoratorTypeEnum.SELECT:
                break;
            }
          });
      });
    }));
  }

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
    const subcats = ['CGP', 'CP', 'CP:BIOCARTA', 'CP:KEGG', 'CP:REACTOME', 'MIR', 'TFT', 'CGN', 'CM', 'BP', 'CC', 'MF', 'C6', 'c7'];
    const field = (subcats.indexOf(categoryCode) === -1) ? 'category' : 'subcategory';
    return this.http
      .get(DataService.API_PATH +
        'z_lookup_geneset/%7B%22$fields%22:[%22name%22,%22hugo%22,%22summary%22],%20%22$query%22:%7B%22' +
        field + '%22:%22' +
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
  getGenesetBySearchTerm(searchTerm: string): Observable<any> {
    return this.http
      .get(DataService.API_PATH +
        'z_lookup_geneset/%7B%22%24text%22%3A%7B%22%24search%22%3A%22' +
        searchTerm +
        '%22%7D%7D')
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

  getHelpInfo(config: GraphConfig): Promise<any> {

    const v = config.visualization;
    const method = (v === VisualizationEnum.BOX_WHISKERS) ? 'box_whiskers.json' :
      (v === VisualizationEnum.CHROMOSOME) ? 'chromosome.json' :
        (v === VisualizationEnum.DICTIONARY_LEARNING) ? 'dictionary_learning.json' :
          (v === VisualizationEnum.FA) ? 'factor_analysis.json' :
            (v === VisualizationEnum.FAST_ICA) ? 'fast_ica.json' :
              (v === VisualizationEnum.HIC) ? 'force_directed_graph.json' :
                (v === VisualizationEnum.GENOME) ? 'genome.json' :
                  (v === VisualizationEnum.DENDOGRAM) ? 'dendogram.json' :
                    (v === VisualizationEnum.HEATMAP) ? 'heatmap.json' :
                      (v === VisualizationEnum.HISTOGRAM) ? 'histogram.json' :
                        (v === VisualizationEnum.INCREMENTAL_PCA) ? 'incremental_pca.json' :
                          (v === VisualizationEnum.ISOMAP) ? 'isomap.json' :
                            (v === VisualizationEnum.KERNAL_PCA) ? 'kernal_pca.json' :
                              (v === VisualizationEnum.LDA) ? 'latent_dirichlet_allocation.json' :
                                (v === VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS) ? 'linear_discriminant_analysis.json' :
                                  (v === VisualizationEnum.LOCALLY_LINEAR_EMBEDDING) ? 'locally_linear_embedding.json' :
                                    (v === VisualizationEnum.MDS) ? 'mds.json' :
                                      (v === VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING) ? 'mini_batch_dictionary_learning.json' :
                                        (v === VisualizationEnum.MINI_BATCH_SPARSE_PCA) ? 'mini_batch_sparse_pca.json' :
                                          (v === VisualizationEnum.NMF) ? 'nmf.json' :
                                            (v === VisualizationEnum.PATHWAYS) ? 'pathways.json' :
                                              (v === VisualizationEnum.PCA) ? 'pca.json' :
                                                // tslint:disable-next-line:max-line-length
                                                (v === VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS) ? 'quadratic_discriminant_analysis.json)' :
                                                  (v === VisualizationEnum.SPARSE_PCA) ? 'sparse_pca.json' :
                                                    (v === VisualizationEnum.SPECTRAL_EMBEDDING) ? 'spectral_embedding.json' :
                                                      (v === VisualizationEnum.SURVIVAL) ? 'survival.json' :
                                                        (v === VisualizationEnum.TIMELINES) ? 'timelines.json' :
                                                          (v === VisualizationEnum.TRUNCATED_SVD) ? 'truncated_svd.json' :
                                                            (v === VisualizationEnum.TSNE) ? 'tsne.json' :
                                                              '';


    if (method === '') {
      return new Promise((resolve, reject) => {
        resolve({
          method: 'NA',
          desc: 'Comming Soon',
          url: 'NA',
          attrs: [],
          params: [],
          citations: []
        });
      });

    }

    return this.http
      .get('./assets/help/' + method)
      .map(res => res.json()).toPromise();
    // // return this.http
    // //   .get('https://s3-us-west-2.amazonaws.com/notitia/reference/genesets.json.gz')
    // //   .map(res => res.json()).toPromise();

    // return new Promise((resolve, reject) => {
    //   // const db = new Dexie('notitia');
    //   // db.open().then(v => {
    //   //   v.table('docs').get({ 'method': method }).then(result => {
    //   //     resolve(result);
    //   //   });
    //   // });
    // });
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

  getQueryBuilderConfig(database: string): Promise<any> {
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

    // TODO: FIX This
    if (ids === undefined || ids === null) {
      ids = [];
    }

    return new Promise((resolve, reject) => {

      // This builds a "sql" query
      this.getQueryBuilderConfig(database).then(config => {

        // Pull field Meta Data
        const fields = Object.keys(config.fields)
          .map(field => Object.assign(config.fields[field], { field: field }))
          .filter(item => item.type !== 'string')
          .sort((a, b) => (a.type !== b.type) ? a.type.localeCompare(b.type) : a.name.localeCompare(b.name));

        const db = new Dexie('notitia-' + database);
        db.open().then(connection => {
          const query = (ids.length === 0) ?
            connection.table('patient') :
            connection.table('patient').where('p').anyOfIgnoreCase(ids);

          query.toArray().then(result => {

            const cat = fields.filter(v => v.type === 'category').map(f => {
              const arr = result.map(v => v[f.field]);
              const stat = arr.reduce((p, c) => {
                if (!p.hasOwnProperty(c)) { p[c] = 1; } else { p[c] += 1; }
                return p;
              }, {});
              const stats = Object.keys(stat).map(v => ({ label: v, value: stat[v] }));
              return Object.assign(f, { stat: stats });
            });

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
              const stats = bins.map((v, j) => ({ label: Math.round(first + (j * binWidth)).toString(), value: v }));
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

  getGenesetCategories(): Promise<Array<{ c: string, n: string, d: string }>> {
    return this.http
      .get('https://s3-us-west-2.amazonaws.com/notitia/reference/genesets.json.gz')
      .map(res => res.json()).toPromise();
  }
  getGenesets(category: string): Promise<Array<any>> {
    return this.http
      .get('https://s3-us-west-2.amazonaws.com/notitia/reference/geneset-' + category.toLowerCase() + '.json.gz')
      .map(res => res.json()).toPromise();
  }
  getCustomGenesets(database: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('genesets').toArray().then(result => {
          const genesets = result;
          genesets.unshift({
            n: 'Pathways in Cancer', g: [
              'ABL1', 'AKT1', 'AKT2', 'AKT3', 'APC', 'APC2', 'APPL1', 'AR', 'ARAF', 'ARNT', 'ARNT2', 'AXIN1',
              'AXIN2', 'BAD', 'BAX', 'BCL2', 'BCL2L1', 'BCR', 'BID', 'BIRC2', 'BIRC3', 'BIRC5', 'BMP2', 'BMP4', 'BRAF', 'BRCA2', 'CASP3',
              'CASP8', 'CASP9', 'CBL', 'CBLB', 'CBLC', 'CCDC6', 'CCNA1', 'CCND1', 'CCNE1', 'CCNE2', 'CDC42', 'CDH1', 'CDK2', 'CDK4', 'CDK6',
              // tslint:disable-next-line:max-line-length
              'CDKN1A', 'CDKN1B', 'CDKN2A', 'CDKN2B', 'CEBPA', 'CHUK', 'CKS1B', 'COL4A1', 'COL4A2', 'COL4A4', 'COL4A6', 'CREBBP', 'CRK', 'CRKL',
              'CSF1R', 'CSF2RA', 'CSF3R', 'CTBP1', 'CTBP2', 'CTNNA1', 'CTNNA2', 'CTNNA3', 'CTNNB1', 'CUL2', 'CYCS', 'DAPK1', 'DAPK2', 'DAPK3',
              // tslint:disable-next-line:max-line-length
              'DCC', 'DVL1', 'DVL2', 'DVL3', 'E2F1', 'E2F2', 'E2F3', 'EGF', 'EGFR', 'EGLN1', 'EGLN2', 'EGLN3', 'EP300', 'EPAS1', 'ERBB2', 'ETS1',
              'FADD', 'FAS', 'FASLG', 'FGF1', 'FGF10', 'FGF11', 'FGF12', 'FGF13', 'FGF14', 'FGF16', 'FGF17', 'FGF18', 'FGF19', 'FGF2', 'FGF20',
              // tslint:disable-next-line:max-line-length
              'FGF21', 'FGF22', 'FGF23', 'FGF3', 'FGF4', 'FGF5', 'FGF6', 'FGF7', 'FGF8', 'FGF9', 'FGFR1', 'FGFR2', 'FGFR3', 'FH', 'FIGF', 'FLT3',
              'FLT3LG', 'FN1', 'FOS', 'FOXO1', 'FZD1', 'FZD10', 'FZD2', 'FZD3', 'FZD4', 'FZD5', 'FZD6', 'FZD7', 'FZD8', 'FZD9', 'GLI1', 'GLI2',
              'GLI3', 'GRB2', 'GSK3B', 'GSTP1', 'HDAC1', 'HDAC2', 'HGF', 'HHIP', 'HIF1A', 'HRAS', 'HSP90AA1', 'HSP90AB1', 'HSP90B1', 'IGF1',
              'IGF1R', 'IKBKB', 'IKBKG', 'IL6', 'IL8', 'ITGA2', 'ITGA2B', 'ITGA3', 'ITGA6', 'ITGAV', 'ITGB1', 'JAK1', 'JUN', 'JUP', 'KIT',
              // tslint:disable-next-line:max-line-length
              'KITLG', 'KLK3', 'KRAS', 'LAMA1', 'LAMA2', 'LAMA3', 'LAMA4', 'LAMA5', 'LAMB1', 'LAMB2', 'LAMB3', 'LAMB4', 'LAMC1', 'LAMC2', 'LAMC3',
              'LEF1', 'LOC652346', 'LOC652671', 'LOC652799', 'MAP2K1', 'MAP2K2', 'MAPK1', 'MAPK10', 'MAPK3', 'MAPK8', 'MAPK9', 'MAX', 'MDM2',
              // tslint:disable-next-line:max-line-length
              'MECOM', 'MET', 'MITF', 'MLH1', 'MMP1', 'MMP2', 'MMP9', 'MSH2', 'MSH3', 'MSH6', 'MTOR', 'MYC', 'NCOA4', 'NFKB1', 'NFKB2', 'NFKBIA',
              'NKX3-1', 'NOS2', 'NRAS', 'NTRK1', 'PAX8', 'PDGFA', 'PDGFB', 'PDGFRA', 'PDGFRB', 'PGF', 'PIAS1', 'PIAS2', 'PIAS3', 'PIAS4', 'PIK3CA',
              // tslint:disable-next-line:max-line-length
              'PIK3CB', 'PIK3CD', 'PIK3CG', 'PIK3R1', 'PIK3R2', 'PIK3R3', 'PIK3R5', 'PLCG1', 'PLCG2', 'PLD1', 'PML', 'PPARD', 'PPARG', 'PRKCA',
              'PRKCB', 'PRKCG', 'PTCH1', 'PTCH2', 'PTEN', 'PTGS2', 'PTK2', 'RAC1', 'RAC2', 'RAC3', 'RAD51', 'RAF1', 'RALA', 'RALB', 'RALBP1',
              // tslint:disable-next-line:max-line-length
              'RALGDS', 'RARA', 'RARB', 'RASSF1', 'RASSF5', 'RB1', 'RBX1', 'RELA', 'RET', 'RHOA', 'RUNX1', 'RUNX1T1', 'RXRA', 'RXRB', 'RXRG',
              'SHH', 'SKP2', 'SLC2A1', 'SMAD2', 'SMAD3', 'SMAD4', 'SMO', 'SOS1', 'SOS2', 'SPI1', 'STAT1', 'STAT3', 'STAT5A', 'STAT5B', 'STK36',
              // tslint:disable-next-line:max-line-length
              'STK4', 'SUFU', 'TCEB1', 'TCEB2', 'TCF7', 'TCF7L1', 'TCF7L2', 'TFG', 'TGFA', 'TGFB1', 'TGFB2', 'TGFB3', 'TGFBR1', 'TGFBR2', 'TP53',
              'TPM3', 'TPR', 'TRAF1', 'TRAF2', 'TRAF3', 'TRAF4', 'TRAF5', 'TRAF6', 'VEGFA', 'VEGFB', 'VEGFC', 'VHL', 'WNT1', 'WNT10A', 'WNT10B',
              // tslint:disable-next-line:max-line-length
              'WNT11', 'WNT16', 'WNT2', 'WNT2B', 'WNT3', 'WNT3A', 'WNT4', 'WNT5A', 'WNT5B', 'WNT6', 'WNT7A', 'WNT7B', 'WNT8A', 'WNT8B', 'WNT9A',
              'WNT9B', 'XIAP', 'ZBTB16'
            ]
          });
          resolve(result);
        });
      });
    });
  }
  createCustomGeneset(database: string, geneset: GeneSet): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.http
      // .get(DataService.API_PATH +
      //   'z_lookup_geneset/%7B%22$fields%22:[%22name%22,%22hugo%22,%22summary%22],%20%22$query%22:%7B%22' +
      //   field + '%22:%22' +
      //   categoryCode +
      //   '%22%7D%20%7D')
      // .map(res => res.json())
      // z_lookup_genemap
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('genesets').add(geneset).then(w => {
          resolve(w);
        });
      });
    });
  }
  deleteCustomGeneset(database: string, geneset: GeneSet): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('genesets').where('n').equalsIgnoreCase(geneset.n).delete().then(w => {
          resolve(w);
        });
      });
    });
  }
  getCustomCohorts(database: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('cohorts').toArray().then(result => {
          const cohorts = result;
          // if (result[0] === undefined) { result[0] = []; }
          cohorts.unshift({ n: 'All Patients', pids: [], sids: [] });
          resolve(cohorts);
        });
      });
    });
  }
  createCustomCohort(database: string, cohort: Cohort): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(conn => {
        Promise.all(
          cohort.conditions.map(condition => {
            if (condition.field.type === 'number') {
              if (condition.min !== null && condition.max !== null) {
                return conn.table('patient').where(condition.field.key).between(condition.min, condition.max).toArray();
              }
              if (condition.min !== null) {
                return conn.table('patient').where(condition.field.key).aboveOrEqual(condition.min).toArray();
              }
              return conn.table('patient').where(condition.field.key).aboveOrEqual(condition.max).toArray();
            }
            return conn.table('patient').where(condition.field.key).equalsIgnoreCase(condition.value).toArray();
          })
        ).then(conditions => {
          if (!cohort.n.trim().length) {
            const d = new Date();
            cohort.n = d.toLocaleDateString + ' ' + d.toLocaleTimeString();
          }
          conditions.forEach((patients, i) => {
            cohort.conditions[i].pids = patients.map(v => v.p);
          });
          const orGroups = cohort.conditions.reduce((p, c) => {
            if (c.condition === 'where' || c.condition === 'and') {
              p.push([c]);
            } else { p[p.length - 1].push(c); }
            return p;
          }, []);
          const andGroups = orGroups.map(group => group.reduce((p, c) => {
            return Array.from(new Set([...p, ...c.pids]));
          }, []));
          const pids = (andGroups.length === 1) ? andGroups[0] :
            Array.from(andGroups.reduce((p, c) => {
              const cSet = new Set(c);
              return new Set([...p].filter(x => cSet.has(x)));
            }, andGroups.shift()));
          cohort.pids = pids;
          conn.table('patientSampleMap').toArray().then(ps => {
            const pids2 = new Set(cohort.pids);
            cohort.sids = ps.filter(v => pids2.has(v.p)).map(v => v.s);
            conn.table('cohorts').add(cohort).then(v => {
              resolve(v);
            });
          });
        });
      });
    });
  }
  deleteCustomCohort(database: string, cohort: Cohort): Promise<any> {
    return new Promise((resolve, reject) => {
      const db = new Dexie('notitia-' + database);
      db.open().then(v => {
        v.table('cohorts').where('n').equalsIgnoreCase(cohort.n).delete().then(w => {
          resolve(w);
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
