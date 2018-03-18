import {
    SpectralEmbeddingConfigModel, SpectralEmbeddingDataModel, SpectralEmbeddingAffinity, SpectralEmbeddingEigenSolver
} from './spectralembedding.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const spectralEmbeddingCompute = (config: SpectralEmbeddingConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'manifold_sk_spectral_embedding',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                eigen_solver: config.eigen_solver,
                n_neighbors: config.n_neighbors,
                gamma: config.gamma,
                affinity: config.affinity
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
