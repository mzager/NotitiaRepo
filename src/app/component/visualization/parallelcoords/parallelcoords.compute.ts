import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { ParallelCoordsConfigModel } from './parallelcoords.model';

export const parallelcoordsCompute = (config: ParallelCoordsConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.postMessage('TERMINATE');
};
