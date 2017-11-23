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

export class ComputeWorkerUtil {

    private dbData: Dexie;
    private dbLookup: Dexie;

    private sizes = [1, 2, 3, 4];
    private shapes = [ShapeEnum.CIRCLE, ShapeEnum.SQUARE, ShapeEnum.TRIANGLE, ShapeEnum.CONE];
    public colors = [0xd50000, 0xaa00ff, 0x304ffe, 0x0091ea, 0x00bfa5, 0x64dd17, 0xffd600, 0xff6d00,
    0xff8a80, 0xea80fc, 0x8c9eff, 0x80d8ff, 0xa7ffeb, 0xccff90, 0xffff8d, 0xffd180];
    // [0xb71c1c, 0x880e4f, 0x4a148c, 0x311b92, 0x1a237e, 0x0d47a1, 0x01579b, 0x006064,
    //     0x004d40, 0x1b5e20, 0x33691e, 0x827717, 0xf57f17, 0xff6f00, 0xe65100, 0xbf360c, 0x3e2723,
    //     0xf44336, 0xe91e63, 0x9c27b0, 0x673ab7, 0x3f51b5, 0x2196f3, 0x03a9f4, 0x00bcd4, 0x009688,
    //     0x4caf50, 0x8bc34a, 0xcddc39, 0xffeb3b, 0xffc107, 0xff9800, 0xff5722, 0x795548];
    // private colors = [0x039BE5, 0x4A148C, 0x880E4F, 0x0D47A1, 0x00B8D4,
    //     0xAA00FF, 0x6200EA, 0x304FFE, 0x2196F3, 0x0091EA,
    //     0x00B8D4, 0x00BFA5, 0x64DD17, 0xAEEA00, 0xFFD600, 0xFFAB00, 0xFF6D00, 0xDD2C00,
    //     0x5D4037, 0x455A64];

