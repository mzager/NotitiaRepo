declare var Dexie: any;

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
    16384: '3\'UTR',
    32768: 'IGR',
    65536: '5\'UTR',
    131072: 'Targeted_Region',
    262144: 'Read-through',
    524288: '5\'Flank',
    1048576: '3\'Flank',
    2097152: 'Splice_Site_SNP',
    4194304: 'Splice_Site_Del',
    8388608: 'Splice_Site_Ins',
    16777216: 'Indel',
    33554432: 'R'
};

const baseUrl = 'http://oncoscape.v3.sttrcancer.org/data/tcga/';
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept-Encoding', 'gzip');
const requestInit: RequestInit = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};
const startTime: number = new Date().getTime();

const report = (msg: string) => {
    const date = new Date();
    const me = self as LoaderWorkerGlobalScope;
    // me.postMessage({ msg: msg, mins: date.getMinutes(), secs: date.getSeconds() }, null);
    console.log(msg + ' : ' + date.getMinutes() + ':' + date.getSeconds());
};

const loadManifest = (manifestUri: string): Promise<Array<{ name: string, type: string, url: string }>> => {
    fetch(manifestUri, requestInit)
        .then(response => response.json())
        .then(response => {
            Promise.all(response.map(processResource));
        });
    return null;
};

const processResource = (resource: { name: string, dataType: string, file: string }): Promise<any> => {
    resource.name = resource.name.replace(/ /gi, '').toLowerCase();
    return (resource.dataType === 'clinical' || resource.dataType === 'patient') ? loadClinical(resource.name, resource.file) :
        (resource.dataType === 'psmap') ? loadPatientSampleMap(resource.name, resource.file) :
            (resource.dataType === 'gistic_threshold') ? loadGisticThreshold(resource.name, resource.file) :
                (resource.dataType === 'gistic') ? loadGistic(resource.name, resource.file) :
                    (resource.dataType === 'mut') ? loadMutation(resource.name, resource.file) :
                        (resource.dataType === 'rna') ? loadRna(resource.name, resource.file) :
                            (resource.dataType === 'events') ? loadEvents(resource.name, resource.file) :
                                null;
};

// Complete
const loadEvents = (name: string, file: string): Promise<any> => {
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('Events Loaded'); return response.json(); })
        .then(response => {
            report('Events Parsed');
            const eventTable = [];
            const mult = 86400000;
            const lookup = Object.keys(response.map).reduce((p, c) => { p.push({ type: response.map[c], subtype: c }); return p; }, []);
            const data = response.data.map(datum => Object.assign({
                p: datum[0],
                start: datum[2], // * 86400000,
                end: datum[3], // * 86400000,
                data: datum[4]
            }, lookup[datum[1]]));
            report('Events Processed');
            return new Promise((resolve, reject) => {
                resolve([
                    { tbl: name, data: data },
                ]);
            });
        });
};

