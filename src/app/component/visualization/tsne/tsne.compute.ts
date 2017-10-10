import { DedicatedWorkerGlobalScope } from './../../../../compute';
import { DimensionEnum } from './../../../model/enum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { TsneConfigModel } from './tsne.model';
import { Legend } from 'app/model/legend.model';
import * as TSNE from 'tsne-js';
import * as util from 'app/service/compute.worker.util';
import * as _ from 'lodash';

// Internal Caches
const _config: TsneConfigModel = null;
const _molecularData: any = null;
const _pca: any = null;
const _pointColor: Array<number> = [];
const _pointSize: Array<number> = [];
const _pointShape: Array<number> = [];

export const tsneCompute = (config: TsneConfigModel, worker: DedicatedWorkerGlobalScope): void => {

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

    //     const model = new TSNE({
    //         dim: (config.dimension === DimensionEnum.THREE_D) ? 3 :
    //             (config.dimension === DimensionEnum.TWO_D) ? 2 : 1,
    //         perplexity: config.perpexity,
    //         earlyExaggeration: config.earlyExaggeration,
    //         learningRate: config.learningRate,
    //         nIter: config.nIter,
    //         metric: config.distance,

    //     });
    //     model.init({
    //         data: matrix,
    //         type: config.density
    //     });

    //     const pointColor: { legend: Legend, value: number[] } = worker.util.createPatientColorMap(data, config.pointColor);
    //     const pointSize: { legend: Legend, value: number[] } = worker.util.createPatientSizeMap(data, config.pointSize);
    //     const pointShape: { legend: Legend, value: number[] } = worker.util.createPatientShapeMap(data, config.pointShape);
    //     legendItems.push(pointColor.legend, pointSize.legend, pointShape.legend);
    //     const rv = {
    //         config: config,
    //         data: {
    //             legendItems: legendItems,
    //             resultScaled: [],
    //             pointColor: pointColor.value,
    //             pointShape: pointShape.value,
    //             pointSize: pointSize.value,
    //             sampleIds: worker.util.createSampleMap(data),
    //             markerIds: worker.util.createMarkerMap(molecularData)
    //         }
    //     };

    //     model.on('progressIter', _.throttle(() => {
    //         const result = model.getOutput();

    //             model.scale = worker.util.createScale(
    //                 config.domain,
    //                 result.reduce((p, c) => {
    //                     p[0] = Math.min(p[0], c[0]);
    //                     p[0] = Math.min(p[0], c[1]);
    //                     p[0] = Math.min(p[0], c[2]);
    //                     p[1] = Math.max(p[1], c[0]);
    //                     p[1] = Math.max(p[1], c[1]);
    //                     p[1] = Math.max(p[1], c[2]);
    //                     return p;
    //                 }, [Infinity, -Infinity])
    //             );

    //         rv.data.resultScaled = result.map((u) => u.map((v) => model.scale(v)));
    //         worker.postMessage(rv);
    //     }, 500));

    //     model.run();
    //     const result = model.getOutput();
    //     const resultScale = worker.util.createScale(
    //         config.domain,
    //         result.reduce((p, c) => {
    //             p[0] = Math.min(p[0], c[0]);
    //             p[0] = Math.min(p[0], c[1]);
    //             p[0] = Math.min(p[0], c[2]);
    //             p[1] = Math.max(p[1], c[0]);
    //             p[1] = Math.max(p[1], c[1]);
    //             p[1] = Math.max(p[1], c[2]);
    //             return p;
    //         }, [Infinity, -Infinity])
    //     );

    //     rv.data.resultScaled = result.map((u) => u.map((v) => resultScale(v)));
    //     worker.postMessage(rv);
    //     worker.postMessage('TERMINATE');
    // });
};
