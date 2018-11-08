import Dexie from 'dexie';

// declare var Dexie: any;

/* Patient Sample Map, Dataset, Mutation */
/* Add Compounind index For Mut */
export interface LoaderWorkerGlobalScope extends Window {
  postMessage(data: any, transferList?: any): void;
  importScripts(src: string): void;
}
const mutationType = {
  1: 'Missense',
  2: 'Silent',
  4: 'Frame_Shift_Del',
  8: 'Splice_Site',
  16: 'Nonsense_Mutation',
  32: 'Frame_Shift_Ins',
  64: 'RNA',
  128: 'In_Frame_Del',
  256: 'In_Frame_Ins',
  512: 'Nonstop_Mutation',
  1024: 'Translation_Start_Site',
  2048: 'De_novo_Start_OutOfFrame',
  4096: 'De_novo_Start_InFrame',
  8192: 'Intron',
  // tslint:disable-next-line:quotemark
  16384: "3'UTR",
  32768: 'IGR',
  // tslint:disable-next-line:quotemark
  65536: "5'UTR",
  131072: 'Targeted_Region',
  262144: 'Read-through',
  // tslint:disable-next-line:quotemark
  524288: "5'Flank",
  // tslint:disable-next-line:quotemark
  1048576: "3'Flank",
  2097152: 'Splice_Site_SNP',
  4194304: 'Splice_Site_Del',
  8388608: 'Splice_Site_Ins',
  16777216: 'Indel',
  33554432: 'Other'
};

let baseUrl = 'https://oncoscape.v3.sttrcancer.org/data/tcga/';
let token = '';

let _requestInit = null;
const requestInit = (): RequestInit => {
  if (!_requestInit) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Encoding', 'gzip');
    if (token !== '') {
      headers.append('zager', token);
    }
    _requestInit = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };
  }
  return _requestInit;
};

// const requestInit: RequestInit = {
//   method: 'GET',
//   headers: headers,
//   mode: 'cors',
//   cache: 'default'
// };

const report = (msg: string) => {
  const date = new Date();
  const me = self as LoaderWorkerGlobalScope;
  me.postMessage(
    JSON.stringify({
      cmd: 'msg',
      msg: msg
    })
  );
};

const loadManifest = (manifestUri: string): Promise<Array<{ name: string; type: string; url: string }>> => {
  fetch(manifestUri, requestInit())
    .then(response => response.json())
    .then(response => {
      Promise.all(response.map(processResource));
    });
  report('Processing Manifest');
  return null;
};

const processResource = (resource: { name: string; dataType: string; file: string }): Promise<any> => {
  resource.name = resource.name.replace(/ /gi, '').toLowerCase();
  return resource.dataType === 'clinical' || resource.dataType === 'patient'
    ? loadPatient(resource.name, resource.file)
    : resource.dataType === 'psmap'
    ? loadPatientSampleMap(resource.name, resource.file)
    : resource.dataType === 'matrix'
    ? loadMatrix(resource.name, resource.file)
    : resource.dataType === 'gistic_threshold'
    ? loadMatrix(resource.name, resource.file)
    : resource.dataType === 'gistic'
    ? loadGistic(resource.name, resource.file)
    : resource.dataType === 'mut'
    ? loadMutation(resource.name, resource.file)
    : resource.dataType === 'rna'
    ? loadRna(resource.name, resource.file)
    : resource.dataType === 'events'
    ? loadEvents(resource.name, resource.file)
    : null;
};

// Complete
const loadEvents = (name: string, file: string): Promise<any> => {
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Loading Events');
      return response.json();
    })
    .then(response => {
      report('Events Parsed');
      const eventTable = [];
      const mult = 86400000;
      const lookup = Object.keys(response.map).reduce((p, c) => {
        p.push({ type: response.map[c], subtype: c });
        return p;
      }, []);
      const data = response.data.map(datum =>
        Object.assign(
          {
            p: datum[0].toLowerCase(),
            start: datum[2], // * 86400000,
            end: datum[3], // * 86400000,
            data: datum[4]
          },
          lookup[datum[1]]
        )
      );
      report('Processing Events');
      return new Promise((resolve, reject) => {
        resolve([{ tbl: name, data: data }]);
      });
    });
};

// Complete
const loadPatient = (name: string, file: string): Promise<any> => {
  report('Loading Subjects');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Subjects Loaded');
      return response.json();
    })
    .then(response => {
      report('Parsing Subjects');
      const patientMetaTable = Object.keys(response.fields).map((key, index) => ({
        ctype: 2,
        key: key.toLowerCase(),
        label: key.replace(/_/gi, ' '),
        tbl: 'patient',
        type: Array.isArray(response.fields[key]) ? 'STRING' : 'NUMBER',
        values: response.fields[key]
      }));
      const patientTable = response.ids.map((id, index) => {
        return patientMetaTable.reduce(
          (p, v, i) => {
            const value = response.values[index][i];
            p[v.key.toLowerCase()] = v.type === 'NUMBER' ? value : v.values[value];
            return p;
          },
          { p: id.toLowerCase() }
        );
      });
      report('Processing Clinical');
      return new Promise((resolve, reject) => {
        resolve([
          // { tbl: 'patientMeta', data: patientMetaTable },
          { tbl: 'patient', data: patientTable }
        ]);
      });
    });
};

