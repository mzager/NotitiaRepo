import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { EntityTypeEnum, SpriteMaterialEnum } from '../../../model/enum.model';
import { Legend } from '../../../model/legend.model';
import {PlsRegressionConfigModel} from './plsregression.model';


export const PlsRegressionCompute = (config: PlsRegressionConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  const classifier = new Set(config.sampleFilter);
  config.sampleFilter = [];
    worker.util.getDataMatrix(config).then(matrix => {
      const classes = matrix.sid.map(v => {
        return classifier.has(v) ? 0 : 1;
      });
        worker.util
            .fetchResult({
                method: 'cluster_sk_plsregression',
                n_components: config.n_components,
                data: matrix.data,
                scale: config.scale,
                copy: config.copy,
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

