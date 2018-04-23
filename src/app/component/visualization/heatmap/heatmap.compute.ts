import { DirtyEnum } from 'app/model/enum.model';
import { HeatmapConfigModel } from './heatmap.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { DimensionEnum, HClustMethodEnum, HClustDistanceEnum } from './../../../model/enum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Legend } from 'app/model/legend.model';
import { schemeRdBu, interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as util from 'app/service/compute.worker.util';
import * as _ from 'lodash';
import { interpolateViridis } from 'd3';

export const heatmapCompute = (config: HeatmapConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        Promise.all([
            worker.util
                .fetchResult({
                    data: matrix.data,
                    transpose: 0,
                    method: 'cluster_sp_agglomerative',
                    n_clusters: -1,
                    sp_metric: config.dist,
                    sp_method: config.method,
                    sp_ordering: config.order ? -1 : 1
                }),
            worker.util
                .fetchResult({
                    data: matrix.data,
                    transpose: 1,
                    method: 'cluster_sp_agglomerative',
                    n_clusters: -1,
                    sp_metric: config.dist,
                    sp_method: config.method,
                    sp_ordering: config.order ? -1 : 1
                })
        ]).then(result => {

            const minMax = matrix.data.reduce((p, c) => {
                p[0] = Math.min(p[0], ...c);
                p[1] = Math.max(p[1], ...c);
                return p;
            }, [Infinity, -Infinity]); // Min Max

            const color = d3Scale.scaleSequential(interpolateViridis).domain(minMax);
            let colors = matrix.data.map(row => row.map(cell => color(cell)));
            colors = result[0].order.map(v => result[1].order.map(w => colors[v][w]));

            worker.postMessage({
                config: config,
                data: {
                    matrix: matrix,
                    colors: colors,
                    range: minMax,
                    x: result[0],
                    y: result[1]
                }
            });

            worker.postMessage('TERMINATE');
        });
    });
};
