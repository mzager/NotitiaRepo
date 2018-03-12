import { PcaSparseConfigModel } from './pcasparse.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const pcaSparseCompute = (config: PcaSparseConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'cluster_sk_pca_sparse',
                n_components: config.n_components,
                data: matrix.data,
                alpha: config.alpha,
                ridge_alpha: config.ridge_alpha,
                max_iter: config.max_iter,
                tol: config.tol,
                sk_method: config.sk_method
            })
            .then(result => {
                result.resultScaled = worker.util.scale3d(result.result, 0, 1, 2);
                result.sid = matrix.sid;
                result.mid = matrix.mid;
                result.pid = matrix.pid
                worker.postMessage({
                    config: config,
                    data: result
                });
                worker.postMessage('TERMINATE');
            });
    });
}
