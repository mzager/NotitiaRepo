import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from '../../../model/enum.model';
import { Legend } from '../../../model/legend.model';
import {LinearSVRConfigModel} from './linearsvr.model';


export const LinearSVRCompute = (config: LinearSVRConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  const classifier = new Set(config.sampleFilter);
  config.sampleFilter = [];
    worker.util.getDataMatrix(config).then(matrix => {
      const classes = matrix.sid.map(v => {
        return classifier.has(v) ? 0 : 1;
      });
        worker.util
            .fetchResult({
                method: 'cluster_sk_linearsvr',
                n_components: config.n_components,
                epsilon: config.epsilon,
                tol: config.tol,
                c: config.c,
                linearSVRLoss: config.linearSVRLoss,
                fit_intercept: config.fit_intercept,
                intercept_scaling: config.intercept_scaling,
                dual: config.dual,
                verbose: config.verbose,
                linearSVRRandomState: config.linearSVRRandomState,
                max_iter: config.max_iter,
                classes: classes
            }).then(result => {
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

