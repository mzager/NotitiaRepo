import { EntityTypeEnum, DirtyEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { TruncatedSvdConfigModel, TruncatedSvdDataModel } from './truncatedsvd.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import * as _ from 'lodash';
import * as data from 'app/action/data.action';
declare var ML: any;

export const truncatedSvdCompute = (config: TruncatedSvdConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'cluster_sk_truncated_svd',
                n_components: config.n_components,
                algorithm: config.algorithm,
                tol: config.tol,
                data: matrix.data,
                n_iter: config.n_iter
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