    constructor() {
        console.log("OPTIMIZE - LATE OPEN");
        this.dbData = new Dexie('notitia-dataset');
        this.dbLookup = new Dexie('notitia');
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
            worker.util.getColorMap(config.entity, config.markerFilter, config.sampleFilter, config.pointColor).then(
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
            worker.util.getSizeMap(config.entity, config.markerFilter, config.sampleFilter, config.pointSize).then(
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
            worker.util.getShapeMap(config.entity, config.markerFilter, config.sampleFilter, config.pointShape).then(
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
            worker.util.getIntersectMap(config.markerFilter, config.sampleFilter, config.pointIntersect).then(
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
                this.dbLookup.table('genecoords').where('gene').anyOfIgnoreCase(genes).and(
                    gene => gene.chr === chromosome).toArray()
                    .then(result => {
                        resolve(result);
                    });
            });
        });
    }
    getGenomeInfo(genes: Array<string>): Promise<any> {
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
            if (this.dbLookup.isOpen()) {
                resolve();
            } else {
                this.dbLookup.open().then(resolve);
            }
        });
    }
    openDatabaseData(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.dbData.isOpen()) {
                resolve();
            } else {
                this.dbData.open().then(resolve);
            }
        });
    }

    // Call IDB
    getEventData(): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.openDatabaseData().then(v => {
                this.dbData.table('events').toArray().then(_events => {
                    resolve(_events);
                });
            });
        });
    }
    getPatientData(samples: Array<string>, tbl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {
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
    getMatrix(markers: Array<string>, samples: Array<string>, map: string, tbl: string, entity: EntityTypeEnum): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {
                this.dbData.table(map).toArray().then(_samples => {
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
            this.openDatabaseData().then(v => {
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
            this.openDatabaseData().then(v => {
                this.getMolecularGeneValues(config.markerFilter, config.pointColor).then(result => {
                    const edges = result.map( gene => ({
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
            this.getMatrix(config.markerFilter, config.sampleFilter, 'gismutMap', 'gisticT', EntityTypeEnum.GENE)
                .then((result: any) => {
                    debugger;
                    let edges: Array<any> = [];
                    const nMarkers = result.markers.length;
                    const nSamples = result.samples.length;
                    const aIsGene = (config.entityA === EntityTypeEnum.GENE);
                    for (let iMarker = 0; iMarker < nMarkers; iMarker++) {
                        for (let iSample = 0; iSample < nSamples; iSample++) {
                                const value = result.data[iMarker][iSample];
                                const color =   (value === -2) ? this.colors[0] :
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

    getSamplePatientMap(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {
                this.dbData.table('patientSampleMap').toArray().then(result => {
                    resolve(result);
                });
            });
        });
    }


    getMolecularGeneValues(markers: Array<string>, field: DataField): Dexie.Promise<any> {
        return (markers.length === 0) ?
            this.dbData.table(field.tbl).toArray() :
            this.dbData.table(field.tbl).where('m').anyOfIgnoreCase(markers).toArray();
    }


    getColorMap(entity: EntityTypeEnum, markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {

                // Gene Color Maps
                if (entity === EntityTypeEnum.GENE) {
                    if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                        this.getMolecularGeneValues(markers, field).then(result => {

                            console.log("Would be good to subset color by Filtered Samples / Patients...  Revisit");

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
                    } else if (field.ctype & CollectionTypeEnum.GENE_FAMILY) {

                        const query = {
                            'Approved Symbol': {
                                '$in': markers.map( marker => marker.toUpperCase() )
                            }
                        };
                        fetch('https://dev.oncoscape.sttrcancer.io/api/z_gene_families/' + JSON.stringify(query), {
                            method: 'GET'
                        }).then(res => {
                            res.json().then( data => {

                                const familyMap = _.groupBy(data, 'Gene Family Name');

                                const families = Object.keys(familyMap).map( family => (
                                    {family: family.replace(/\"/g, '').trim(),
                                    genes: familyMap[family].map( gene => gene['Approved Symbol'])
                                })).sort( (a, b) => {
                                    if (a.family === 'null') { return 1; }
                                    if (b.family === 'null') { return -1; }
                                    return (a.genes.length > b.genes.length) ? -1 : 1;
                                });

                                const cm = families.reduce( (p, c, i) => {
                                    p[c.family] = this.colors[i]; return p; }, {});

                                cm['null'] = 0xffffff;

                                const legend: Legend = new Legend();
                                legend.name = 'Gene Family';
                                legend.type = 'COLOR';
                                legend.display = 'DISCRETE';
                                legend.labels = families.map( family => family.family );
                                legend.values = families.map( family => cm[family.family]);

                                // Legit, not sure why it complains.
                                const colorMap = Object.assign({}, ...families.map( family => {
                                    const col = cm[family.family];
                                    const obj = family.genes.reduce( (p, c) => { p[c] = col; return p; }, {});
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
                                this.getMolecularGeneValues(markers, field).then(result => {
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
                                debugger;
                                resolve({ map: colorMap, legend: legend });
                            });
                        }

                    }
                }
            });
        });
    }

    getSizeMap(entity: EntityTypeEnum, markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {

        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {

                // Gene Color Maps
                if (entity === EntityTypeEnum.GENE) {
                    if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                        this.getMolecularGeneValues(markers, field).then(result => {

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
                                this.getMolecularGeneValues(markers, field).then(result => {
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
                                    p[c.p] = Math.round(scale(c[fieldKey])); //interpolateSpectral(scale(c[fieldKey]));
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

    getIntersectMap(markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {
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

    getShapeMap(entity: EntityTypeEnum, markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {
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


    // Call Lambda
    // cbor.encode(config)
    fetchResult(config: any, cache: boolean = false): Promise<any> {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const md5 = new Md5();
        md5.appendStr(JSON.stringify(config));
        const hash = md5.end();
        // return fetch('https://0x8okrpyl3.execute-api.us-west-2.amazonaws.com/dev?' + hash, {
        return fetch('https://oncoscape.sttrcancer.org/dev?' + hash, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify(config)
        })
            .then(res => {
                return res.json();
            });
    }

    // OLD //

    // pouchDB: any = null;
    // dataKey = '';
    // data: any = {};

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



