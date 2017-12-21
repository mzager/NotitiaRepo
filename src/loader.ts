declare var Dexie: any;

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

const baseUrl = 'https://s3-us-west-2.amazonaws.com/notitia/firehose/';
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
    return (resource.dataType === 'clinical') ? loadClinical(resource.name, resource.file) :
        (resource.dataType === 'gistic_threshold') ? loadGisticThreshold(resource.name, resource.file) :
            (resource.dataType === 'gistic') ? loadGistic(resource.name, resource.file) :
                (resource.dataType === 'mut') ? loadMutation(resource.name, resource.file) :
                    (resource.dataType === 'rna') ? loadRna(resource.name, resource.file) :
                        (resource.dataType === 'events') ? loadEvents(resource.name, resource.file) :
                        null;
};


const loadEvents = (name: string, file: string): Promise<any> => {
    return fetch(baseUrl + file, requestInit)
        .then(response => { report('Events Loaded'); return response.json(); })
        .then(response => {
            report('Events Parsed');
            const eventTable = [];
            const mult = 86400000;
            debugger;
            // {
            //     data:{gender: "female", race: "white", ethnicity: "not hispanic or latino"},
            //     end:-387997200000,
            //     p:"TCGA-02-0001",
            //     start:-387997200000,
            //     subtype:"Birth",
            //     type: "Status"
            // }
            report('Events Processed');
            return new Promise( (resolve, reject) => {
                resolve([]);
            });
        });
};
const loadClinical = (name: string, file: string): Promise<any> => {
    report('Clinical Requested');
    return fetch(baseUrl + file, requestInit)
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
            return new Promise( (resolve, reject) => {
                resolve([
                    {tbl: 'patientMeta', data: patientMetaTable},
                    {tbl: 'patient', data: patientTable}
                ]);
            });
        });
};

const loadGisticThreshold = (name: string, file: string): Promise<any> => {
    report('Gistic Threshold Requested');
    return fetch(baseUrl + file, requestInit)
        .then(response => { report('Gistic Threshold Loaded'); return response.json(); })
        .then(response => {
            report('Gistic Threshold Parsed');
            const gisticThresholdSampleIds = response.ids;
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
            return new Promise( (resolve, reject) => {
                resolve([
                    { tbl: name, data: gisticThresholdTable },
                    { tbl: name + 'Map', data: gisticThresholdSampleIds }
                ]);
            });
        });
};

const loadGistic = (name: string, file: string): Promise<any> => {
    report('Gistic Requested');
    return fetch(baseUrl + file, requestInit)
        .then(response => { report('Gistic Loaded'); return response.json(); })
        .then(response => {
            report('Gistic Parsed');
            const gisticSampleIds = response.ids;
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
            return new Promise( (resolve, reject) => {
                resolve([
                    { tbl: name, data: gisticTable },
                    { tbl: name + 'Map', data: gisticSampleIds }
                ]);
            });
        });
};

const loadMutation = (name: string, file: string): Promise<any> => {
    report('Mutation Requested');
    return fetch(baseUrl + file, requestInit)
        .then(response => { report('Mutation Loaded'); return response.json(); })
        .then(response => {
            report('Mutation Parsed');
            return new Promise( (resolve, reject) => {
                resolve([]);
            });
        });
};

const loadRna = (name: string, file: string): Promise<any> => {
    report('RNA Requested');
    return fetch(baseUrl + file, requestInit)
        .then(response => { report('RNA Loaded'); return response.json(); })
        .then(response => {
            report('RNA Parsed');
            const rnaSampleIds = response.ids;
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
            return new Promise( (resolve, reject) => {
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
            processResource(e.data.file).then( v => {
                me.postMessage( JSON.stringify(v) );
            });
            break;
    }
};


