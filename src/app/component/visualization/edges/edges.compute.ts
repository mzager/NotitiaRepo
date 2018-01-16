import { DirtyEnum, EntityTypeEnum } from './../../../model/enum.model';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { scaleSequential, interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import { scaleLinear } from 'd3-scale';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import { Legend } from './../../../model/legend.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import { EdgeConfigModel } from './edges.model';
import * as _ from 'lodash';

export const edgesCompute = (config: EdgeConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    const egdes = {
        getEventsEvents(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => {
                });
            });
        },
        getEventsGenes(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => {
                });
            });
        },
        getEventsPatients(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => {
                });
            });
        },
        getEventsSamples(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => {
                });
            });
        },
        getGenesGenes(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                debugger;
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
        getGenesPatients(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => {
                });
            });
        },
        getGenesSamples(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => { 
                });
            });
        },
        getPatientsPatients(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => { 
                });
            });
        },
        getPatientsSamples(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => { 
                });
            });
        },
        getSamplesSamples(): Promise<any> {
            return new Promise( (resolve, reject) => {
                if (this.edgeOptions === 'None') { resolve([]); return; }
                worker.util.openDatabaseData(config.database).then( db => { 
                });
            });
        }
    };
    // var t = egdes['get' + [config.entityA, config.entityB];
    // debugger;
    
    egdes['get' + [config.entityA, config.entityB].sort().join('')]();

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
