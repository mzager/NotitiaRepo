import { EdgeConfigModel } from './../component/visualization/edges/edges.model';
import { interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import { DedicatedWorkerGlobalScope } from 'compute';
import { scaleLinear, InterpolatorFactory, scaleSequential, scaleQuantize, scaleQuantile } from 'd3-scale';
import { interpolateRgb, interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';
import { GraphConfig } from './../model/graph-config.model';
import { Legend } from './../model/legend.model';
import { DataTypeEnum, ShapeEnum, EntityTypeEnum, CollectionTypeEnum, DirtyEnum } from './../model/enum.model';
import { DataField } from './../model/data-field.model';
import * as _ from 'lodash';
import * as PouchDB from 'pouchdb-browser';
import Dexie from 'dexie';
import * as uuids from 'uuid-by-string';
import * as cbor from 'cbor-js';
import { Md5 } from 'ts-md5/dist/md5';
import { sample } from 'rxjs/operator/sample';

export class ComputeWorkerUtil {

    dbData: Dexie = null;
    dbLookup: Dexie = null;


    private sizes = [1, 2, 3, 4];
    private shapes = [ShapeEnum.CIRCLE, ShapeEnum.SQUARE, ShapeEnum.TRIANGLE, ShapeEnum.CONE];

    public colors4 = [0x419268, 0xd044cc ,0x55a338, 0x754ad0, 0xc58528, 0x6885ce, 0xdd5031, 0x6a448f, 0x777d30, 0xc454a9,0xb17048,0xdd416c,0x97392b,0xc9759a];
    public colors3 = [0xf06292, 0xba68c8, 0x9575cd, 0x7986cb, 0x64b5f6, 0x80cbc4, 0xffcc80, 0xbcaaa4];
    public colors = [0xd50000, 0xaa00ff, 0x304ffe, 0x0091ea, 0x00bfa5, 0x64dd17, 0xffd600, 0xff6d00,
        0xff8a80, 0xea80fc, 0x8c9eff, 0x80d8ff, 0xa7ffeb, 0xccff90, 0xffff8d, 0xffd180];
    public colors2 = [0xb71c1c, 0x880e4f, 0x4a148c, 0x311b92, 0x1a237e, 0x0d47a1, 0x01579b, 0x006064,
        0x004d40, 0x1b5e20, 0x33691e, 0x827717, 0xf57f17, 0xff6f00, 0xe65100, 0xbf360c, 0x3e2723,
        0xf44336, 0xe91e63, 0x9c27b0, 0x673ab7, 0x3f51b5, 0x2196f3, 0x03a9f4, 0x00bcd4, 0x009688,
        0x4caf50, 0x8bc34a, 0xcddc39, 0xffeb3b, 0xffc107, 0xff9800, 0xff5722, 0x795548];

    constructor() {
    }


    generateCacheKey(config: Object): string {

        const keys = Object.keys(config).filter(v => {
            switch (v) {
                case 'dirtyFlag':
                case 'visualization':
                case 'graph':
                case 'sampleSelect':
                case 'markerSelect':
                case 'pointColor':
                case 'pointShape':
                case 'pointSize':
                case 'pointIntersect':
                    return false;
            }
            return true;
        });
        const str = keys.reduce((p, c) => {
            p += JSON.stringify(config[c]);
            return p;
        }, '');
        const uuid = uuids(str);
        return uuid;
    }

    processShapeColorSizeIntersect(config: GraphConfig, worker: DedicatedWorkerGlobalScope) {

        if ((config.dirtyFlag & DirtyEnum.COLOR) > 0) {
            worker.util.getColorMap(config.entity, config.markerFilter, config.sampleFilter, config.database, config.pointColor).then(
                result => {
                    worker.postMessage({
                        config: config,
                        data: {
                            legendColor: result.legend,
                            pointColor: result.map
                        }
                    });
                    worker.postMessage('TERMINATE');
                }
            );
        }

        if ((config.dirtyFlag & DirtyEnum.SIZE) > 0) {
            worker.util.getSizeMap(config.entity, config.markerFilter, config.sampleFilter, config.database, config.pointSize).then(
                result => {
                    worker.postMessage({
                        config: config,
                        data: {
                            legendSize: result.legend,
                            pointSize: result.map
                        }
                    });
                    worker.postMessage('TERMINATE');
                }
            );
        }

        if ((config.dirtyFlag & DirtyEnum.SHAPE) > 0) {
            worker.util.getShapeMap(config.entity, config.markerFilter, config.sampleFilter, config.database, config.pointShape).then(
                result => {
                    worker.postMessage({
                        config: config,
                        data: {
                            legendShape: result.legend,
                            pointShape: result.map
                        }
                    });
                    worker.postMessage('TERMINATE');
                }
            );
        }

        if ((config.dirtyFlag & DirtyEnum.INTERSECT) > 0) {
            worker.util.getIntersectMap(config.markerFilter, config.sampleFilter, config.database, config.pointIntersect).then(
                result => {
                    worker.postMessage({
                        config: config,
                        data: {
                            legendIntersect: result.legend,
                            pointIntersect: result.map
                        }
                    });
                }
            );
        }
    }
    getGeneLinkInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseLookup().then(v => {
                Promise.all([
                    this.dbLookup.table('genelinks').toArray()
                    , this.dbLookup.table('genecoords').toArray()
                ]).then(result => {
                    resolve(result);
                });
            });
        });
    }
    getGeneLinkInfoByGenes(genes: Array<string>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseLookup().then(v => {
                this.dbLookup.table('genelinks')
                    .where('source').anyOfIgnoreCase(genes)
                    .or('target').anyOfIgnoreCase(genes).toArray()
                    .then(result => {
                        resolve(result);
                    });
            });
        });
    }
    getGeneLinkGraphByGenes(gene: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseLookup().then(v => {
                this.dbLookup.table('genelinks').where('target').equalsIgnoreCase(gene).toArray()
                    .then(result => {
                        const sourceGenesInNetwork = result.map(link => link.source);
                        sourceGenesInNetwork.push(gene);
                        this.dbLookup.table('genelinks').where('source').anyOfIgnoreCase(sourceGenesInNetwork).toArray()
                            .then(results => {
                                resolve(results);
                            });
                    });
            });
        });
    }
    getChromosomeInfo(chromosome: string, genes: Array<string>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseLookup().then(v => {
                if (genes.length === 0) {
                    this.dbLookup.table('genecoords').where('chr').equalsIgnoreCase(chromosome).toArray()
                        .then(result => {
                            resolve(result);
                        });
                } else {
                    this.dbLookup.table('genecoords').where('gene').anyOfIgnoreCase(genes).and(
                        gene => gene.chr === chromosome).toArray()
                        .then(result => {
                            resolve(result);
                        });
                }
            });
        });
    }
    getCytobands(alignment: string): Promise<any> {
        return fetch('https://s3-us-west-2.amazonaws.com/notitia/reference/hg-' + alignment + '-cytoband.json.gz', {
            method: 'GET'
        }).then(res => res.json())
    }

    getGenes(alignment: string): Promise<any> {
        return fetch('https://s3-us-west-2.amazonaws.com/notitia/reference/hg-' + alignment + '-genes.json.gz', {
            method: 'GET'
        }).then(res => res.json());
    }

    getGenomePositions(alignment: string): Promise<any> {
        return Promise.all([
            this.getCytobands(alignment),
            this.getGenes(alignment)
        ]);
    }

    getGenomeInfo(genes: Array<string>): Promise<any> {
        console.log('THIS SHOULD BE DEPRECATED');
        return new Promise((resolve, reject) => {
            this.openDatabaseLookup().then(v => {
                Promise.all([
                    this.dbLookup.table('bandcoords').toArray(),
                    this.dbLookup.table('genecoords').where('gene').anyOfIgnoreCase(genes).toArray()
                ]).then(result => {
                    resolve(result);
                });
            });
        });
    }
    openDatabaseLookup(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.dbLookup === null) {
                this.dbLookup = new Dexie('notitia');
                this.dbLookup.open().then(resolve);
            } else {
                if (this.dbLookup.isOpen()) {
                    resolve();
                } else {
                    this.dbLookup.open().then(resolve);
                }
            }
        });
    }
    openDatabaseData(db): Promise<Dexie> {
        return new Promise((resolve, reject) => {
            if (this.dbData === null) {
                this.dbData = new Dexie('notitia-' + db);
                this.dbData.open().then(resolve);
            } else {
                if (this.dbData.isOpen()) {
                    resolve(this.dbData);
                } else {
                    this.dbData.open().then(resolve);
                }
            }
        });
    }

    // Call IDB
    getEventData(db: string, pids: Array<string>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                const query = (pids.length === 0) ?
                    this.dbData.table('events') :
                    this.dbData.table('events').where('p').anyOfIgnoreCase(pids);
                query.toArray().then(_events => {
                    resolve(_events);
                });
            });
        });
    }
    getPatientData(samples: Array<string>, db: string, tbl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                console.log('Filter by Seleted Patients / Samples');
                // const query = (samples.length === 0) ?
                //     this.dbData.table(tbl) :
                //     this.dbData.table(tbl).where('p').anyOfIgnoreCase(markers);
                this.dbData.table(tbl).toArray().then(_patients => {
                    resolve(_patients);
                });
            });
        });
    }

    getTads(): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch('https://s3-us-west-2.amazonaws.com/notitia/reference/tads.json.gz', {
                method: 'GET'
            }).then(res => { res.json().then(resolve); });
        });
    }
    getMatrix(markers: Array<string>, samples: Array<string>, map: string, db: string, tbl: string, entity: EntityTypeEnum): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                map = map.replace(/ /gi, '');
                tbl = tbl.replace(/ /gi, '');
                const sampleQuery = (samples.length === 0) ?
                    this.dbData.table(map) :
                    this.dbData.table(map).where('s').anyOfIgnoreCase(samples);
                sampleQuery.toArray().then(_samples => {
                    const query = (markers.length === 0) ?
                        this.dbData.table(tbl) :
                        this.dbData.table(tbl).where('m').anyOfIgnoreCase(markers);
                    query.toArray().then(_markers => {
                        resolve({
                            markers: _markers.map(m => m.m),
                            samples: _samples.map(s => s.s),
                            data: (entity === EntityTypeEnum.GENE) ?
                                _markers.map(marker => _samples.map(sample => marker.d[sample.i])) :
                                _samples.map(sample => _markers.map(marker => marker.d[sample.i]))
                        });
                    });
                });
            });
        });
    }

    getEdgesSampleSample(config: EdgeConfigModel): Promise<any> {
        return new Promise((resolve, reject) => {
            // Bounce Early
            if (config.pointColor.key === 'None') {
                resolve([]);
                return;
            }
            this.openDatabaseData(config.database).then(v => {
                Promise.all([
                    this.dbData.table('patient').toArray(),
                    this.dbData.table('patientSampleMap').toArray()
                ]).then(result => {
                    const patientMap = result[0].reduce((p, c) => { p[c.p] = c; return p; }, {});
                    const colorField = config.pointColor.key;
                    const intersectField = config.pointIntersect.key;
                    const edges = result[1].map(ps => {
                        const rv = { a: ps.s, b: ps.s, c: null, i: null };
                        if (patientMap.hasOwnProperty(ps.p)) {
                            const patient = patientMap[ps.p];
                            if (patient.hasOwnProperty(colorField) && colorField !== 'None') {
                                rv.c = patient[colorField];
                            }
                            if (patient.hasOwnProperty(intersectField) && intersectField !== 'None') {
                                rv.i = patient[intersectField];
                            }
                        }
                        return rv;
                    });
                    if (colorField !== 'None') {
                        const colorValues = edges.map<number>((value) => value.c);
                        const colorScale = scaleSequential<number>(interpolateSpectral)
                            .domain([Math.min(...colorValues), Math.max(...colorValues)]);
                        edges.forEach(edge => edge.c = colorScale(edge.c));
                    }
                    if (intersectField !== 'None') {
                        let bins = 0;
                        let intersectScale: any;
                        const colorValues = edges.map<number>((value) => value.i);
                        switch (config.pointIntersect.type) {
                            case DataTypeEnum.STRING:
                                bins = config.pointIntersect.values.length;
                                intersectScale = (value) => config.pointIntersect.values.indexOf(value) + 1;
                                break;
                            case DataTypeEnum.NUMBER:
                                bins = 6;
                                intersectScale = scaleQuantile<number>()
                                    .domain([Math.min(...colorValues), Math.max(...colorValues)])
                                    .range([1, 2, 3, 4, 5, 6]);
                                break;
                        }
                        edges.forEach(edge => edge.i = intersectScale(edge.i));
                    }
                    resolve(edges);
                });
            });
        });
    }

    getEdgesGeneGene(config: EdgeConfigModel): Promise<any> {

        return new Promise((resolve, reject) => {
            // Bounce Early
            if (config.pointColor.key === 'None') {
                resolve([]);
                return;
            }
            this.openDatabaseData(config.database).then(v => {
                this.getMolecularGeneValues(config.markerFilter, config.pointColor, config.database).then(result => {
                    const edges = result.map(gene => ({
                        a: gene.m,
                        b: gene.m,
                        c: gene.mean,
                        i: null
                    }));
                    const colorValues = edges.map((value) => value.c);
                    const colorScale = scaleSequential<number>(interpolateSpectral)
                        .domain([Math.min(...colorValues), Math.max(...colorValues)]);
                    edges.forEach(edge => edge.c = colorScale(edge.c));
                    resolve(edges);
                });
            });
        });
    }

    getEdgesGeneSample(config: EdgeConfigModel): Promise<any> {
        return new Promise((resolve, reject) => {
            // Bounce Early
            if (config.pointColor.key === 'None') {
                resolve([]);
                return;
            }
            this.getMatrix(config.markerFilter, config.sampleFilter, 'gismutMap', config.database, 'gisticT', EntityTypeEnum.GENE)
                .then((result: any) => {
                    const edges: Array<any> = [];
                    const nMarkers = result.markers.length;
                    const nSamples = result.samples.length;
                    const aIsGene = (config.entityA === EntityTypeEnum.GENE);
                    for (let iMarker = 0; iMarker < nMarkers; iMarker++) {
                        for (let iSample = 0; iSample < nSamples; iSample++) {
                            const value = result.data[iMarker][iSample];
                            const color = (value === -2) ? this.colors[0] :
                                (value === -1) ? this.colors[1] :
                                    (value === 1) ? this.colors[2] :
                                        this.colors[3];
                            edges.push({
                                a: (aIsGene) ? result['markers'][iMarker] : result['samples'][iSample],
                                b: (aIsGene) ? result['samples'][iSample] : result['markers'][iMarker],
                                c: color,
                                i: null
                            });
                        }
                    }

                    // const edges: Array<any> = [];
                    // const aIsGene = (config.entityA === EntityTypeEnum.GENE);
                    // const colorField = (config.pointColor.key !== 'None');
                    // const intersectField = (config.pointIntersect.key !== 'None');
                    // result.data.forEach((gene, geneIndex) => gene.forEach((sample, sampleIndex) => {
                    //     if (sample !== 0) {
                    //         const rv = { a: null, b: null, c: 0x333333, i: null };
                    //         rv.a = aIsGene ? result['markers'][geneIndex] : result['samples'][sampleIndex];
                    //         rv.b = !aIsGene ? result['markers'][geneIndex] : result['samples'][sampleIndex];
                    //         if (intersectField) {
                    //             rv.i = (sample === -2) ? 1 :
                    //                 (sample === -1) ? 2 :
                    //                     (sample === 1) ? 3 :
                    //                         4;
                    //         }
                    //         if (colorField) {
                    //             rv.c = (sample === -2) ? this.colors[0] :
                    //                 (sample === -1) ? this.colors[1] :
                    //                     (sample === 1) ? this.colors[2] :
                    //                         this.colors[3];
                    //         }
                    //         edges.push(rv);
                    //     }
                    // }));
                    resolve(edges);
                });
        });
    }

    getSamplePatientMap(db: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                this.dbData.table('patientSampleMap').toArray().then(result => {
                    resolve(result);
                });
            });
        });
    }


    getMolecularGeneValues(markers: Array<string>, field: any, db: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                if (markers.length === 0) {
                    this.dbData.table(field.tbl).toArray()
                        .then(result => {
                            resolve(result);
                        });
                } else {
                    this.dbData.table(field.tbl).where('m').anyOfIgnoreCase(markers).toArray()
                        .then(result => {
                            resolve(result);
                        });
                }
            });
        });
    }


    getColorMap(entity: EntityTypeEnum, markers: Array<string>, samples: Array<string>, db: string, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {

                // Gene Color Maps
                if (entity === EntityTypeEnum.GENE) {
                    if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                        this.getMolecularGeneValues(markers, field, db).then(result => {

                            console.log('Would be good to subset color by Filtered Samples / Patients...  Revisit');

                            const geneDomain = result.reduce((p, c) => {
                                p.min = Math.min(p.min, c.mean);
                                p.max = Math.max(p.max, c.mean);
                                return p;
                            }, { min: Infinity, max: -Infinity });

                            const scale = scaleLinear<number, number>()
                                .domain([geneDomain.min, geneDomain.max])
                                .range([1, 0]);

                            const colorMap = result.reduce((p, c) => {
                                p[c.m] = interpolateSpectral(scale(c.mean));
                                return p;
                            }, {});

                            // Build Legend
                            const legend: Legend = new Legend();
                            legend.name = field.label;
                            legend.type = 'COLOR';
                            legend.display = 'CONTINUOUS';
                            legend.labels = [geneDomain.min, geneDomain.max].map(val => Math.round(val).toString());
                            legend.values = [0xFF0000, 0xFF0000];

                            resolve({ map: colorMap, legend: legend });
                        });
                    } else if (field.ctype & CollectionTypeEnum.TAD) {
                        Promise.all([
                            this.getGenes('19'),
                            this.getTads()
                        ]).then(result => {
                            const m = markers;
                            const posMap = result[0].reduce((p, c) => { p[c[0]] = c[5]; return p; }, {});
                            const tads = result[1];
                            const pos = markers.map(w => ({ gene: w, pos: posMap[w] }))
                                .map(w => {
                                    let tad;
                                    if (w.pos === undefined) {
                                        tad = -1;
                                    } else {
                                        tad = tads.find(c => c.s <= w.pos && c.e >= w.pos);
                                    }
                                    return { gene: w.gene, tad: tad.s + '-' + tad.e };
                                });
                            const tadGroups = _.groupBy(pos, 'tad');
                            const colors = this.colors;
                            const colorGroups = Object.keys(tadGroups).map(w => ({
                                name: w,
                                genes: tadGroups[w].map(x => x.gene),
                                len: tadGroups[w].length
                            })).sort((a, b) => b.len - a.len)
                                .map((w, i) => Object.assign(w, { color: colors[i] }));
                            const cm = colorGroups.reduce((p, c) => {
                                return Object.assign(p, c.genes.reduce((p2, c2) => {
                                    p2[c2] = c.color;
                                    return p2;
                                }, {}));
                            }, {});
                            // const legend: Legend = new Legend();
                            const legend: Legend = new Legend();
                            legend.name = field.label;
                            legend.type = 'COLOR';
                            legend.display = 'CONTINUOUS';
                            legend.labels = [0, 100].map(val => Math.round(val).toString());
                            legend.values = [0xFF0000, 0xFF0000];

                            resolve({ map: cm, legend: legend });

                        });

                    } else if (field.ctype & CollectionTypeEnum.GENE_TYPE) {
                        // Redo
                        this.openDatabaseLookup().then((r: any) => {
                            this.dbLookup.table('genecoords').where('gene').anyOfIgnoreCase(markers).toArray().then(result => {
                                result.reduce((p, c) => { p[c.type] = true; return p; }, {});
                                const types = Object.keys(result
                                    .reduce((p, c) => { p[c.type] = true; return p; }, {}))
                                    .reduce((p, c, i) => {
                                        p[c] =
                                            (i < this.colors.length) ? this.colors[i] : 0x039BE5;
                                        return p;
                                    }, {});
                                const cm = result.reduce((p, c) => { p[c.gene] = types[c.type]; return p; }, {});
                                const legend: Legend = new Legend();
                                legend.name = 'Gene Type';
                                legend.type = 'COLOR';
                                legend.display = 'DISCRETE';
                                legend.labels = Object.keys(types).map(key => key.replace(/_/gi, ' '));
                                // just to many types for color options.. defautl to blue (see above too)
                                legend.values = Object.keys(types).map(key => types[key] ? types[key] : 0x039BE5);
                                resolve({ map: cm, legend: legend });
                            });
                        });
                    } else if (field.ctype & CollectionTypeEnum.HIC) {
                        const legend: Legend = new Legend();
                        legend.name = 'Hic';
                        legend.type = 'COLOR';
                        legend.display = 'DISCRETE';
                        legend.labels = ['Knot 0', 'Knot 1', 'Knot 2', 'Knot 3', 'Knot 4', 'Knot 5', 'Knot 6', 'Knot 7', 'Knot 8',
                            'Knot 9', 'Knot 10', 'Knot 11', 'Knot 12', 'Knot 13', 'Knot 14', 'Knot 15'];
                        // tslint:disable-next-line:max-line-length
                        legend.values = [13959168, 11141375, 3166206, 37354, 49061, 6610199, 16766464, 16739584, 16747136, 15368444, 9215743,
                            8444159, 11010027, 13434768, 16777101, 16765312];
                        const colorMap = {
                            'ORAOV1': 13959168,
                            'FADD': 13959168, 'RAB1B': 13959168,
                            'SLC29A2': 13959168, 'PELI3': 13959168, "LOC100130987": 13959168, "BRMS1": 13959168, "B3GNT1": 13959168, "SLC25A45": 13959168, "TSGA10IP": 13959168, "SSSCA1-AS1": 13959168, "SSSCA1": 13959168, "SNX32": 13959168, "SCYL1": 13959168, "NEAT1": 13959168, "MIR612": 13959168, "MIR548AR": 13959168, "MAP3K11": 13959168, "MALAT1": 13959168, "FAM89B": 13959168, "CORO1B": 13959168, "PITPNM1": 13959168, "GSTP1": 13959168, "CDK2AP2": 13959168, "AIP": 13959168, "TMEM109": 13959168, "VPS37C": 13959168, "SDHAF2": 13959168, "CPSF7": 13959168, "CD5": 13959168, "GAL": 13959168, "TPCN2": 13959168, "MRGPRD": 13959168, "KLC2": 13959168, "YIF1A": 13959168, "TMEM151A": 13959168, "RIN1": 13959168, "SF3B2": 13959168, "SART1": 13959168, "PACS1": 13959168, "GAL3ST3": 13959168, "FIBP": 13959168, "EFEMP2": 13959168, "CTSW": 13959168, "CST6": 13959168, "CCDC85B": 13959168, "EIF1AD": 13959168, "CNIH2": 13959168, "CD248": 13959168, "CATSPER1": 13959168, "BANF1": 13959168, "MUS81": 13959168, "FOSL1": 13959168, "CFL1": 13959168, "AP5B1": 13959168, "TMEM216": 13959168, "TMEM138": 13959168, "MIR4488": 13959168, "LRRC10B": 13959168, "PRPF19": 13959168, "RPS6KB2": 13959168, "EEF1G": 13959168, "ZBTB3": 13959168, "WDR74": 13959168, "UBXN1": 13959168, "TAF6L": 13959168, "STX5": 13959168, "SNORD31": 13959168, "SNORD30": 13959168, "SNORD29": 13959168, "SNORD28": 13959168, "SNORD27": 13959168, "SNORD26": 13959168, "SNORD25": 13959168, "SNORD22": 13959168, "SNORA57": 13959168, "SNHG1": 13959168, "SLC3A2": 13959168, "ROM1": 13959168, "POLR2G": 13959168, "NXF1": 13959168, "MTA2": 13959168, "METTL12": 13959168, "LRRN4CL": 13959168, "INTS5": 13959168, "EML3": 13959168, "C11ORF83": 13959168, "C11ORF48": 13959168, "BSCL2": 13959168, "DAK": 13959168, "DAGLA": 13959168, "CYB561A3": 13959168, "SF1": 13959168, "ZNHIT2": 13959168, "ZFPL1": 13959168, "VPS51": 13959168, "TM7SF2": 13959168, "SYVN1": 13959168, "MRPL49": 13959168, "MIR194-2": 13959168, "MIR192": 13959168, "GPHA2": 13959168, "FAU": 13959168, "EHD1": 13959168, "CDCA5": 13959168, "CDC42BPG": 13959168, "KCNK4": 13959168, "TEX40": 13959168, "ESRRA": 13959168, "ZP1": 13959168, "SYT12": 13959168, "SSH3": 13959168, "KDM2A": 13959168, "CLCF1": 13959168, "RHOD": 13959168, "POLD4": 13959168, "C11ORF86": 13959168, "PTGDR2": 13959168, "C11ORF85": 13959168, "CAPN1": 13959168, "ARL2-SNX15": 13959168, "ARL2": 13959168, "STIP1": 13959168, "GPR137": 13959168, "CCDC88B": 13959168, "BAD": 13959168, "RCOR2": 13959168, "NAA40": 13959168, "FERMT3": 13959168, "COX8A": 13959168, "MACROD1": 13959168, "MARK2": 13959168, "SLC22A11": 13959168, "NRXN2": 13959168, "C11ORF84": 13959168, "SLC22A12": 13959168, "RASGRP2": 13959168, "PYGM": 13959168, "RAD9A": 13959168, "CARNS1": 13959168, "ACY3": 13959168, "PC": 13959168, "SCGB2A1": 13959168, "SCGB2A2": 13959168, "SCGB1D2": 13959168, "CCDC86": 13959168, "RCE1": 13959168, "SCGB1D4": 13959168, "AHNAK": 13959168, "RBM4B": 13959168, "RBM14-RBM4": 13959168, "RBM4": 13959168, "SCGB1A1": 13959168, "MIR3654": 13959168, "RBM14": 13959168, "CCS": 13959168, "CCDC87": 13959168, "BBS1": 13959168, "RNASEH2C": 13959168, "GPR152": 13959168, "TMEM223": 13959168, "TMEM179B": 13959168, "KAT5": 13959168, "VWCE": 13959168, "RTN3": 13959168, "FLRT1": 13959168, "ATL3": 13959168, "NPAS4": 13959168, "MRPL11": 13959168, "DPP3": 13959168, "PPP6R3": 13959168, "MRPL21": 13959168, "MRGPRF": 13959168, "IGHMBP2": 13959168, "LRP5": 13959168, "MTL5": 13959168, "NUDT8": 13959168, "UNC93B1": 13959168, "FAM86C2P": 13959168, "ALDH3B2": 13959168, "ALDH3B1": 13959168, "C11ORF24": 13959168, "MYRF": 13959168, "TMEM258": 13959168, "MIR611": 13959168, "FTH1": 13959168, "FEN1": 13959168, "FADS2": 13959168, "SUV420H1": 13959168, "DOC2GP": 13959168, "LTBP3": 13959168, "RELA": 13959168, "DPF2": 13959168, "CDC42EP2": 13959168, "PPP2R5B": 13959168, "TIGD3": 13959168, "POLA2": 13959168, "LOC100130348": 13959168, "FRMD8": 13959168, "SPDYC": 13959168, "SAC3D1": 13959168, "SYT7": 13959168, "SLC22A20": 13959168, "SCGB1D1": 13959168, "SIPA1": 13959168, "MIR4489": 13959168, "FADS3": 13959168, "BEST1": 13959168, "MS4A10": 13959168, "FADS1": 13959168, "INCENP": 13959168, "TUT1": 13959168, "NDUFV1": 13959168, "TBX10": 13959168, "MIR1908": 13959168, "RAB3IL1": 13959168, "RPS6KA4": 13959168, "LOC100996455": 13959168, "DKFZP434K028": 13959168, "CD6": 13959168, "PGA3": 13959168, "MYEOV": 13959168, "MIR3680-2": 13959168, "HRASLS2": 13959168, "MIR3680-1": 13959168, "CPT1A": 13959168, "FGF19": 13959168, "ANO1": 13959168, "SLC15A3": 13959168, "TCIRG1": 13959168, "DDB1": 13959168, "MAP4K2": 13959168, "B3GAT3": 13959168, "PPP1R14B": 13959168, "TRMT112": 13959168, "PRDX5": 13959168, "PLCB3": 13959168, "NDUFS8": 13959168, "CHKA": 13959168, "FKBP2": 13959168, "MIR4691": 13959168, "VEGFB": 13959168, "TRPT1": 13959168, "NUDT22": 13959168, "DNAJC4": 13959168, "PTPRCAP": 13959168, "CABP2": 13959168, "HRASLS5": 13959168, "LGALS12": 13959168, "RPLP0P2": 13959168, "PPP1R32": 13959168, "RARRES3": 13959168, "CHRM1": 13959168, "CABP4": 13959168, "FGF4": 13959168, "TMEM132A": 13959168, "MIR1237": 13959168, "SWI5": 11141375, "TRUB2": 11141375, "SPTAN1": 11141375, "SLC27A4": 11141375, "COQ4": 11141375, "ZDHHC12": 11141375, "TBC1D13": 11141375, "ENDOG": 11141375, "DOLPP1": 11141375, "C9ORF114": 11141375, "ZNF79": 11141375, "STXBP1": 11141375, "SNORA65": 11141375, "SLC25A25": 11141375, "SH2D3C": 11141375, "RPL12": 11141375, "NAIF1": 11141375, "LRSAM1": 11141375, "FAM102A": 11141375, "PIP5KL1": 11141375, "MIR4672": 11141375, "MIR3911": 11141375, "FAM129B": 11141375, "DPM2": 11141375, "AK1": 11141375, "SLC2A8": 11141375, "TTC16": 11141375, "PTRH1": 11141375, "FPGS": 11141375, "RALGPS1": 11141375, "ANGPTL2": 11141375, "GPR107": 11141375, "NCS1": 11141375, "URM1": 11141375, "SET": 11141375, "MIR2964A": 11141375, "MIR219-2": 11141375, "LOC100506100": 11141375, "UCK1": 11141375, "RAPGEF1": 11141375, "TOR1B": 11141375, "FNBP1": 11141375, "CRAT": 11141375, "NTMT1": 11141375, "C9ORF50": 11141375, "TOR1A": 11141375, "LAMC3": 11141375, "AIF1L": 11141375, "EXOSC2": 11141375, "QRFP": 11141375, "FIBCD1": 11141375, "ABL1": 11141375, "ASS1": 11141375, "LOC100272217": 11141375, "FUBP3": 11141375, "NUP188": 11141375, "DOLK": 11141375, "GOLGA2": 11141375, "PPAPDC3": 11141375, "SETX": 11141375, "ZBTB43": 11141375, "C9ORF171": 11141375, "BARHL1": 11141375, "ST6GALNAC4": 11141375, "MIR3960": 11141375, "MIR2861": 11141375, "CDK9": 11141375, "ENG": 11141375, "C9ORF117": 11141375, "NUP214": 11141375, "ZER1": 11141375, "FAM78A": 11141375, "PRRX2": 11141375, "MIR3154": 11141375, "MIR199B": 11141375, "LCN2": 11141375, "DNM1": 11141375, "CIZ1": 11141375, "TTF1": 11141375, "TSC1": 11141375, "ZBTB34": 11141375, "LMX1B": 11141375, "ODF2": 11141375, "GLE1": 11141375, "PPP2R4": 11141375, "IER5L": 11141375, "USP20": 11141375, "LINC00963": 11141375, "C9ORF78": 11141375, "C9ORF106": 11141375, "PRRC2B": 11141375, "NTNG2": 11141375, "POMT1": 11141375, "MED27": 11141375, "PHYHD1": 11141375, "FAM73B": 11141375, "SNORD62B": 11141375, "SH3GLB2": 11141375, "SNORD62A": 11141375, "PKN3": 11141375, "COX6B2": 3166206, "TMEM238": 3166206, "TMEM190": 3166206, "RPL28": 3166206, "SUV420H2": 3166206, "TSEN34": 3166206, "ZNF628": 3166206, "ZNF524": 3166206, "FIZ1": 3166206, "PTPRH": 3166206, "PPP6R1": 3166206, "IL11": 3166206, "MBOAT7": 3166206, "TNNT1": 3166206, "ZNF581": 3166206, "ZNF580": 3166206, "CCDC106": 3166206, "PPP1R12C": 3166206, "ZNF784": 3166206, "TMEM86B": 3166206, "FAM71E2": 3166206, "BRSK1": 3166206, "ZNF579": 3166206, "TNNI3": 3166206, "HSPBP1": 3166206, "GPR153": 37354, "PLEKHG5": 37354, "MIR4252": 37354, "HES2": 37354, "ESPN": 37354, "ACOT7": 37354, "CHD5": 37354, "TAS1R1": 37354, "THAP3": 37354, "KLHL21": 37354, "LINC00337": 37354, "NOL9": 37354, "KCNAB2": 37354, "RPL22": 37354, "ICMT": 37354, "HES3": 37354, "ZBTB48": 37354, "PHF13": 37354, "NPHP4": 37354, "VAMP3": 37354, "UTS2": 37354, "PER3": 37354, "DNAJC11": 37354, "CAMTA1": 37354, "POLE": 49061, "PGAM5": 49061, "ANKLE2": 49061, "ZNF84": 49061, "ZNF268": 49061, "ZNF26": 49061, "GOLGA3": 49061, "NOC4L": 49061, "P2RX2": 49061, "LRCOL1": 49061, "LOC100130238": 49061, "GALNT9": 49061, "FBRSL1": 49061, "PXMP2": 49061, "EP400NL": 49061, "DDX51": 49061, "CHFR": 49061, "ZNF891": 49061, "ZNF10": 49061, "ANHX": 49061, "ZNF140": 49061, "ZNF605": 49061, "SNORA49": 49061, "RAN": 49061, "ATF2": 6610199, "HOXD13": 6610199, "EVX2": 6610199, "HOXD12": 6610199, "LOC375295": 6610199, "HOXD11": 6610199, "MIR1246": 6610199, "HOXD10": 6610199, "HOXD-AS2": 6610199, "MTX2": 6610199, "CHN1": 6610199, "HOXD-AS1": 6610199, "NFE2L2": 6610199, "MIR3128": 6610199, "HOXD9": 6610199, "HOXD8": 6610199, "HOXD4": 6610199, "HOXD3": 6610199, "HOXD1": 6610199, "MIR10B": 6610199, "MIR4444-1": 6610199, "MIR933": 6610199, "CHRNA1": 6610199, "HNRNPA3": 6610199, "SORBS2": 16766464, "FLJ38576": 16766464, "FAM149A": 16766464, "CYP4V2": 16766464, "ACSL1": 16766464, "CCDC110": 16766464, "MLF1IP": 16766464, "SLC25A4": 16766464, "C4ORF47": 16766464, "LOC728175": 16766464, "LRP2BP": 16766464, "ANKRD37": 16766464, "UFSP2": 16766464, "TRAPPC11": 16766464, "ENPP6": 16766464, "RWDD4": 16766464, "TLR3": 16766464, "KIAA1430": 16766464, "CDKN2AIP": 16766464, "LOC389247": 16766464, "ING2": 16766464, "SNX25": 16766464, "PDLIM3": 16766464, "LOC399829": 16739584, "SYCE1": 16739584, "STK32C": 16739584, "LRRC27": 16739584, "C10ORF91": 16739584, "INPP5A": 16739584, "LOC619207": 16739584, "CYP2E1": 16739584, "KNDC1": 16739584, "MTG1": 16739584, "SPRNP1": 16739584, "MIR202": 16739584, "FUOM": 16739584, "FRG2B": 16739584, "GPR123": 16739584, "UTF1": 16739584, "PWWP2B": 16739584, "VENTX": 16739584, "TTC40": 16739584, "JAKMIP3": 16739584, "SPRN": 16739584, "BNIP3": 16739584, "DPYSL4": 16739584, "SUN5": 16747136, "BPIFB1": 16747136, "DNMT3B": 16747136, "BPIFB3": 16747136, "C20ORF112": 16747136, "CDK5RAP1": 16747136, "BPIFB6": 16747136, "ASXL1": 16747136, "C20ORF203": 16747136, "COMMD7": 16747136, "CBFA2T2": 16747136, "SNTA1": 16747136, "NECAB3": 16747136, "C20ORF144": 16747136, "ACTL10": 16747136, "BPIFA4P": 16747136, "BPIFB2": 16747136, "E2F1": 16747136, "EIF2S2": 16747136, "PXMP4": 16747136, "CHMP4B": 16747136, "RALY": 16747136, "MAPRE1": 16747136, "DHRS12": 15368444, "NEK5": 15368444, "NEK3": 15368444, "DLEU2": 15368444, "RNASEH2B-AS1": 15368444, "RNASEH2B": 15368444, "GUCY1B2": 15368444, "DLEU7-AS1": 15368444, "DLEU7": 15368444, "CTAGE10P": 15368444, "SPRYD7": 15368444, "MIR3613": 15368444, "DLEU1": 15368444, "TRIM13": 15368444, "MIR16-1": 15368444, "FAM124A": 15368444, "MIR5693": 15368444, "INTS6": 15368444, "MIR15A": 15368444, "KCNRG": 15368444, "WDFY2": 15368444, "MRPS31P5": 15368444, "LINC00282": 15368444, "PDCD6": 9215743, "EXOC3": 9215743, "C5ORF55": 9215743, "AHRR": 9215743, "CCDC127": 9215743, "SDHA": 9215743, "SLC6A18": 9215743, "SDHAP3": 9215743, "NDUFS6": 9215743, "MRPL36": 9215743, "LRRC14B": 9215743, "LOC100506688": 9215743, "PLEKHG4B": 9215743, "ZDHHC11": 9215743, "TRIP13": 9215743, "MIR4456": 9215743, "LOC100996325": 9215743, "CEP72": 9215743, "BRD9": 9215743, "SLC6A19": 9215743, "LPCAT1": 9215743, "MIR4635": 9215743, "ANGPTL4": 8444159, "PRAM1": 8444159, "HNRNPM": 8444159, "SNAPC2": 8444159, "KANK3": 8444159, "FBN3": 8444159, "CD320": 8444159, "MARCH2": 8444159, "TGFBR3L": 8444159, "CTXN1": 8444159, "ZNF414": 8444159, "MIR4999": 8444159, "LOC388499": 8444159, "RPS28": 8444159, "NDUFA7": 8444159, "CCL25": 8444159, "TIMM44": 8444159, "CERS4": 8444159, "RAB11B": 8444159, "ELAVL1": 8444159, "FLJ22184": 8444159, "RAB11B-AS1": 8444159, "LOC100506527": 11010027, "SH2B2": 11010027, "ORAI2": 11010027, "MIR4285": 11010027, "CUX1": 11010027, "ZNF3": 11010027, "ZCWPW1": 11010027, "TAF6": 11010027, "STAG3": 11010027, "RABL5": 11010027, "PPP1R35": 11010027, "PMS2P1": 11010027, "PILRB": 11010027, "MIR93": 11010027, "MIR25": 11010027, "MIR106B": 11010027, "MEPCE": 11010027, "MCM7": 11010027, "MBLAC1": 11010027, "LRCH4": 11010027, "LOC101752334": 11010027, "LOC101735302-LOC101752334-PILRB": 11010027, "LOC101735302": 11010027, "LAMTOR4": 11010027, "GPC2": 11010027, "GATS": 11010027, "FBXO24": 11010027, "CNPY4": 11010027, "AP4M1": 11010027, "AGFG2": 11010027, "ZKSCAN1": 11010027, "ZSCAN21": 11010027, "PILRA": 11010027, "COPS6": 11010027, "NAT16": 11010027, "FIS1": 11010027, "TRIM4": 11010027, "AZGP1P1": 11010027, "AZGP1": 11010027, "BRI3": 11010027, "TMEM130": 11010027, "GJC3": 11010027, "MYL10": 11010027, "PRKRIP1": 11010027, "ZNF655": 11010027, "ZSCAN25": 11010027, "CYP3A4": 11010027, "TRIP6": 11010027, "SRRT": 11010027, "SAP25": 11010027, "POP7": 11010027, "EPO": 11010027, "MOSPD3": 11010027, "ZNF394": 11010027, "OR2AE1": 11010027, "FAM200A": 11010027, "EPHB4": 11010027, "SERPINE1": 11010027, "VGF": 11010027, "MOGAT3": 11010027, "MIR4653": 11010027, "AP1S1": 11010027, "UFSP1": 11010027, "ZNHIT1": 11010027, "PLOD3": 11010027, "PCOLCE-AS1": 11010027, "PCOLCE": 11010027, "GNB2": 11010027, "GIGYF1": 11010027, "C7ORF61": 11010027, "TRIM56": 11010027, "MUC17": 11010027, "SLC12A9": 11010027, "ARPC1B": 11010027, "TFR2": 11010027, "MIR5090": 11010027, "MIR4467": 11010027, "LRWD1": 11010027, "ALKBH4": 11010027, "ZNF789": 11010027, "ZKSCAN5": 11010027, "SMURF1": 11010027, "PDAP1": 11010027, "KPNA7": 11010027, "BUD31": 11010027, "ARPC1A": 11010027, "ATP5J2-PTCD1": 11010027, "ATP5J2": 11010027, "SPDYE3": 11010027, "COL26A1": 11010027, "CYP3A5": 11010027, "CYP3A7-CYP3AP1": 11010027, "CYP3A7": 11010027, "TECPR1": 11010027, "MGC72080": 11010027, "MYH16": 11010027, "TRRAP": 11010027, "MIR3609": 11010027, "BAIAP2L1": 11010027, "NRSN2": 13434768, "TRIB3": 13434768, "TBC1D20": 13434768, "DEFB132": 13434768, "ZCCHC3": 13434768, "SOX12": 13434768, "RBCK1": 13434768, "CSNK2A1": 13434768, "DEFB129": 13434768, "DEFB128": 13434768, "SCRT2": 13434768, "SIRPB2": 13434768, "DEFB127": 13434768, "DEFB125": 13434768, "SNPH": 13434768, "TMEM74B": 13434768, "PSMF1": 13434768, "SIRPD": 13434768, "FAM110A": 13434768, "SIRPB1": 13434768, "SLC52A3": 13434768, "C20ORF96": 13434768, "PDIA6": 16777101, "PQLC3": 16777101, "MIR4429": 16777101, "GREB1": 16777101, "FLJ33534": 16777101, "C2ORF50": 16777101, "NOL10": 16777101, "LINC00570": 16777101, "HPCAL1": 16777101, "SNORA80B": 16777101, "ODC1": 16777101, "CYS1": 16777101, "C2ORF48": 16777101, "MIR4261": 16777101, "TAF1B": 16777101, "KLF11": 16777101, "GRHL1": 16777101, "RRM2": 16777101, "IAH1": 16777101, "KCNF1": 16777101, "YWHAQ": 16777101, "ADAM17": 16777101
                        }
                        resolve({ map: colorMap, legend: legend });
                    } else if (field.ctype & CollectionTypeEnum.GENE_FAMILY) {

                        const query = {
                            'Approved Symbol': {
                                '$in': markers.map(marker => marker.toUpperCase())
                            }
                        };
                        fetch('https://dev.oncoscape.sttrcancer.io/api/z_gene_families/' + JSON.stringify(query), {
                            method: 'GET'
                        }).then(res => {
                            res.json().then(data => {

                                const familyMap = _.groupBy(data, 'Gene Family Name');

                                const families = Object.keys(familyMap).map(family => (
                                    {
                                        family: family.replace(/\"/g, '').trim(),
                                        genes: familyMap[family].map(gene => gene['Approved Symbol'])
                                    })).sort((a, b) => {
                                        if (a.family === 'null') { return 1; }
                                        if (b.family === 'null') { return -1; }
                                        return (a.genes.length > b.genes.length) ? -1 : 1;
                                    });

                                const cm = families.reduce((p, c, i) => {
                                    p[c.family] = (i < this.colors.length) ? this.colors[i] : 0x039BE5;
                                    return p;
                                }, {});

                                cm['null'] = 0xffffff;

                                const legend: Legend = new Legend();
                                legend.name = 'Gene Family';
                                legend.type = 'COLOR';
                                legend.display = 'DISCRETE';
                                legend.labels = families.map(family => family.family);
                                // just to many types for color options.. defautl to blue (see above too)
                                legend.values = families.map(family => cm[family.family]).map(col => col ? col : 0x039BE5);

                                // Legit, not sure why it complains.
                                const colorMap = Object.assign({}, ...families.map(family => {
                                    const col = cm[family.family];
                                    const obj = family.genes.reduce((p, c) => { p[c] = col; return p; }, {});
                                    return obj;
                                }));
                                resolve({ map: colorMap, legend: legend });
                            });
                        });

                    } else {

                        throw (new Error('Unable to determine coloring logic'));
                    }
                }

                if (entity === EntityTypeEnum.SAMPLE) {
                    if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                        // Extract Name of The Map Table For Molecular Table
                        this.dbData.table('dataset').where('name').equals('gbm').first().then(dataset => {
                            // Extract Name Of Map
                            const map = dataset.tables.filter(tbl => tbl.tbl === field.tbl)[0].map;
                            this.dbData.table(map).toArray().then(sampleMap => {
                                this.getMolecularGeneValues(markers, field, db).then(result => {
                                    const sampleCount = sampleMap.length;
                                    const sampleAvgs = sampleMap.map((sample, index) => ({
                                        id: sample.s,
                                        value: (result.reduce((p, c) => { p += c.d[index]; return p; }, 0) / sampleCount)
                                    }));
                                    const sampleDomain = sampleAvgs.reduce((p, c) => {
                                        p.min = Math.min(p.min, c.value);
                                        p.max = Math.max(p.max, c.value);
                                        return p;
                                    }, { min: Infinity, max: -Infinity });

                                    const scale = scaleLinear<number, number>()
                                        .domain([sampleDomain.min, sampleDomain.max])
                                        .range([1, 0]);

                                    const colorMap = sampleAvgs.reduce(function (p, c) {
                                        p[c.id] = interpolateSpectral(scale(c.value));
                                        return p;
                                    }, {});

                                    // Build Legend
                                    const legend: Legend = new Legend();
                                    legend.name = field.label;
                                    legend.type = 'COLOR';
                                    legend.display = 'CONTINUOUS';
                                    legend.labels = [sampleDomain.min, sampleDomain.max].map(val => Math.round(val).toString());
                                    legend.values = [0xFF0000, 0xFF0000];

                                    // Resolve
                                    resolve({ map: colorMap, legend: legend });

                                });
                            });
                        });

                    } else {
                        const fieldKey = field.key;
                        // Color Samples With Discrete Value
                        if (field.type === 'STRING') {

                            const cm = field.values.reduce((p, c, i) => {
                                p[c] = this.colors[i];
                                return p;
                            }, {});

                            this.dbData.table(field.tbl).toArray().then(row => {
                                const colorMap = row.reduce((p, c) => {
                                    p[c.p] = cm[c[fieldKey]];
                                    return p;
                                }, {});

                                const legend: Legend = new Legend();
                                legend.name = field.label;
                                legend.type = 'COLOR';
                                legend.display = 'DISCRETE';
                                legend.labels = Object.keys(cm);
                                legend.values = Object.keys(cm).map(key => cm[key]);

                                resolve({ map: colorMap, legend: legend });
                            });

                            // Color Samples With Continuous Value
                        } else if (field.type === 'NUMBER') {

                            const scale = scaleLinear<number, number>()
                                .domain([field.values.min, field.values.max])
                                .range([0, 1]);

                            this.dbData.table(field.tbl).toArray().then(row => {
                                const colorMap = row.reduce(function (p, c) {
                                    p[c.p] = interpolateSpectral(scale(c[fieldKey]));
                                    return p;
                                }, {});

                                // Build Legend
                                const legend: Legend = new Legend();
                                legend.name = field.label;
                                legend.type = 'COLOR';
                                legend.display = 'CONTINUOUS';
                                legend.labels = [field.values.min, field.values.max].map(val => val.toString());
                                legend.values = [0xFF0000, 0xFF0000];

                                // Resolve
                                resolve({ map: colorMap, legend: legend });
                            });
                        }

                    }
                }
            });
        });
    }

    getSizeMap(entity: EntityTypeEnum, markers: Array<string>, samples: Array<string>, db: string, field: DataField): Promise<any> {

        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {

                // Gene Color Maps
                if (entity === EntityTypeEnum.GENE) {
                    if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                        this.getMolecularGeneValues(markers, field, db).then(result => {

                            console.log('Would be good to subset color by Filtered Samples / Patients...  Revisit');

                            const geneDomain = result.reduce((p, c) => {
                                p.min = Math.min(p.min, c.mean);
                                p.max = Math.max(p.max, c.mean);
                                return p;
                            }, { min: Infinity, max: -Infinity });

                            const scale = scaleLinear<number, number>()
                                .domain([geneDomain.min, geneDomain.max])
                                .range([1, 3]);

                            const colorMap = result.reduce((p, c) => {
                                p[c.m] = Math.round(scale(c.mean));
                                return p;
                            }, {});

                            // Build Legend
                            const legend: Legend = new Legend();
                            legend.name = field.label;
                            legend.type = 'SIZE';
                            legend.display = 'CONTINUOUS';
                            legend.labels = [geneDomain.min, geneDomain.max].map(val => Math.round(val).toString());
                            legend.values = [0xFF0000, 0xFF0000];
                            resolve({ map: colorMap, legend: legend });
                        });
                    } else {
                        throw (new Error('Unable to determine size logic'));
                    }
                }

                if (entity === EntityTypeEnum.SAMPLE) {
                    if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                        // Extract Name of The Map Table For Molecular Table
                        this.dbData.table('dataset').where('name').equals('gbm').first().then(dataset => {
                            // Extract Name Of Map
                            const map = dataset.tables.filter(tbl => tbl.tbl === field.tbl)[0].map;
                            this.dbData.table(map).toArray().then(sampleMap => {
                                this.getMolecularGeneValues(markers, field, db).then(result => {
                                    const sampleCount = sampleMap.length;
                                    const sampleAvgs = sampleMap.map((sample, index) => ({
                                        id: sample.s,
                                        value: (result.reduce((p, c) => { p += c.d[index]; return p; }, 0) / sampleCount)
                                    }));
                                    const sampleDomain = sampleAvgs.reduce((p, c) => {
                                        p.min = Math.min(p.min, c.value);
                                        p.max = Math.max(p.max, c.value);
                                        return p;
                                    }, { min: Infinity, max: -Infinity });

                                    const scale = scaleLinear<number, number>()
                                        .domain([sampleDomain.min, sampleDomain.max])
                                        .range([1, 3]);

                                    const colorMap = sampleAvgs.reduce(function (p, c) {
                                        p[c.id] = Math.round(scale(c.value));
                                        return p;
                                    }, {});

                                    // Build Legend
                                    const legend: Legend = new Legend();
                                    legend.name = field.label;
                                    legend.type = 'SIZE';
                                    legend.display = 'CONTINUOUS';
                                    legend.labels = [sampleDomain.min, sampleDomain.max].map(val => Math.round(val).toString());
                                    legend.values = [0xFF0000, 0xFF0000];

                                    // Resolve
                                    resolve({ map: colorMap, legend: legend });

                                });
                            });
                        });

                    } else {
                        const fieldKey = field.key;
                        // Color Samples With Discrete Value
                        if (field.type === 'STRING') {

                            const cm = field.values.reduce((p, c, i) => {
                                p[c] = this.sizes[i];
                                return p;
                            }, {});

                            this.dbData.table(field.tbl).toArray().then(row => {
                                const colorMap = row.reduce((p, c) => {
                                    p[c.p] = cm[c[fieldKey]];
                                    return p;
                                }, {});

                                const legend: Legend = new Legend();
                                legend.name = field.label;
                                legend.type = 'SIZE';
                                legend.display = 'DISCRETE';
                                legend.labels = Object.keys(cm);
                                legend.values = Object.keys(cm).map(key => cm[key]);

                                resolve({ map: colorMap, legend: legend });
                            });

                            // Color Samples With Continuous Value
                        } else if (field.type === 'NUMBER') {

                            const scale = scaleLinear()
                                .domain([field.values.min, field.values.max])
                                .range([1, 3]);

                            this.dbData.table(field.tbl).toArray().then(row => {
                                const sizeMap = row.reduce(function (p, c) {
                                    p[c.p] = Math.round(scale(c[fieldKey]));
                                    return p;
                                }, {});

                                // Build Legend
                                const legend: Legend = new Legend();
                                legend.name = field.label;
                                legend.type = 'SIZE';
                                legend.display = 'CONTINUOUS';
                                legend.labels = [field.values.min, field.values.max].map(val => val.toString());
                                legend.values = [0xFF0000, 0xFF0000];

                                // Resolve
                                resolve({ map: sizeMap, legend: legend });
                            });
                        }

                    }
                }
            });
        });
    }

    getIntersectMap(markers: Array<string>, samples: Array<string>, db: string, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                const fieldKey = field.key;
                if (field.type === 'STRING') {

                    this.dbData.table(field.tbl).toArray().then(row => {

                        const intersectMap = row.reduce((p, c) => { p[c.p] = c[fieldKey]; return p; }, {});

                        const legend: Legend = new Legend();
                        legend.name = field.label;
                        legend.type = 'INTERSECT';
                        legend.display = 'DISCRETE';
                        legend.labels = legend.values = Object
                            .keys(Object.keys(intersectMap)
                                .reduce((p, c) => {
                                    p[intersectMap[c]] = 1; return p;
                                }, {}));

                        resolve({ map: intersectMap, legend: legend });
                    }
                    );
                }
            });
        });
    }

    getShapeMap(entity: EntityTypeEnum, markers: Array<string>, samples: Array<string>, db: string, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                const fieldKey = field.key;
                if (field.type === 'STRING') {
                    const cm = field.values.reduce((p, c, i) => {
                        p[c] = this.shapes[i];
                        return p;
                    }, {});
                    this.dbData.table(field.tbl).toArray().then(row => {
                        const shapeMap = row.reduce((p, c) => {
                            p[c.p] = cm[c[fieldKey]];
                            return p;
                        }, {});

                        const legend: Legend = new Legend();
                        legend.name = field.label;
                        legend.type = 'SHAPE';
                        legend.display = 'DISCRETE';
                        legend.labels = Object.keys(cm);
                        legend.values = Object.keys(cm).map(key => cm[key]);
                        resolve({ map: shapeMap, legend: legend });
                    }
                    );
                }
            });
        });
    }

    getPatientAttributeSummary(patients: Array<string>, attributes: Array<string>, db: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData(db).then(v => {
                const query = (patients.length === 0) ?
                    this.dbData.table('patient').toArray() :
                    this.dbData.table('patient').where('p').anyOfIgnoreCase(patients).toArray();

                query.then(result => {
                    const rv = {
                        pids: result.map(w => w['p']),
                        attrs: attributes.map(a => {
                            const prop = a.replace(/ /gi, '_');
                            const values = result.map(w => w[prop]);
                            if (isNaN(values[0])) {
                                return {
                                    prop: prop,
                                    values: values,
                                    set: _.uniq(values)
                                };
                            }
                            return {
                                prop: prop,
                                values: values,
                                min: _.min(values),
                                max: _.max(values)
                            };
                        })
                    };
                    resolve(rv);
                });
            });
        });
    }

    // Call Lambda
    // cbor.encode(config)
    fetchResult(config: any, cache: boolean = false): Promise<any> {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };

        return fetch('http://oncoscape-opencpu.sttrcancer.io/py', {
        // return fetch('http://localhost:5000/py', {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(config)
        })
            .then(res => {
                return res.json();
            });
    }

    loadData = (dataKey): any => {
        return new Promise((resolve, reject) => {
            // // Only connect once
            // if (this.pouchDB === null) {
            //     this.pouchDB = new PouchDB['default']('Notitia', { adapter: 'idb' });
            // }
            // // If data key already in memory, return it...
            // if (this.dataKey === dataKey) {
            //     resolve(this.data);
            //     return;
            // }
            // this.pouchDB.get(dataKey).then(v => {
            //     this.dataKey = dataKey;
            //     this.data = v;
            //     resolve(v);
            // });
        });
    }
    processMolecularData(molecularData: any, config: GraphConfig): any {
        let matrix = molecularData.data;
        if (config.markerFilter.length > 0) {
            const genesOfInterest = molecularData.markers
                .map((v, i) => (config.markerFilter.indexOf(v) >= 0) ? { gene: v, i: i } : -1)
                .filter(v => v !== -1);
            matrix = genesOfInterest.map(v => molecularData.data[v.i]);
        }

        if (config.entity === EntityTypeEnum.SAMPLE) {
            // Transpose Array
            matrix = _.zip.apply(_, matrix);
        }
        return matrix;
    }
    createScale = (range, domain) => {
        const domainMin = domain[0];
        const domainMax = domain[1];
        const rangeMin = range[0];
        const rangeMax = range[1];
        return function scale(value) {
            return rangeMin + (rangeMax - rangeMin) * ((value - domainMin) / (domainMax - domainMin));
        };
    }

    scale3d = (data) => {
        const scale = this.createScale(
            [-300, 300],
            data.reduce((p, c) => {
                p[0] = Math.min(p[0], c[0]);
                p[0] = Math.min(p[0], c[1]);
                p[0] = Math.min(p[0], c[2]);
                p[1] = Math.max(p[1], c[0]);
                p[1] = Math.max(p[1], c[1]);
                p[1] = Math.max(p[1], c[2]);
                return p;
            }, [Infinity, -Infinity])
        );
        // Only Scale First 3 Elements Needed For Rendering
        return data.map(v => [scale(v[0]), scale(v[1]), scale(v[2])]);
    }

}



