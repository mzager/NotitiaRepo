import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { LinearDiscriminantAnalysisConfigModel, LinearDiscriminantAnalysisDataModel } from './lineardiscriminantanalysis.model';
import { DedicatedWorkerGlobalScope } from 'compute';

// tslint:disable-next-line:max-line-length
export const linearDiscriminantAnalysisCompute = (config: LinearDiscriminantAnalysisConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'manifold_sk_lineardiscriminantanalysis',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                solver: config.solver,
                shrinkage: config.shrinkage,
                // priors =
                store_covariance: config.store_covariance,
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
