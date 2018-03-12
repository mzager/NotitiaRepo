import { LocalLinearEmbeddingConfigModel, LocalLinearEmbeddingDataModel } from './locallinearembedding.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { DedicatedWorkerGlobalScope } from 'compute';

export const localLinearEmbeddingCompute = (config: LocalLinearEmbeddingConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'manifold_sk_local_linear_embedding',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                n_neighbors: config.n_neighbors,
                eigen_solver: config.eigen_solver,
                reg: config.reg,
                neighbors_algorithm: config.neighbors_algorithm,
                lle_method: config.lle_method,
                hessian_tol: config.hessian_tol,
                modified_tol: config.modified_tol,
                tol: config.tol,
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
    })
};         
