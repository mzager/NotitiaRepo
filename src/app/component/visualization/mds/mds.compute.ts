import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { MdsConfigModel, MdsDataModel } from './mds.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const mdsCompute = (config: MdsConfigModel, worker: DedicatedWorkerGlobalScope): void => {

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
    //                 method: 'manifold_sk_mds',
    //                 components: 3,
    //                 data: molecularData
    //             })
    //         })
    //         .then( v => v.json() )
    //         .then( v => {

    //             const response = JSON.parse(v.body);
    //             const vectorsScaled = worker.util.scale3d( response.result );
    //             const embeddingsScaled = worker.util.scale3d( response.embedding );

    //             // Colors + Legend
    //             const pointColor: {legend: Legend, value: number[]} = worker.util.createPatientColorMap(data, config.pointColor);
    //             const pointSize:  {legend: Legend, value: number[]} = worker.util.createPatientSizeMap(data, config.pointSize);
    //             const pointShape: {legend: Legend, value: number[]} = worker.util.createPatientShapeMap(data, config.pointShape);
    //             legendItems.push(pointColor.legend, pointSize.legend, pointShape.legend);

    //             worker.postMessage({
    //                 config: config,
    //                 data: {
    //                     legendItems: legendItems,
    //                     stress: response.stress,
    //                     result: response.result,
    //                     resultScaled: vectorsScaled,
    //                     embeddings: response.embedding,
    //                     embeddingsScaled: embeddingsScaled,
    //                     pointColor: pointColor.value,
    //                     pointShape: pointShape.value,
    //                     pointSize: pointSize.value,
    //                     sampleIds: worker.util.createSampleMap(data),
    //                     markerIds: worker.util.createMarkerMap(data.molecularData[0])
    //                 }
    //             });
    //             worker.postMessage('TERMINATE');
    //         });
    // });
};
