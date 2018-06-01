import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { Legend } from './../../../model/legend.model';
import { DirtyEnum } from 'app/model/enum.model';
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
    legendNodes.labels = [
        'unspecified entity',
        'process',
        'port',
        'simple chemical',
        'macromolecule',
        'nucleic acid',
        'multimer',
        'sink',
        'tag',
        'observable',
        'perturbation'
    ];
    legendNodes.values = legendNodes.labels.map(v => {
        return './assets/shapes/shape-' + v + '-solid-legend.png';
    });

    const legendEdges = new Legend();
    legendEdges.name = 'Edges';
    legendEdges.type = 'SHAPE';
    legendEdges.labels = [
        'consumption',
        'production',
        'modulation',
        'stimulation',
        'catalysis',
        'inhibition',
        'trigger'
    ];
    legendEdges.values = legendEdges.labels.map(v => {
        return './assets/shapes/shape-' + v + '-solid-legend.png';
    });

    const legendOps = new Legend();
    legendOps.name = 'Operations';
    legendOps.type = 'SHAPE';
    legendOps.labels = [
        'and',
        'or',
        'not'
    ];
    legendOps.values = legendOps.labels.map(v => {
        return './assets/shapes/shape-' + v + '-solid-legend.png';
    });

    const legends = [
        legendNodes,
        legendEdges,
        legendOps
    ];


    fetch(config.pathwayUri, requestInit)
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
