import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { FastIcaConfigModel, FastIcaDataModel } from './fastica.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;


export const fasticaCompute = (config: FastIcaConfigModel, worker: DedicatedWorkerGlobalScope): void => {


    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'cluster_sk_fast_ica',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                whiten: config.whiten,
                algorithm: config.algorithm,
                fun: config.fun,
                tol: config.tol
            })
            .then(result => {
                result.resultScaled = worker.util.scale3d(result.result, config.pcx - 1, config.pcy - 1, config.pcz - 1);
                result.sid = matrix.sid;
                result.mid = matrix.mid;
                result.pid = matrix.pid;
                worker.postMessage({
                    config: config,
                    data: result
                });
                worker.postMessage('TERMINATE');
            });
    });
};
