import { DendogramConfigModel } from './dendogram.model';
import { DirtyEnum } from 'app/model/enum.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import { DimensionEnum, HClustMethodEnum, HClustDistanceEnum } from './../../../model/enum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Legend } from 'app/model/legend.model';
import { scaleSequential, schemeRdBu, interpolateRdBu, interpolateSpectral } from 'd3-scale-chromatic';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as util from 'app/service/compute.worker.util';
import * as _ from 'lodash';
import { interpolateViridis } from 'd3';

export const dendogramCompute = (config: DendogramConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
            .then(mtx => {

                Promise.all([
                    worker.util.getSamplePatientMap(config.database),
                    worker.util
                        .fetchResult({
                            data: mtx.data,
                            transpose: 0,
                            method: 'cluster_sp_agglomerative',
                            n_clusters: -1,
                            sp_metric: config.dist,
                            sp_method: config.method,
                            sp_ordering: config.order ? -1 : 1
                        }),
                ]).then(result => {

                    // // const matrix = mtx.data;
                    const minMax = mtx.data.reduce((p, c) => {
                        p[0] = Math.min(p[0], ...c);
                        return p;
                    }, [Infinity, -Infinity]); // Min Max

                    // const color = d3Scale.scaleSequential(interpolateViridis).domain(minMax);
                    // let colors = mtx.data.map(row => row.map(cell => color(cell)));
                    // colors = result[1].order.map(v => result[2].order.map(w => colors[v][w]));

                    worker.postMessage({
                        config: config,
                        data: {
                            map: result[0],
                            // colors: colors,
                            range: minMax,
                            result: result[1],
                        }
                    });
                    worker.postMessage('TERMINATE');
                });
            });
    }
};
