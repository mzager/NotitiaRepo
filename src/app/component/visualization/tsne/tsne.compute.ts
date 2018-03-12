import { TsneConfigModel, TsneDataModel } from './tsne.model';
import { DimensionEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';
declare var ML: any;


export const tsneCompute = (config: TsneConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'manifold_sk_tsne',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                perplexity: config.perplexity,
                early_exaggeration: config.early_exaggeration,
                learning_rate: config.learning_rate,
                n_iter: config.n_iter,
                n_iter_without_progress: config.n_iter,
                min_grad_norm: config.min_grad_norm,
                metric: config.metric,
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
