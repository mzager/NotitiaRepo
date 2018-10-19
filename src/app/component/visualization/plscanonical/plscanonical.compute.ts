import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from '../../../model/enum.model';
import { Legend } from '../../../model/legend.model';
import { PlsCanonicalConfigModel } from './plscanonical.model';

export const PlsCanonicalCompute = (
  config: PlsCanonicalConfigModel,
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
        method: 'cluster_sk_plscanonical',
        n_components: config.n_components,
        data: matrix.data,
        scale: config.scale,
        copy: config.copy,
        classes: classes,
        tol: config.tol,
        max_iter: config.max_iter,
        algorithm: config.algorithm
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
