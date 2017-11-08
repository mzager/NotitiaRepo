import { DimensionEnum } from './../../../model/enum.model';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HicConfigModel } from './hic.model';
import { Legend } from 'app/model/legend.model';
import { ColorEnum, DirtyEnum } from 'app/model/enum.model';
import * as util from 'app/service/compute.worker.util';
import { scaleLinear, scaleQuantize, scaleQuantile, scaleOrdinal, scaleThreshold } from 'd3-scale';
import { scaleSequential, schemeRdBu, interpolateGnBu, interpolateYlGnBu } from 'd3-scale-chromatic';
import * as _ from 'lodash';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as d3Force from 'd3-force';
import * as d3Array from 'd3-array';
import * as JStat from 'jstat';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as d3_force from 'd3-force-3d';
import graph from 'ngraph.graph';

export const hicComputeFn = (config: HicConfigModel): Promise<any> => {
    return new Promise( (resolve, reject) => {
        const util: ComputeWorkerUtil = new ComputeWorkerUtil();

        util.getGeneLinkGraphByGenes(config.gene).then( result => {

            let nodes = Array.from( new Set( result.map( v => v.target ).concat( result.map( v => v.source) )));

            const geneDataMap = result.reduce( (p, c) => {
                p[c.source] = c.sourceData;
                p[c.target] = c.targetData;
                return p;
            }, {});

            // Color Scale
            const color = d3Scale.scaleSequential(interpolateGnBu).domain(
                result.reduce( (p, c) => {
                    p[0] = Math.min(p[0], c.tension);
                    p[1] = Math.max(p[1], c.tension);
                    return p;
                }, [Infinity, -Infinity])
            );

            const links = result.map( v => {
                v.source = nodes.indexOf(v.source);
                v.target = nodes.indexOf(v.target);
                v.color  = color(v.tension);
                return v;
            });

            nodes = nodes.map( v => ({ gene: v, data: geneDataMap[ v.toString() ] }) );

            const g = d3_force.forceSimulation()
                .numDimensions(
                    (config.dimensions === DimensionEnum.THREE_D) ? 3 :
                    (config.dimensions === DimensionEnum.TWO_D) ? 2 : 1)
                .nodes(nodes)
                .force('link', d3_force.forceLink().distance(link => link.tension).links(links))
                .force('charge', d3_force.forceManyBody().strength( link => -200 ) )
                .force('center', d3_force.forceCenter())
                .stop();

            for (let i = 0; i < 100; i++) {
                g.tick();
            }

            const returnValue = {
                legendItems: [],
                nodes: nodes,
                edges: links
            };
            resolve(returnValue);

        });
    });
};


export const hicCompute = (config: HicConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);
    if (config.dirtyFlag & DirtyEnum.OPTIONS) {
        worker.postMessage({
            config: config,
            data: {}
        });
        worker.postMessage('TERMINATE');
    }
    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        hicComputeFn(config).then(result => {
            worker.postMessage({
                config: config,
                data: result
            });
            worker.postMessage('TERMINATE');
        });
    }
};
