import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { LocalLinearEmbeddingConfigModel } from './locallinearembedding.model';

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
                result.resultScaled = worker.util.scale3d(result.result, config.pcx - 1, config.pcy - 1, config.pcz - 1);
                result.sid = matrix.sid;
                result.mid = matrix.mid;
                result.pid = matrix.pid;
                result.legends = [
                    Legend.create('Data Points',
                        config.entity === EntityTypeEnum.GENE ? ['Genes'] : ['Samples'],
                        [SpriteMaterialEnum.CIRCLE],
                        'SHAPE',
                        'DISCRETE'
                    )];
                worker.postMessage({
                    config: config,
                    data: result
                });
                worker.postMessage('TERMINATE');
            });
    });
};