// Complete
const loadClinical = (name: string, file: string): Promise<any> => {
    report('Clinical Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('Clinical Loaded'); return response.json(); })
        .then(response => {
            report('Clinical Parsed');
            const patientMetaTable = Object.keys(response.fields).map((key, index) => ({
                ctype: 2,
                key: key,
                label: key.replace(/_/gi, ' '),
                tbl: 'patient',
                type: Array.isArray(response.fields[key]) ? 'STRING' : 'NUMBER',
                values: response.fields[key]
            }));
            const patientTable = response.ids.map((id, index) => {
                return patientMetaTable.reduce((p, v, i) => {
                    const value = response.values[index][i];
                    p[v.key] = (v.type === 'NUMBER') ? value : v.values[value];
                    return p;
                }, { p: id });
            });
            report('Clinical Processed');
            return new Promise((resolve, reject) => {
                resolve([
                    // { tbl: 'patientMeta', data: patientMetaTable },
                    { tbl: 'patient', data: patientTable }
                ]);
            });
        });
};

// Complete
const loadGisticThreshold = (name: string, file: string): Promise<any> => {
    report('Gistic Threshold Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('Gistic Threshold Loaded'); return response.json(); })
        .then(response => {
            report('Gistic Threshold Parsed');
            const gisticThresholdSampleIds = response.ids.map((s, i) => ({ i: i, s: s }));
            const gisticThresholdTable = response.values.map((v, i) => {
                const obj = v.reduce((p, c) => {
                    p.min = Math.min(p.min, c);
                    p.max = Math.max(p.max, c);
                    p.mean += c;
                    return p;
                }, { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 });
                obj.mean /= v.length;
                return obj;
            });
            report('Gistic Threshold Processed');
            return new Promise((resolve, reject) => {
                resolve([
                    { tbl: name, data: gisticThresholdTable },
                    { tbl: name + 'Map', data: gisticThresholdSampleIds }
                ]);
            });
        });
};

// Complete
const loadGistic = (name: string, file: string): Promise<any> => {
    report('Gistic Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('Gistic Loaded'); return response.json(); })
        .then(response => {
            report('Gistic Parsed');
            const gisticSampleIds = response.ids.map((s, i) => ({ i: i, s: s }));
            const gisticTable = response.values.map((v, i) => {
                const obj = v.reduce((p, c) => {
                    p.min = Math.min(p.min, c);
                    p.max = Math.max(p.max, c);
                    p.mean += c;
                    return p;
                }, { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 });
                obj.mean /= v.length;
                return obj;
            });
            report('Gistic Processed');
            return new Promise((resolve, reject) => {
                resolve([
                    { tbl: name, data: gisticTable },
                    { tbl: name + 'Map', data: gisticSampleIds }
                ]);
            });
        });
};

const loadPatientSampleMap = (name: string, file: string): Promise<any> => {
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('PS Map Loaded'); return response.json(); })
        .then(response => {
            report('Patient Sample Map Parsed');
            const data = Object.keys(response).reduce((p, c) => {
                response[c].forEach(v => { p.push({ p: c, s: v }); });
                return p;
            }, []);
            report('Patient Sample Map Processed');
            return new Promise((resolve, reject) => {
                resolve([
                    { tbl: 'patientSampleMap', data: data },
                ]);
            });
        });
};

const loadMutation = (name: string, file: string): Promise<any> => {
    report('Mutation Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('Mutation Loaded'); return response.json(); })
        .then(response => {
            report('Mutation Parsed');
            const ids = response.ids;
            const genes = response.genes;
            const mType = mutationType;
            const lookup = Object.keys(mType);
            const data = response.values.map(v => v
                .split('-')
                .map(v1 => parseInt(v1, 10))
                .map((v2, i) => (i === 0) ? genes[v2] : (i === 1) ? ids[v2] : v2)
            ).reduce((p, c) => {
                p.push(...lookup
                    .filter(v => (parseInt(v, 10) & c[2]))
                    .map(v => ({ m: c[0], s: c[1], t: mType[v] })));
                return p;
            }, []);
            report('Mutation Processed');
            return new Promise((resolve, reject) => {
                // TODO: This is a bug.  Need to replace token mut with value from result
                resolve([
                    { tbl: 'mut', data: data },
                ]);
            });
        });
};

// Complete
const loadRna = (name: string, file: string): Promise<any> => {
    report('RNA Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(response => { report('RNA Loaded'); return response.json(); })
        .then(response => {
            report('RNA Parsed');
            const rnaSampleIds = response.ids.map((s, i) => ({ i: i, s: s }));
            const rnaTable = response.values.map((v, i) => {
                const obj = v.reduce((p, c) => {
                    p.min = Math.min(p.min, c);
                    p.max = Math.max(p.max, c);
                    p.mean += c;
                    return p;
                }, { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 });
                obj.mean /= v.length;
                return obj;
            });
            report('RNA Processed');
            return new Promise((resolve, reject) => {
                resolve([
                    { tbl: name, data: rnaTable },
                    { tbl: name + 'Map', data: rnaSampleIds }
                ]);
            });
        });
};


onmessage = function (e) {
    const me = self as LoaderWorkerGlobalScope;
    switch (e.data.cmd) {
        case 'load':
            processResource(e.data.file).then(v => {
                me.postMessage(JSON.stringify(v));
            });
            break;
    }
};


