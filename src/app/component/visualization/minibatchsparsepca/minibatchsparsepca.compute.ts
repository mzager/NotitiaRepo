import { Legend } from './../../../model/legend.model';
import { EntityTypeEnum, DirtyEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { MiniBatchSparsePcaConfigModel, MiniBatchSparsePcaDataModel } from './minibatchsparsepca.model';
import { DedicatedWorkerGlobalScope } from 'compute';

export const miniBatchSparsePcaCompute = (config: MiniBatchSparsePcaConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'cluster_sk_mini_batch_sparse_pca',
                data: matrix.data,
                n_components: config.n_components,
                alpha: config.alpha,
                ridge_alpha: config.ridge_alpha,
                n_iter: config.n_iter,
                batch_size: config.batch_size,
                shuffle: config.shuffle,
                sk_method: config.sk_method
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
