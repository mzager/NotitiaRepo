import { PcaKernalConfigModel } from './pcakernal.model';
import { EntityTypeEnum, DirtyEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const pcaKernalCompute = (config: PcaKernalConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                method: 'cluster_sk_pca_kernal',
                n_components: config.n_components,
                data: matrix.data,
                kernel: config.kernel,
                degree: config.degree,
                coef0: config.coef0,
                alpha: config.alpha,
                fit_inverse_transform: config.fit_inverse_transform,
                eigen_solver: config.eigen_solver,
                tol: config.tol,
                remove_zero_eig: config.remove_zero_eig
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

