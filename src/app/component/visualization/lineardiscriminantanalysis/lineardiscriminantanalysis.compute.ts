import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { LinearDiscriminantAnalysisConfigModel } from './lineardiscriminantanalysis.model';

// tslint:disable-next-line:max-line-length
export const linearDiscriminantAnalysisCompute = (config: LinearDiscriminantAnalysisConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'manifold_sk_lineardiscriminantanalysis',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                solver: config.solver,
                shrinkage: config.shrinkage,
                // priors =
                store_covariance: config.store_covariance,
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
