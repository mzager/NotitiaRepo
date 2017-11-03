import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HicConfigModel } from './hic.model';
import { Legend } from 'app/model/legend.model';
import { ColorEnum, DirtyEnum } from 'app/model/enum.model';
import * as util from 'app/service/compute.worker.util';
import { scaleLinear, scaleQuantize, scaleQuantile, scaleOrdinal, scaleThreshold } from 'd3-scale';
import { scaleSequential, schemeRdBu, interpolateRdBu } from 'd3-scale-chromatic';
import * as _ from 'lodash';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as d3Array from 'd3-array';
import * as JStat from 'jstat';
import { DedicatedWorkerGlobalScope } from 'compute';
import graph from 'ngraph.graph';
import forcelayout3d from 'ngraph.forcelayout3d';


export const hicComputeFn = (config: HicConfigModel): Promise<any> => {
    return new Promise( (resolve, reject) => {
        const util: ComputeWorkerUtil = new ComputeWorkerUtil();
        util.getGeneLinkGraphByGenes(config.gene).then( result => {
            const _graph = graph();
            result.forEach( link => {
                _graph.addLink( link.source, link.target );
            });
            const _layout = forcelayout3d(_graph);
            for (let i = 0; i < 1000; i++) {
                _layout.step();
            }
            const nodes = [];
            const edges = [];

            _graph.forEachNode( node => { node.data = _layout.getNodePosition(node.id); nodes.push(node); });
            _graph.forEachLink( link => { link.data = _layout.getLinkPosition( link.id ); edges.push(link); });

            const returnValue = {
                nodes: nodes,
                edges: edges
            };
            resolve(returnValue);

        });
    });
};


export const hicCompute = (config: HicConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.postMessage({
        config: config,
        data: {
            legendItems: [],
            nodes: [],
            edges: []
        }
    });
    worker.postMessage('TERMINATE');
};
