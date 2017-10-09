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

    // worker.util.loadData(config.dataKey).then((data) => {

    //     if (!config.visible) {
    //         worker.postMessage({
    //             config: config,
    //             data: {
    //                 markers: [],
    //                 samples: [],
    //                 edges: []
    //             }
    //         });
    //         worker.postMessage('TERMINATE');
    //     }
    //     const legendItems: Array<Legend> = [];
    //     console.log('---edges---');
    //     const molec = data.molecularData[0];
    //     const edges = [];
    //     const values = molec.data.reduce( (p, c) => {p.push(Math.min.apply( Math, c )); p.push(Math.max.apply( Math, c )); return p; }, []);
    //     const min = Math.min.apply( Math, values );
    //     const max = Math.max.apply( Math, values);
    //     const s = d3Scale.scaleSequential(interpolateRdBu).domain([max, min]);
    //     molec.data.forEach((row, rowIndex) => {
    //         row.forEach((col, colIndex) => {
    //             if (col > 9000) {
    //                 edges.push({
    //                     value: col,
    //                     marker: molec.markers[rowIndex],
    //                     sample: molec.samples[colIndex],
    //                     color: ChartUtil.colorToHex( s(col) )
    //                 });
    //             }
    //         });
    //     });
    //     worker.postMessage({
    //         config: config,
    //         data: {
    //             markers: _.uniqBy(edges, 'marker').reduce( (p, c) => { p[c.marker] = true; return p; }, {}),
    //             samples: _.uniqBy(edges, 'sample').reduce( (p, c) => { p[c.sample] = true; return p; }, {}),
    //             edges: edges
    //         }
    //     });
    //     worker.postMessage('TERMINATE');
    // });
};
