import { Legend } from './../../../model/legend.model';
import { DirtyEnum } from 'app/model/enum.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import { PathwaysConfigModel } from './pathways.model';

export const pathwaysCompute = (config: PathwaysConfigModel, worker: DedicatedWorkerGlobalScope): void => {


    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Encoding', 'gzip');
    const requestInit: RequestInit = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };

    const legendNodes = new Legend();
    legendNodes.name = 'Nodes';
    legendNodes.type = 'SHAPE';
    legendNodes.labels = legendNodes.values = [
        'unspecified entity',
        'simple chemical',
        'macromolecule',
        'nucleic acid',
        'multimer',
        'sink',
        'tag',
        'observable',
        'perturbation'
    ];

    const legendEdges = new Legend();
    legendEdges.name = 'Edges';
    legendEdges.type = 'SHAPE';
    legendEdges.labels = legendEdges.values = [
        'consumption',
        'production',
        'modulation',
        'stimulation',
        'catalysis',
        'inhibition',
        'trigger'
    ];

    const legendOps = new Legend();
    legendOps.name = 'Operations';
    legendOps.type = 'SHAPE';
    legendOps.labels = legendOps.values = [
        'and',
        'or',
        'not'
    ];

    const legends = [
        legendNodes,
        legendEdges,
        legendOps
    ];

    fetch('https://s3-us-west-2.amazonaws.com/notitia/pathways/' + config.pathway + '.json.gz', requestInit)
        .then(response => response.json())
        .then(response => {
            worker.postMessage({
                config: config,
                data: {
                    legends: legends,
                    layout: response
                }
            });
            worker.postMessage('TERMINATE');
        });
};
