import { DirtyEnum, EntityTypeEnum } from './../../../model/enum.model';
import { interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import { scaleLinear } from 'd3-scale';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import { Legend } from './../../../model/legend.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EdgeConfigModel } from './edges.model';
import * as _ from 'lodash';

export const edgesCompute = (config: EdgeConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    if (config.field.type === 'UNDEFINED') {
        worker.postMessage({
            config: config,
            data: { result: [] }
        });
        worker.postMessage('TERMINATE');
        return;
    }

    const edges = {
        getEventsEvents(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getEventsGenes(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getEventsPatients(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getEventsSamples(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getGenesGenes(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                const b = new Set(cfg.markerFilterB);
                resolve([...cfg.markerFilterA].filter(x => b.has(x)).map(g => ({
                    a: g,
                    b: g,
                    c: 0xFF0000,
                    i: null
                })));
            });
        },
        getGenesPatients(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getGenesSamples(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(cfg.database).then(db => {
                    db.table('mut').where('t').anyOfIgnoreCase(cfg.field.key).toArray().then(result => {
                        const data = result.map(v => ({
                            a: (cfg.entityA === EntityTypeEnum.GENE) ? v.m : v.s,
                            b: (cfg.entityB === EntityTypeEnum.GENE) ? v.m : v.s,
                            c: 0xFF0000,
                            i: null
                        }));
                        resolve(data);
                        // worker.postMessage({
                        //     config: cfg,
                        //     data: {
                        //         result: data
                        //     }
                        // });
                        // worker.postMessage('TERMINATE');
                    });
                });
            });
        },

        getPatientsPatients(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getPatientsSamples(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then(db => {
                });
            });
        },
        getSamplesSamples(cfg: EdgeConfigModel): Promise<any> {
            return new Promise((resolve, reject) => {
                switch (cfg.field.type) {
                    case 'UNDEFINED':
                        resolve([]);
                        break;
                    default:
                        worker.util.openDatabaseData(config.database).then(db => {
                            db.table('patientSampleMap').toArray().then(result => {
                                resolve(result.map(v => ({
                                    a: v.s,
                                    b: v.s,
                                    c: 0x81d4fa,
                                    i: null
                                })));
                            });
                        });
                        break;
                }
            });
        }
    };

    edges['get' + [config.entityA, config.entityB].sort().join('')](config).then(result => {
        worker.postMessage({
            config: config,
            data: {
                result: result
            }
        });
        worker.postMessage('TERMINATE');
    });

    // if (config.entityA === EntityTypeEnum.SAMPLE && config.entityB === EntityTypeEnum.SAMPLE) {
    //     worker.util.getEdgesSampleSample(config).then( result => {
    //         worker.postMessage({
    //             config: config,
    //             data: {
    //                 result: result
    //             }
    //         });
    //         worker.postMessage('TERMINATE');
    //     });
    // }

    // if (config.entityA === EntityTypeEnum.GENE && config.entityB === EntityTypeEnum.GENE) {
    // worker.util.getEdgesGeneGene(config).then( result => {
    //         worker.postMessage({
    //             config: config,
    //             data: {
    //                 result: result
    //             }
    //         });
    //         worker.postMessage('TERMINATE');
    //     });
    // }

    // if ( (config.entityA === EntityTypeEnum.SAMPLE && config.entityB === EntityTypeEnum.GENE) ||
    //      (config.entityA === EntityTypeEnum.GENE && config.entityB === EntityTypeEnum.SAMPLE) ) {
    //     worker.util.getEdgesGeneSample(config).then( result => {
    //         worker.postMessage({
    //             config: config,
    //             data: {
    //                 result: result
    //             }
    //         });
    //         worker.postMessage('TERMINATE');
    //     });
    // }
};
