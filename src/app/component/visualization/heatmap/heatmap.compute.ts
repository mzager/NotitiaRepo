import { HeatmapConfigModel } from './heatmap.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import { DimensionEnum, HClustMethodEnum, HClustDistanceEnum } from './../../../model/enum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { Legend } from 'app/model/legend.model';
import { scaleSequential, schemeRdBu, interpolateRdBu } from 'd3-scale-chromatic';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as TSNE from 'tsne-js';
import * as util from 'app/service/compute.worker.util';
import * as _ from 'lodash';
declare var ML: any;

export const heatmapCompute = (config: HeatmapConfigModel, worker: DedicatedWorkerGlobalScope): void => {


    // // const postMessageThrottled = _.throttle(postMessage, 1000);
    // worker.util.loadData(config.dataKey).then((data) => {

    //     const legendItems: Array<Legend> = [];
    //     const molecularData = data.molecularData[0];

    //     let matrix = molecularData.data;
    //     if (config.markerFilter.length > 0) {
    //         const genesOfInterest = molecularData.markers
    //             .map((v, i) => (config.markerFilter.indexOf(v) >= 0) ? { gene: v, i: i } : -1)
    //             .filter(v => v !== -1);
    //         matrix = genesOfInterest.map(v => molecularData.data[v.i]);
    //     }
    //     const pointSize = 1;

    //     const method = (config.method === HClustMethodEnum.AGNES) ? ML.Clust.hclust.agnes : ML.Clust.hclust.diana;
    //     const cluster = method(matrix, { kind: config.distance });

    //     const markerCount = matrix.length;
    //     const sampleCount = matrix[0].length;

    //     const points = markerCount * sampleCount;
    //     const positions = new Float32Array(points * 3);
    //     const colors = new Float32Array(points * 3);

    //     const minMax = matrix.reduce( (p, c) => {
    //         p[0] = Math.min( p[0], ...c);
    //         p[1] = Math.max( p[1], ...c);
    //         return p;
    //     }, [Infinity, -Infinity]); // Min Max
    //     const scaleColor = d3Scale.scaleSequential(interpolateRdBu).domain(minMax);
    //     const scaleRegex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;

    //     for (let i = 0; i < markerCount; ++i) {
    //         const mtx2d = matrix[cluster.index[i].index];
    //         for (let j = 0; j < sampleCount; ++j) {
    //             const val = mtx2d[j];
    //             const index = (i * sampleCount + j) * 3;

    //             positions[index] = i * pointSize;
    //             positions[index + 1] = j * pointSize;
    //             positions[index + 2] = 0;

    //             const rgbArray = scaleRegex.exec(scaleColor(val).toString())
    //                 .reduce( (p, c, rgbi) => {
    //                     if (rgbi > 0 && rgbi < 4) {
    //                         p[rgbi - 1] = parseInt(c, 10) / 255;
    //                     }
    //                     return p;
    //                 }, new Array(3) );
    //             colors[index] = rgbArray[0];
    //             colors[index + 1] = rgbArray[1];
    //             colors[index + 2] = rgbArray[2];
    //         }
    //     }

    //     worker.postMessage({
    //         config: config,
    //         data: {
    //             legendItems: legendItems,
    //             positions: positions,
    //             colors: colors,
    //             cluster: cluster
    //         }
    //     });

    //     worker.postMessage('TERMINATE');
    // });
};