const loadSample = (name: string, file: string): Promise<any> => {
  report('Loading Samples');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Samples Loaded');
      return response.json();
    })
    .then(response => {
      report('Parsing Samples');
      const sampleMetaTable = Object.keys(response.fields).map((key, index) => ({
        ctype: 1,
        key: key.toLowerCase(),
        label: key.replace(/_/gi, ' '),
        tbl: 'sample',
        type: Array.isArray(response.fields[key]) ? 'STRING' : 'NUMBER',
        values: response.fields[key]
      }));
      const sampleTable = response.ids.map((id, index) => {
        return sampleMetaTable.reduce(
          (p, v, i) => {
            const value = response.values[index][i];
            p[v.key.toLowerCase().replace(/\s/gi, '_')] = v.type === 'NUMBER' ? value : v.values[value];
            return p;
          },
          { s: id.toLowerCase() }
        );
      });
      report('Processing Samples');
      return new Promise((resolve, reject) => {
        resolve([
          // { tbl: 'patientMeta', data: patientMetaTable },
          { tbl: 'sample', data: sampleTable }
        ]);
      });
    });
};

// Complete
const loadMatrix = (name: string, file: string): Promise<any> => {
  report('Loading Molecular Matrix');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Molecular Matrix Loaded');
      return response.json();
    })
    .then(response => {
      report('Parsing Molecular Matrix');
      const sampleIds = response.ids.map((s, i) => ({
        i: i,
        s: s.toLowerCase()
      }));
      if (response.values === undefined) {
        response.values = response.data;
      }
      const sampleTable = response.values.map((v, i) => {
        const obj = v.reduce(
          (p, c) => {
            p.min = Math.min(p.min, c);
            p.max = Math.max(p.max, c);
            p.mean += c;
            return p;
          },
          { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 }
        );
        obj.mean /= v.length;
        return obj;
      });
      report('Processing Molecular Matrix');
      return new Promise((resolve, reject) => {
        resolve([{ tbl: name, data: sampleTable }, { tbl: name + 'Map', data: sampleIds }]);
      });
    });
};

// Complete
const loadGistic = (name: string, file: string): Promise<any> => {
  report('Loading Gistic Scores');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Gistic Loaded');
      return response.json();
    })
    .then(response => {
      report('Parsing Gistic Scores');
      const gisticSampleIds = response.ids.map((s, i) => ({
        i: i,
        s: s.toLowerCase()
      }));
      const gisticTable = response.values.map((v, i) => {
        const obj = v.reduce(
          (p, c) => {
            p.min = Math.min(p.min, c);
            p.max = Math.max(p.max, c);
            p.mean += c;
            return p;
          },
          { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 }
        );
        obj.mean /= v.length;
        return obj;
      });
      report('Processing Gistic Scores');
      return new Promise((resolve, reject) => {
        resolve([{ tbl: name, data: gisticTable }, { tbl: name + 'Map', data: gisticSampleIds }]);
      });
    });
};

const loadPatientSampleMap = (name: string, file: string): Promise<any> => {
  report('Loading Patient Sample Maps');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Parsing Patient Sample Maps');
      return response.json();
    })
    .then(response => {
      report('Processing Patient Sample Maps');
      const data = Object.keys(response).reduce((p, c) => {
        response[c].forEach(v => {
          p.push({ p: c.toLowerCase(), s: v.toLowerCase() });
        });
        return p;
      }, []);
      return new Promise((resolve, reject) => {
        resolve([{ tbl: 'patientSampleMap', data: data }]);
      });
    });
};

const loadMutation = (name: string, file: string): Promise<any> => {
  report('Loading Mutation Data');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Parsing Mutation Data');
      return response.json();
    })
    .then(response => {
      report('Processing Mutation Data');
      const ids = response.ids;
      const genes = response.genes;
      const mType = mutationType;
      const lookup = Object.keys(mType);

      const data = response.values
        .map(v =>
          v
            .split('-')
            .map(v1 => parseInt(v1, 10))
            .map((v2, i) => (i === 0 ? genes[v2] : i === 1 ? ids[v2] : v2))
        )
        .reduce((p, c) => {
          p.push(
            ...lookup.filter(v => parseInt(v, 10) & c[2]).map(v => ({ m: c[0], s: c[1].toLowerCase(), t: mType[v] }))
          );
          return p;
        }, []);

      return new Promise((resolve, reject) => {
        // TODO: This is a bug.  Need to replace token mut with value from result
        resolve([{ tbl: 'mut', data: data }]);
      });
    });
};

