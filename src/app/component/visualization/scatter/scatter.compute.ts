import { ScatterConfigModel } from './scatter.model';
import { Legend } from './../../../model/legend.model';
import { EntityTypeEnum, SpriteMaterialEnum } from './../../../model/enum.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';

export const scatterCompute = (config: ScatterConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  worker.util.fetchUri(config.uri).then(result => {
    //{"row":"sample","col":"dim","cols":["one","two","three"],"rows":
    result.resultScaled = result.map(v => {
      v[0] *= 2;
      v[1] *= 2;
      v[2] *= 2;
      return v;
    }); // worker.util.scale3d(result.data);
    result.sid = 'a';
    // result.rows;
    result.mid = 'b';
    // result.cols;
    result.pid = 'c';
    // result.rows;
    result.legends = [Legend.create('Data Points', ['Samples'], [SpriteMaterialEnum.CIRCLE], 'SHAPE', 'DISCRETE')]; // config.entity === EntityTypeEnum.GENE ? ['Genes'] : ['Samples'],
    worker.postMessage({
      config: config,
      data: result
    });
    worker.postMessage('TERMINATE');
  });
};
