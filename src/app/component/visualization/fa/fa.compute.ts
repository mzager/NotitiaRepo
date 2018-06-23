import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { FaConfigModel } from './fa.model';
declare var ML: any;

export const faCompute = (config: FaConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  worker.util.getDataMatrix(config).then(matrix => {
    worker.util
      .fetchResult({
        method: 'cluster_sk_factor_analysis',
        data: matrix.data,
        n_components: config.n_components,
        dimension: config.dimension,
        tol: config.tol,
        svd_method: config.svd_method
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
        worker.postMessage({
          config: config,
          data: result
        });
        worker.postMessage('TERMINATE');
      });
  });
};
