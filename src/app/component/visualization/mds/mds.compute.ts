import { Legend } from './../../../model/legend.model';
import { EntityTypeEnum, DirtyEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { MdsConfigModel, MdsDataModel } from './mds.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';

export const mdsCompute = (config: MdsConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'manifold_sk_mds',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                metric: config.metric,
                eps: config.eps,
                dissimilarity: config.dissimilarity
            })
            .then(result => {
                result.resultScaled = worker.util.scale3d(result.result, 0, 1, 2);
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
