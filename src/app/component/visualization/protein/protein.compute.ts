import { SpriteMaterialEnum } from './../../../model/enum.model';
import { ProteinConfigModel } from './protein.model';
import { Legend } from './../../../model/legend.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';

export const ProteinCompute = (config: ProteinConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  const headers = {
    // Accept: 'application/json',
    // 'Content-Type': 'application/json',
    // 'Accept-Encoding': 'gzip',
    'Access-Control-Allow-Origin': '*'
  };
  fetch('http://files.rcsb.org/view/2POR.pdb', { headers: headers, method: 'GET' }).then(result => {
    debugger;
    const legends = [Legend.create('Data Points', ['Samples'], [SpriteMaterialEnum.CIRCLE], 'SHAPE', 'DISCRETE')];
    worker.postMessage({ config: config, data: { legends: legends } });
    worker.postMessage('TERMINATE');
  });

  // worker.util.fetchUri(config.uri).then(result => {
  //   result.legends = [Legend.create('Data Points', ['Samples'], [SpriteMaterialEnum.CIRCLE], 'SHAPE', 'DISCRETE')];
  //   worker.postMessage({
  //     config: config,
  //     data: result
  //   });
  //   worker.postMessage('TERMINATE');
  // });
};
