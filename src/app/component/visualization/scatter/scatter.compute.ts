import { ScatterConfigModel } from './scatter.model';
import { Legend } from './../../../model/legend.model';
import {
  EntityTypeEnum,
  SpriteMaterialEnum
} from './../../../model/enum.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';

export const scatterCompute = (
  config: ScatterConfigModel,
  worker: DedicatedWorkerGlobalScope
): void => {
  worker.util.fetchUri(config.uri).then(result => {
    result.resultScaled = worker.util.scale3d(result.data);
    result.sid = result.rows;
    result.mid = result.cols;
    result.pid = result.rows;
    result.legends = [
      Legend.create(
        'Data Points',
        ['Samples'],
        [SpriteMaterialEnum.CIRCLE], // config.entity === EntityTypeEnum.GENE ? ['Genes'] : ['Samples'],
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
};
