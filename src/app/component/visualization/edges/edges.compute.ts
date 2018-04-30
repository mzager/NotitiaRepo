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
                // worker.util.openDatabaseData(config.database).then( db => {
                //     const edges = result.map( gene => ({
                //         a: gene.m,
                //         b: gene.m,
                //         c: gene.mean,
                //         i: null
                //     }));
                // });
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
                // const colors = [0xab47bc, 0xffca28, 0x5c6bc0, 0x26c6da, 0x66bb6a, 0xffca28];
                // const colorMap = cfg.edgeOption.reduce((p, c, i) => {
                //     p[c] = colors[i];
                //     return p;
                // }, {});
                // worker.util.openDatabaseData(cfg.database).then(db => {
                //     db.table('mut').where('t').anyOfIgnoreCase(cfg.edgeOption).toArray().then(result => {
                //         const data = result.map(v => ({
                //             a: v.s,
                //             b: v.m,
                //             c: colorMap[v.t],
                //             i: null
                //         }));
                //         worker.postMessage({
                //             config: cfg,
                //             data: {
                //                 result: data
                //             }
                //         });
                //         worker.postMessage('TERMINATE');
                //     });
                // });
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
                        // case 'pid':
                        worker.util.openDatabaseData(config.database).then(db => {
                            db.table('patientSampleMap').toArray().then(result => {
                                resolve(result.map(v => ({
                                    a: v.s,
                                    b: v.s,
                                    c: 0xFF0000,
                                    i: null
                                })));
                            });
                        });
                        break;
                    // case 'sid':
                    //     worker.util.openDatabaseData(config.database).then(db => {
                    //         db.table('patientSampleMap').toArray().then(result => {
                    //             resolve(result.map(v => ({
                    //                 a: v.s,
                    //                 b: v.m,
                    //                 c: 0xFF0000,
                    //                 i: null
                    //             })));
                    //         });
                    //     });
                    //     break;
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
