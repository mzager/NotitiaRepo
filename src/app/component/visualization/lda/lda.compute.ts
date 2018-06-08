import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { LdaConfigModel } from './lda.model';

export const ldaCompute = (config: LdaConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'cluster_sk_latent_dirichlet_allocation',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                learning_method: config.learning_method,
                learning_decay: config.learning_decay,
                learning_offset: config.learning_offset,
                mean_change_tol: config.mean_change_tol
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
