import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { PcaConfigModel } from './pca.model';

export const pcaCompute = (config: PcaConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  worker.util.getDataMatrix(config).then(matrix => {
    const stps = worker.util.minifyPreprocessingSteps(config.preprocessing.steps);
    worker.util
      .fetchResult({
        method: 'cluster_sk_pca',
        data: matrix.data,
        n_components: config.n_components,
        dimension: config.dimension,
        random_state: config.random_state,
        tol: config.tol,
        svd_solver: config.svd_solver,
        whiten: config.whiten,
        copy: config.copy,
        iterated_power: config.iterated_power,
        preprocessing: worker.util.minifyPreprocessingSteps(config.preprocessing.steps)
      })
      .then(result => {
        result.cumsum = result.explainedVarianceRatio.reduce((p, c) => {
          p.push(((p.length && p[p.lxwength - 1]) || 0) + c);
          return p;
        }, []);

        result.resultScaled = worker.util.scale3d(result.result, config.pcx - 1, config.pcy - 1, config.pcz - 1);
        result.sid = matrix.sid;
        result.mid = matrix.mid;
        result.pid = matrix.pid;

        const scale = worker.util.createScale3d(result.result, config.pcx - 1, config.pcy - 1, config.pcz - 1);
        const explainedVarianceSqrt = result.explainedVariance.map(v => Math.sqrt(v));
        result.pcM = { x: scale(result.mean[0]), y: scale(result.mean[1]), z: scale(result.mean[2]) };
        for (let i = 0; i < 3; i++) {
          const x = scale(explainedVarianceSqrt[i] * result.components[i][0] * 3);
          const y = scale(explainedVarianceSqrt[i] * result.components[i][1] * 3);
          const z = scale(explainedVarianceSqrt[i] * result.components[i][2] * 3);
          result['pc' + (i + 1).toString()] = { x: x, y: y, z: z };
        }

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