const loadMutationV3 = (name: string, file: string): Promise<any> => {
  report('Loading Mutation Data');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Parsing Mutation Data');
      return response.json();
    })
    .then(response => {
      report('Processing Mutation Data');
      const muts = Object.keys(response.muts).reduce((p, c) => {
        p[response.muts[c]] = c;
        return p;
      }, {});
      const ids = response.ids;
      const genes = response.genes;
      const mType = muts;
      const lookup = Object.keys(mType);
      const data = response.values
        .map(v =>
          v
            .split('-')
            .map(v1 => parseInt(v1, 10))
            .map((v2, i) => (i === 0 ? genes[v2] : i === 1 ? ids[v2] : v2))
        )
        .reduce((p, c) => {
          p.push(
            ...lookup.filter(v => parseInt(v, 10) & c[2]).map(v => ({ m: c[0], s: c[1].toLowerCase(), t: mType[v] }))
          );
          return p;
        }, []);

      return new Promise((resolve, reject) => {
        // TODO: This is a bug.  Need to replace token mut with value from result
        resolve([{ tbl: 'mut', data: data }]);
      });
    });
};

// Complete
const loadRna = (name: string, file: string): Promise<any> => {
  report('Loading RNA Data');
  return fetch(baseUrl + file + '.gz', requestInit())
    .then(response => {
      report('Parsing Rna Data');
      return response.json();
    })
    .then(response => {
      report('Processing RNA Data');
      const rnaSampleIds = response.ids.map((s, i) => ({
        i: i,
        s: s.toLowerCase()
      }));
      const rnaTable = response.values.map((v, i) => {
        const obj = v.reduce(
          (p, c) => {
            p.min = Math.min(p.min, c);
            p.max = Math.max(p.max, c);
            p.mean += c;
            return p;
          },
          { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 }
        );
        obj.mean /= v.length;
        return obj;
      });
      return new Promise((resolve, reject) => {
        resolve([{ tbl: name, data: rnaTable }, { tbl: name + 'Map', data: rnaSampleIds }]);
      });
    });
};

const processV31 = (resource: { name: string; dataType: string; file: string }): Promise<any> => {
  switch (resource.dataType.toLowerCase().trim()) {
    case 'patient':
      return loadPatient(resource.name, resource.file);
    case 'sample':
      return loadSample(resource.name, resource.file);
    case 'matrix':
      return loadMatrix(resource.name, resource.file);
    case 'events':
      return loadEvents(resource.name, resource.file);
    case 'mut':
      return loadMutationV3(resource.name, resource.file);
    case 'psmap':
      return loadPatientSampleMap(resource.name, resource.file);
    default:
      return new Promise((resolve, reject) => {
        resolve();
      });
  }
};

onmessage = function(e) {
  const me = self as LoaderWorkerGlobalScope;

  switch (e.data.cmd) {
    case 'load':
      const db = new Dexie('notitia-' + e.data.uid);
      baseUrl = e.data.baseUrl;
      token = e.data.token;
      db.open().then(v => {
        if (e.data.hasOwnProperty('version')) {
          if (e.data.version === '3.1') {
            try {
              processV31(e.data.file).then(values => {
                const tables: Array<{ tbl: string; data: Array<any> }> = values;

                Promise.all(
                  tables.map(tbl => {
                    if (tbl.tbl.toLowerCase().trim() === 'sample' || tbl.tbl.toLowerCase().trim() === 'patient') {
                      const d = tbl.data.map(datum => {
                        const rv = Object.keys(datum).reduce((p, c) => {
                          p[c.trim().replace(/ /gi, '_')] = datum[c];
                          return p;
                        }, {});
                        return rv;
                      });

                      return db.table(tbl.tbl).bulkAdd(d);
                    }

                    return db.table(tbl.tbl).bulkAdd(tbl.data);
                  })
                ).then(() => {
                  report('Saving ' + tables[0].tbl);
                  me.postMessage(
                    JSON.stringify({
                      cmd: 'terminate'
                    })
                  );
                });
              });
            } catch (e) {}
          }
        } else {
          try {
            processResource(e.data.file).then(values => {
              const tables: Array<{ tbl: string; data: Array<any> }> = values;
              tables.forEach(w => {
                if (w.tbl.indexOf('matrix') === 0) {
                  w.tbl = w.tbl.replace('matrix', '').replace(/_/gi, '');
                }
              });

              Promise.all(tables.map(tbl => db.table(tbl.tbl).bulkAdd(tbl.data)))
                .then(() => {
                  report('Saving ' + tables[0].tbl);
                  me.postMessage(
                    JSON.stringify({
                      cmd: 'terminate'
                    })
                  );
                })
                .catch(e => {});
            });
          } catch (e) {}
        }
      });
      break;
  }
};
