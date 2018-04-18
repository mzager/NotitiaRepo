import { Legend } from './../../../model/legend.model';
import { DirtyEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import Dexie from 'dexie';
import { MiniBatchDictionaryLearningConfigModel } from './minibatchdictionarylearning.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const miniBatchDictionaryLearningCompute =
    (config: MiniBatchDictionaryLearningConfigModel, worker: DedicatedWorkerGlobalScope): void => {

        worker.util.getDataMatrix(config).then(matrix => {
            worker.util
                .fetchResult({
                    method: 'manifold_sk_minibatchdictionarylearning',
                    data: matrix.data,
                    n_components: config.n_components,
                    dimension: config.dimension,
                    alpha: config.alpha,
                    n_iter: config.n_iter,
                    fit_algorithm: config.fit_algorithm,
                    batch_size: config.batch_size,
                    shuffle: config.shuffle,
                    transform_algorithm: config.transform_algorithm,
                    split_sign: config.split_sign
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
