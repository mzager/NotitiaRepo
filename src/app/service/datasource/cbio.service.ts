import { Injectable } from '@angular/core';
/*
Promise.all([cbio.getCancerTypes(), cbio.getCancerStudies()]).then(v1 => {
      const studyId = v1[1][0].cancer_study_id;
      Promise.all([
        cbio.getGeneticProfiles(studyId),
        cbio.getCaseLists(studyId)
      ]).then(v2 => {
        const caseListId = v2[1][0].case_list_id;
        const geneticProfileId = v2[0][0].genetic_profile_id;
        const ids =
          // tslint:disable-next-line:max-line-length
          'A1BG A1BG-AS1 A1CF A1S9T~withdrawn A2M A2M-AS1 A2ML1 A2ML1-AS1 A2ML1-AS2 A2MP1 ZYG11AP1 ZYG11B ZYX ZYXP1 ZZEF1 ZZZ3';

        cbio.getProfileData(caseListId, geneticProfileId, ids).then(v3 => {
          ;
        });
      });
    });
*/
@Injectable()
export class CbioService {
  private baseUri = 'http://www.cbioportal.org/webservice.do?';

  private parseTsv(text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const rows = text.split('\n');
      const cols = rows.shift().split('\t');
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
  async getCancerTypes(): Promise<any> {
    const res = await fetch(this.baseUri + 'cmd=getTypesOfCancer', {
      method: 'GET',
      mode: 'cors'
    });
    const res_1 = await res.text();
    return this.parseTsv(res_1);
  }
  async getCancerStudies(): Promise<any> {
    const res = await fetch(this.baseUri + 'cmd=getCancerStudies', {
      method: 'GET',
      mode: 'cors'
    });
    const res_1 = await res.text();
    return this.parseTsv(res_1);
  }
  async getCaseLists(studyId: string): Promise<any> {
    const res = await fetch(this.baseUri + 'cmd=getCaseLists&cancer_study_id=' + encodeURI(studyId), {
      method: 'GET',
      mode: 'cors'
    });
    const res_1 = await res.text();
    return this.parseTsv(res_1);
  }
  async getProfileData(caseSetId: string, geneticProfileId: string, geneList: string): Promise<any> {
    const res = await fetch(
      this.baseUri +
        'cmd=getProfileData&case_set_id=' +
        encodeURI(caseSetId) +
        '&genetic_profile_id=' +
        encodeURI(geneticProfileId) +
        '&gene_list=' +
        geneList,
      { method: 'GET', mode: 'cors' }
    );
    return res.text();
    //  pp.then(res => this.parseTsv(res));
  }
  async getClinicalData(caseSetId: string): Promise<any> {
    const res = await fetch(this.baseUri + 'cmd=getClinicalData&case_set_id=' + encodeURI(caseSetId), {
      method: 'GET',
      mode: 'cors'
    });
    const res_1 = await res.text();
    return this.parseTsv(res_1);
  }
  async getGeneticProfiles(studyId: string): Promise<any> {
    const res = await fetch(this.baseUri + 'cmd=getGeneticProfiles&cancer_study_id=' + encodeURI(studyId), {
      method: 'GET'
    });
    const res_1 = await res.text();
    return this.parseTsv(res_1);
  }
  async getMutationData(caseSetId: string, geneticProfileId: string, geneList: string): Promise<any> {
    const res = await fetch(
      this.baseUri +
        'cmd=getMutationData&case_set_id=' +
        encodeURI(caseSetId) +
        '&genetic_profile_id=' +
        encodeURI(geneticProfileId) +
        '&gene_list=' +
        geneList,
      { method: 'GET', mode: 'cors' }
    );
    return res.text();
  }
}
