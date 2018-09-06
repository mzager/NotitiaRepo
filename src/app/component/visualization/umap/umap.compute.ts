import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import {
  EntityTypeEnum,
  SpriteMaterialEnum
} from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { UmapConfigModel } from './umap.model';

export const umapCompute = (
  config: UmapConfigModel,
  worker: DedicatedWorkerGlobalScope
): void => {
  worker.util.getDataMatrix(config).then(matrix => {
    worker.util
      .fetchResult({
        method: 'cluster_umap',
        data: matrix.data,
        n_neighbors: config.n_neighbors,
        min_dist: config.min_dist,
        metric: config.metric
      })
      .then(result => {
        // result.resultScaled = worker.util.scale3d(
        //   result.result,
        //   config.pcx - 1,
        //   config.pcy - 1,
        //   config.pcz - 1
        // );
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
