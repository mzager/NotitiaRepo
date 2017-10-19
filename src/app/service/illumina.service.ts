
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as vcf from 'vcf.js';
import * as _ from 'lodash';


@Injectable()
export class IlluminaService {

  static baseUrl = 'https://api.basespace.illumina.com/';
  static accessCode = '';
  static accessToken = '';
  static headers: Headers;
  static sessionUri = '';
  static sessionId = '';
  static project: any;
  static get isLoggedIn(): boolean {
    return (IlluminaService.accessCode !== '' && IlluminaService.accessToken !== '');
  }


  public projects: BehaviorSubject<any>;
  //private pouchDB;

  public onData: EventEmitter<any>;
  
//constructor(private http: Http, private cookieService: CookieService) {
  constructor(private http: Http) {

    this.onData = new EventEmitter();
    this.projects = new BehaviorSubject<any>(null);
    const params = new URLSearchParams(window.location.search);
    if (params.paramsMap.has('?action')) {
      IlluminaService.accessCode = params.paramsMap.get('authorization_code')[0];
      IlluminaService.sessionUri = params.paramsMap.get('appsessionuri')[0].replace(new RegExp('%2F', 'g'), '/');
      IlluminaService.sessionId = IlluminaService.sessionUri.split('/')[2];
      this.http.post(IlluminaService.baseUrl + 'v1pre3/oauthv2/token',
        {
          code: IlluminaService.accessCode,
          redirect_uri: window.location.origin + '/',
          grant_type: 'authorization_code',
          client_id: '4ae6f961b94346afa3f72aca6df89683',
          client_secret: '067bd68c4a854cb0a8e9a43d3062fd0e'
        })
        .map(response => {
          const json = response.json();
          IlluminaService.accessToken = json.access_token;
          console.log('ACCESS TOKEN: ' + IlluminaService.accessToken);
          console.log('ACCESS CODE: ' + IlluminaService.accessCode);
          console.log('SESSION URI ' + IlluminaService.sessionUri);
          console.log('SESSION ID: ' + IlluminaService.sessionId);
          IlluminaService.headers = new Headers({ 'x-access-token': IlluminaService.accessToken });
          return json;
        })
        .mergeMap(value =>
          this.http.get(IlluminaService.baseUrl + IlluminaService.sessionUri, { headers: IlluminaService.headers })
        ).map(response => {
          const json = response.json();
          IlluminaService.project = json.Response.Properties.Items.filter(v => v.Type === 'project')[0].Content;
          return json;
        }).mergeMap(value =>
          this.http.get(IlluminaService.baseUrl +
            'v1pre3/search?scope=appresult_files&limit=1024&query=(project.id:' +
            IlluminaService.project.Id +
            '%20AND%20(fileextension:.vcf%20OR%20fileextension:.vcf.gz))', { headers: IlluminaService.headers })
        )
        .map(response => {
          const json = response.json();
          // Remove Genome Files
          const vcfFiles = response.json().Response.Items.filter(v => (v.AppResultFile.Name.indexOf('genome') === -1));
          return vcfFiles.map(file => {
            return this.http.get(
              IlluminaService.baseUrl + file.AppResultFile.HrefContent,
              { headers: IlluminaService.headers });
          });
        })
        .mergeMap(vcfRequests => {
          return Observable.forkJoin(vcfRequests);
        })
        .map(response => {
          const parser = new vcf.parser();
          const vcfs = response.map(v => parser(v['_body']));
          return vcfs;
        }).subscribe(vcfs => {
debugger;
          // Sample Array
          const samples = vcfs.map((s, i) => s.header.sampleNames[0] + '-' + i.toString());

          // Function To Retrun Hugo Symbol
          // const geneExtractionFunction = ( (record: any): Function =>  {
          //   return (record.INFO.hasOwnProperty('CSQT')) ?
          //     (info: any): string => info.CSQT.split('|')[0] :
          //     (info: any): string => info.ANT.split('|')[3];
          // })(vcfs[0].records[0]);
          const geneExtractionFunction = (info: any): string => {
            return (info.hasOwnProperty('CSQT')) ? info.CSQT.split('|')[0] :
              (info.hasOwnProperty('ANT')) ? info.ANT.split('|')[3] :
              null;
          };

          // Gene Array, Assign Gene To Each Record, Create Gene Lookup Object & Return Unique Genes
            const genes = _.uniq(vcfs.reduce((p1, v) => {
              v.genes = v.records.reduce((p, c) => {
                c.gene = geneExtractionFunction(c.INFO);
                if (c.gene === undefined || c.gene === null) {
                  return p; // Need to deal with all this madness
                }
                if (p.hasOwnProperty(c.gene)) {
                  p[c.gene].push(c);
                } else {
                  p[c.gene] = [c];
                }
                return p;
              }, {});
              return [...p1, ...Object.keys(v.genes)];
            }, []));

          // Create Zero Filled Matrix
          const geneCount = genes.length;
          const sampleCount = samples.length;

          // Populate Two Datasets
          const varientsBool = [];
          const varientsEnum = [];
          for (let geneIndex = 0; geneIndex < geneCount; geneIndex++) {
            const gene = genes[geneIndex];
            const sampleBool = [];
            const sampleEnum = [];
            for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
              const sample = vcfs[sampleIndex];
              if (sample.genes.hasOwnProperty(gene)) {
                try {
                  sampleEnum.push(sample.genes[gene][0].variantType());
                }catch ( e ) {
                  sampleEnum.push('NA');
                }
                sampleBool.push(1);
              } else {
                sampleBool.push(0);
                sampleEnum.push('NA');
              }
            }
            varientsBool.push(sampleBool);
            varientsEnum.push(sampleEnum);
          }

          const data = {
            'patientSampleMap':
              samples.reduce( (p, c) => {
                p.samples[c] = c;
                p.patients[c] = [c];
                return p;
              }, {'name': 'PATIENT-SAMPLE', 'samples': {}, 'patients': {}}),
            'molecularData': [
                {
                  'name': 'mutations-bool',
                  'data': varientsBool,
                  'samples': samples,
                  'markers': genes
                },
                  {
                  'name': 'mutations-type',
                  'data': varientsEnum,
                  'samples': samples,
                  'markers': genes
                },
            ],
            'patientData': samples.map(v => ({'SampleID': v})),
            'patientDataFields': [],
            'patientEventsValues': [],
            'patientEventsTypes': [],
            'patientEventsData': []
          };

          this.onData.emit(data);

        });
    }
  }
}
