import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { TruncatedSvdConfigModel, TruncatedSvdDataModel } from './truncatedsvd.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const truncatedSvdCompute = (config: TruncatedSvdConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    //     worker.util.loadData(config.dataKey).then((data) => {

    //         const legendItems: Array<Legend> = [];
    //         const molecularData = worker.util.processMolecularData(data.molecularData[0], config);

    //         fetch('https://0x8okrpyl3.execute-api.us-west-2.amazonaws.com/dev', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 method: 'cluster_sk_truncated_svd',
    //                 components: config.components,
    //                 fun: config.algorithm,
    //                 tol: config.tol,
    //                 data: molecularData
    //             })
    //         })
    //         .then( v => v.json() )
    //         .then( v => {

    //             const response = JSON.parse(v.body);
    //             const resultScaled = worker.util.scale3d( response.result );

    //             // Colors + Legend
    //             const pointColor: {legend: Legend, value: number[]} = worker.util.createPatientColorMap(data, config.pointColor);
    //             const pointSize:  {legend: Legend, value: number[]} = worker.util.createPatientSizeMap(data, config.pointSize);
    //             const pointShape: {legend: Legend, value: number[]} = worker.util.createPatientShapeMap(data, config.pointShape);
    //             legendItems.push(pointColor.legend, pointSize.legend, pointShape.legend);

    //             worker.postMessage({
    //                 config: config,
    //                 data: {
    //                     legendItems: legendItems,
    //                     result: response.result,
    //                     resultScaled: resultScaled,
    //                     pointColor: pointColor.value,
    //                     pointShape: pointShape.value,
    //                     pointSize: pointSize.value,
    //                     sampleIds: worker.util.createSampleMap(data),
    //                     markerIds: worker.util.createMarkerMap(data.molecularData[0]),
    //                     components: response.components,
    //                     explainedVariance: response.explainedVariance,
    //                     explainedVarianceRatio: response.explainedVarianceRatio,
    //                     singularValues: response.singularValues
    //                 }
    //             });
    //             worker.postMessage('TERMINATE');
    //         });
    // });
};
