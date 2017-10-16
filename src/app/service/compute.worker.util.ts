import { interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import { DedicatedWorkerGlobalScope } from 'compute';
import { scaleLinear, InterpolatorFactory } from 'd3-scale';
import { interpolateRgb, interpolateHcl } from 'd3-interpolate';
import { rgb } from 'd3-color';
import { GraphConfig } from './../model/graph-config.model';
import { Legend } from './../model/legend.model';
import { DataTypeEnum, ShapeEnum, EntityTypeEnum, CollectionTypeEnum, DirtyEnum } from './../model/enum.model';
import { DataField } from './../model/data-field.model';
import * as _ from 'lodash';
import * as PouchDB from 'pouchdb-browser';
import Dexie from 'dexie';
import * as cbor from 'cbor-js';

export class ComputeWorkerUtil {

    private dbData: Dexie;
    private dbLookup: Dexie;

    private sizes = [1, 2, 3, 4];
    private shapes = [ShapeEnum.CIRCLE, ShapeEnum.SQUARE, ShapeEnum.TRIANGLE, ShapeEnum.CONE];
    private colors = [0x039BE5, 0x4A148C, 0x880E4F, 0x0D47A1, 0x00B8D4,
        0xAA00FF, 0x6200EA, 0x304FFE, 0x2196F3, 0x0091EA,
        0x00B8D4, 0x00BFA5, 0x64DD17, 0xAEEA00, 0xFFD600, 0xFFAB00, 0xFF6D00, 0xDD2C00,
        0x5D4037, 0x455A64];

    constructor() {
        console.log("OPTIMIZE - LATE OPEN");
        this.dbData = new Dexie('notitia-dataset');
        this.dbLookup = new Dexie('notitia');
    }

    processShapeColorSizeIntersect(config: GraphConfig, worker: DedicatedWorkerGlobalScope) {

        if ((config.dirtyFlag & DirtyEnum.COLOR) > 0) {
            worker.util.getColorMap([], [], config.pointColor).then(
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
            worker.util.getSizeMap([], [], config.pointSize).then(
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
            worker.util.getShapeMap([], [], config.pointShape).then(
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
            worker.util.getIntersectMap([], [], config.pointIntersect).then(
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

    getChromosomeInfo(genes: Array<string>): Promise<any> {
        return new Promise( (resolve, reject) => {
            this.openDatabaseLookup().then(v => {
                Promise.all([
                this.dbLookup.table('bandcoords').toArray(),
                this.dbLookup.table('genecoords').where('gene').anyOf(genes).toArray()
                ]).then( result => {
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
    getMatrix(markers: Array<string>, samples: Array<string>, map: string, tbl: string, entity: EntityTypeEnum): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {
                this.dbData.table(map).toArray().then(_samples => {
                    this.dbData.table(tbl).limit(100).toArray().then(_markers => {
                        resolve({
                            markers: _markers.map(m => m.m),
                            samples: _samples.map(s => s.s),
                            data: (entity === EntityTypeEnum.GENE) ?
                                _markers.map(marker => _samples.map(sample => marker.d[sample.i])) :
                                _samples.map(sample => _markers.map( marker => marker.d[sample.i]))
                        });
                    });
                });
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

    getColorMap(markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {

                if (field.ctype & CollectionTypeEnum.MOLECULAR) {
                    this.dbData.table('dataset').where('name').equals('gbm').first().then(dataset => {
                        // Extract Name Of Map
                        const map = dataset.tables.filter(tbl => tbl.tbl === field.tbl)[0].map;
                        // Get Samples
                        this.dbData.table(map).toArray().then(_samples => {
                            // Get Molecular Data
                            this.dbData.table(field.tbl).toArray().then(_markers => {
                                // Calc Average By Sample
                                const numMarkers = _markers.length;
                                const values = _samples
                                    .map(sample => _markers.reduce((p, c) => { p += c.d[sample.i]; return p; }, 0))
                                    .map(total => (total / numMarkers));
                                // Color Scale
                                const minMax = values.reduce((p, c) => {
                                    p.min = Math.min(p.min, c);
                                    p.max = Math.max(p.max, c);
                                    return p;
                                }, { min: Infinity, max: -Infinity });


                                const scale = scaleLinear<number, number>()
                                    .domain([minMax.min, minMax.max])
                                    .range([0, 1]);

                                // Build Map
                                const colorMap = values.reduce((p, c, i) => {
                                    p[_samples[i].s] = interpolateSpectral(scale(c));
                                    return p;
                                }, {});

                                // Build Legend
                                const legend: Legend = new Legend();
                                legend.name = field.label ;
                                legend.type = 'COLOR';
                                legend.display = 'CONTINUOUS';
                                legend.labels = [minMax.min, minMax.max].map(val => val.toString());
                                legend.values = [0xFF0000, 0xFF0000];

                                // Resolve
                                resolve({map: colorMap, legend: legend});
                            });
                        });
                    });

                } else {

                    const fieldKey = field.key;
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
                            legend.name = field.label ;
                            legend.type = 'COLOR';
                            legend.display = 'DISCRETE';
                            legend.labels = Object.keys(cm);
                            legend.values = Object.keys(cm).map( key => cm[key] );

                            resolve({map: colorMap, legend: legend});
                        });

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
                             legend.name = field.label ;
                             legend.type = 'COLOR';
                             legend.display = 'CONTINUOUS';
                             legend.labels = [field.values.min, field.values.max].map(val => val.toString());
                             legend.values = [0xFF0000, 0xFF0000];

                             // Resolve
                             resolve({map: colorMap, legend: legend});
                        });
                    }
                }
            });
        });
    }

    getSizeMap(markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {
        return new Promise((resolve, reject) => {
            this.openDatabaseData().then(v => {

                const fieldKey = field.key;

                if (field.type === 'STRING') {
                    const cm = field.values.reduce((p, c, i) => {
                        p[c] = this.sizes[i];
                        return p;
                    }, {});
                    this.dbData.table(field.tbl).toArray().then(row => {

                        const sizeMap = row.reduce((p, c) => {
                            p[c.p] = cm[c[fieldKey]];
                            return p;
                        }, {});

                        const legend: Legend = new Legend();
                        legend.name = field.label ;
                        legend.type = 'SIZE';
                        legend.display = 'DISCRETE';
                        legend.labels = Object.keys(cm);
                        legend.values = Object.keys(cm).map( key => cm[key] );

                        resolve({map: sizeMap, legend: legend});
                    }
                    );
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
                        legend.name = field.label ;
                        legend.type = 'SIZE';
                        legend.display = 'CONTINUOUS';
                        legend.labels = [field.values.min, field.values.max].map(val => val.toString());
                        legend.values = [1, 3];

                        resolve({map: sizeMap, legend: legend});
                    });
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

                        const intersectMap = row.reduce( (p, c) => { p[c.p] = c[fieldKey]; return p; }, {});

                        const legend: Legend = new Legend();
                        legend.name = field.label ;
                        legend.type = 'INTERSECT';
                        legend.display = 'DISCRETE';
                        legend.labels = legend.values = Object
                            .keys(Object.keys(intersectMap)
                            .reduce( (p, c) => {
                                p[ intersectMap[ c ] ] = 1; return p;
                            }, {}));

                        resolve({map: intersectMap, legend: legend});
                    }
                    );
                }
            });
        });
    }

    getShapeMap(markers: Array<string>, samples: Array<string>, field: DataField): Promise<any> {
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
                        legend.name = field.label ;
                        legend.type = 'SHAPE';
                        legend.display = 'DISCRETE';
                        legend.labels = Object.keys(cm);
                        legend.values = Object.keys(cm).map( key => cm[key] );

                        resolve({map: shapeMap, legend: legend});
                    }
                    );
                }
            });
        });
    }


    // Call Lambda
    // cbor.encode(config)
    fetchResult(config: any): Promise<any> {
        return fetch('https://0x8okrpyl3.execute-api.us-west-2.amazonaws.com/dev', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                //'Cache-Control': 'max-age=31536000'
            },
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

    // createMap = (data: any, field: DataField, values: Array<any>,
    //     nullValue: any, type: any): { legend: Legend, value: Array<number> } => {
        // if (field.key === 'None') {
        //     return {
        //         legend: { name: '', type: type, legendItems: [] },
        //         value: Object.keys(data.patientData).map((v) => values[0])
        //     };
        // }
        // let legends: any;
        // let returnValues: Array<number>;
        // switch (field.type) {
        //     case DataTypeEnum.NUMBER:
        //         const bins = _.range(field['min'], field['max'], Math.min((field['max'] - field['min']) / values.length));
        //         legends = bins
        //             .map((v) => Math.floor(v))
        //             .map((v, i) => ([bins[i], (i <= bins.length - 2) ? bins[i + 1] : Math.ceil(field['max']), values[i]]));
        //         returnValues = data.patientData.map((v) => {
        //             const value = v[field.key];
        //             return legends.reduce((p, c) => {
        //                 return _.inRange(value, c[0], c[1]) ? c[2] : p;
        //             }, nullValue);
        //         });
        //         return {
        //             legend: {
        //                 name: field.label, type: type, legendItems:
        //                 Object.keys(legends).map(v => ({ name: v, value: legends[v] }))
        //             },
        //             value: returnValues
        //         };

        //     case DataTypeEnum.STRING:
        //         legends = field.values.reduce((p, c, i) => { p[c] = values[i]; return p; }, {});
        //         returnValues = data.patientData.map((v) => {
        //             const value = v[field.key];
        //             return legends[value];
        //         });
        //         return {
        //             legend: {
        //                 name: field.label, type: type, legendItems:
        //                 Object.keys(legends).map(v => ({ name: v, value: legends[v] }))
        //             },
        //             value: returnValues
        //         };
    //     }
    // }

    // createPatientColorMap = (data, field: DataField): { legend: Legend, value: Array<number> } => {
    //     const rv = this.createMap(data, field, this.colors, 0x000000, 'COLOR');
    //     return rv;
    // }

    // createPatientShapeMap = (data, field: DataField): { legend: Legend, value: Array<number> } => {
    //     const rv = this.createMap(data, field, this.shapes, ShapeEnum.CIRCLE, 'SHAPE');
    //     rv.legend.type = 'SHAPE';
    //     return rv;
    // }

    // createPatientSizeMap = (data, field: DataField): { legend: Legend, value: Array<number> } => {
    //     const rv = this.createMap(data, field, this.sizes, 2, 'SIZE');
    //     return rv;
    // }

    // createGeneSizeMap = (data, field: DataField): Array<number> => {
    //     return [];
    // }

    // createGeneColorMap = (data, field: DataField): Array<number> => {
    //     return [];
    // }

    // createSampleMap = (data): Array<string> => {
    //     return Object.keys(data.patientSampleMap.samples);
    // }

    // createPatientMap = (data): Array<string> => {
    //     return Object.keys(data.patientSampleMap.patients);
    // }

    // createMarkerMap = (data): Array<string> => {
    //     return data.markers;
    // }
}



