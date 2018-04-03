import { DedicatedWorkerGlobalScope } from './../../../../compute';
import { HistogramConfigModel } from './histogram.model';

export const histogramCompute = (config: HistogramConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    console.log("HIST");
    worker.postMessage({
        config: config,
        data: {
            test: 'hi'
        }
    });

    worker.postMessage('TERMINATE');
};
