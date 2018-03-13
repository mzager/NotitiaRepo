import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { PcaConfigModel, PcaDataModel } from './pca.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
import { DataDecoratorTypeEnum } from '../../../model/data-map.model';
declare var ML: any;


export const pcaCompute = (config: PcaConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'cluster_sk_pca',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                random_state: config.random_state,
                tol: config.tol,
                svd_solver: config.svd_solver,
                whiten: config.whiten,
                copy: config.copy,
                iterated_power: config.iterated_power
            }).then(result => {
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
    })
};
