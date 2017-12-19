import { DirtyEnum } from 'app/model/enum.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import { PathwaysConfigModel } from './pathways.model';

export const pathwaysCompute = (config: PathwaysConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    // worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept-Encoding', 'gzip');
        const requestInit: RequestInit = {
          method: 'GET',
          headers: headers,
          mode: 'cors',
          cache: 'default'
        };

        fetch('https://s3-us-west-2.amazonaws.com/notitia/reactome/' + config.pathway + '.json.gz', requestInit)
            .then(response => response.json())
            .then(response => {
                worker.postMessage({
                    config: config,
                    data: {layout: response}
                });
                worker.postMessage('TERMINATE');
            });
    }
};
