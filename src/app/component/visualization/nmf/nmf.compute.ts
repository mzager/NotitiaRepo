import { Legend } from './../../../model/legend.model';
import { EntityTypeEnum, DirtyEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { NmfConfigModel, NmfDataModel } from './nmf.model';
import { DedicatedWorkerGlobalScope } from 'compute';

export const nmfCompute = (config: NmfConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'cluster_sk_nmf',
                n_components: config.n_components,
                data: matrix.data,
                init: config.init,
                solver: config.solver,
                beta_loss: config.beta_loss,
                tol: config.tol
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
