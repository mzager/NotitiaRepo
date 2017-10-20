import { DirtyEnum, EntityTypeEnum } from './../../../model/enum.model';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { scaleSequential, interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import { scaleLinear } from 'd3-scale';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import { Legend } from './../../../model/legend.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import { EdgeConfigModel } from './edges.model';
import * as _ from 'lodash';

export const edgesCompute = (config: EdgeConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    if (config.entityA === EntityTypeEnum.SAMPLE && config.entityB === EntityTypeEnum.SAMPLE) {
        worker.util.getEdgesSampleSample(config).then( result => {
            worker.postMessage({
                config: config,
                data: {
                    result: result
                }
            });
            worker.postMessage('TERMINATE');
        });
    }

    if (config.entityA === EntityTypeEnum.GENE && config.entityB === EntityTypeEnum.GENE) {
        worker.util.getEdgesGeneGene(config).then( result => {
            worker.postMessage({
                config: config,
                data: {
                    result: result
                }
            });
            worker.postMessage('TERMINATE');
        });
    }

    if ( (config.entityA === EntityTypeEnum.SAMPLE && config.entityB === EntityTypeEnum.GENE) ||
         (config.entityA === EntityTypeEnum.GENE && config.entityB === EntityTypeEnum.SAMPLE) ) {
        worker.util.getEdgesGeneSample(config).then( result => {
            worker.postMessage({
                config: config,
                data: {
                    result: result
                }
            });
            worker.postMessage('TERMINATE');
        });
    }
};
