import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { FastIcaConfigModel, FastIcaDataModel } from './fastica.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;


export const fasticaCompute = (config: FastIcaConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {

        worker.util
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
            .then(mtx => {

                Promise.all([
                    worker.util.getSamplePatientMap(config.database),
                    worker.util
                        .fetchResult({
                            method: 'cluster_sk_fast_ica',
                            data: mtx.data,
                            n_components: config.n_components,
                            dimension: config.dimension,
                            whiten: config.whiten,
                            algorithm: config.algorithm,
                            fun: config.fun,
                            tol: config.tol
                        })
                ]).then(result => {
                    const psMap = result[0].reduce((p, c) => { p[c.s] = c.p; return p; }, {});
                    const data = result[1];
                    const resultScaled = worker.util.scale3d(data.result);
                    worker.postMessage({
                        config: config,
                        data: {
                            legendItems: [],
                            result: data,
                            resultScaled: resultScaled,
                            patientIds: mtx.samples.map(v => psMap[v]),
                            sampleIds: mtx.samples,
                            markerIds: mtx.markers
                        }
                    });
                    worker.postMessage('TERMINATE');
                });
            });
    }
};

