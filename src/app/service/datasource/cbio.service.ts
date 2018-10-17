import { Injectable } from '@angular/core';

@Injectable()
export class CbioService {
  private baseUri = 'http://www.cbioportal.org/webservice.do?';

  private parseTsv(text: string, colmap: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const rows = text.split('\n');
      // debugger;
      const cols = rows.shift().split('\t');
      // .map(v => colmap[v]);

      const objs = rows.map(row => {
        const data = row.split('\t');
        return data.reduce((p, c, i) => {
          p[cols[i]] = c;
          return p;
        }, {});
      });
      resolve(objs);
    });
  }
  getCancerTypes(): Promise<any> {
    return fetch(this.baseUri + 'cmd=getTypesOfCancer', { method: 'GET' })
      .then(res => res.text())
      .then(res => this.parseTsv(res, { cancerId: 'studyId', name: 'name' }));
  }
  getCancerStudies(): Promise<any> {
    return fetch(this.baseUri + 'cmd=getCancerStudies', { method: 'GET' })
      .then(res => res.text())
      .then(res =>
        this.parseTsv(res, {
          cancerId: 'studyId',
          name: 'name',
          description: 'description'
        })
      );
  }
  getCaseLists(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
  getClinicalData(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
  getGeneticProfiles(studyId: string): Promise<any> {
    return fetch(
      this.baseUri +
        'cmd=getGeneticProfiles&cancer_study_id=' +
        encodeURI(studyId),
      {
        method: 'GET'
      }
    )
      .then(res => res.text())
      .then(
        res => {
          debugger;
        }
        // this.parseTsv(res, {
        //   id: 'cancerId',
        //   name: 'name',
        //   description: 'description'
        // })
      );
  }
  getMutationData(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
  getProfileData(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
}
