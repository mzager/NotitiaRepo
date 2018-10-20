import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from '../../../model/enum.model';
import { Legend } from '../../../model/legend.model';
import { NuSVCConfigModel } from './nusvc.model';

export const NuSVCCompute = (
  config: NuSVCConfigModel,
  worker: DedicatedWorkerGlobalScope
): void => {
  worker.util.getDataMatrix(config).then(matrix => {
    const classes = matrix.sid.map(v => {
      return [
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()
      ];
    });
    worker.util
      .fetchResult({
        method: 'cluster_sk_nusvc',
        n_components: config.n_components,
        float: config.float,
        kernal: config.kernal,
        degree: config. degree,
        coef0: config.coef0,
        shrinking: config.shrinking,
        probability: config.probability,
        tol: config.tol,
        verbose: config.verbose,
        max_iter: config.max_iter,
        decision_function_shape: config.decision_function_shape
        // cache_size : float, // optional
        // gamma = // optional
      })
      .then(result => {
        result.resultScaled = worker.util.scale3d(
          result.result,
          config.pcx - 1,
          config.pcy - 1,
          config.pcz - 1
        );
        result.sid = matrix.sid;
        result.mid = matrix.mid;
        result.pid = matrix.pid;
        result.legends = [
          Legend.create(
            'Data Points',
            config.entity === EntityTypeEnum.GENE ? ['Genes'] : ['Samples'],
            [SpriteMaterialEnum.CIRCLE],
            'SHAPE',
            'DISCRETE'
          )
        ];
        worker.postMessage({ config: config, data: result });
        worker.postMessage('TERMINATE');
      });
  });
};
