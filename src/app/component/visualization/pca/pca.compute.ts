import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { LegendItem } from './../../../model/legend.model';
import { PcaConfigModel } from './pca.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;


export const pcaCompute = (config: PcaConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    //     worker.util.loadData(config.dataKey).then((data) => {

    //         const legendItems: Array<Legend> = [];
    //         const molecularData = data.molecularData[0];
    //         const matrix = worker.util.processMolecularData(molecularData, config);

    //         // Configure PCA
    //         const pca = new ML.Stat.PCA(matrix, {
    //             isCovarianceMatrix: false,
    //             center: config.isCentered,
    //             scale: config.isScaled
    //         });
    //         // Calculate Scores
    //         const scores = pca.predict(matrix);

    //         // Scale Data
    //         const vectorsScaled = worker.util.scale3d( pca.getEigenvectors() );
    //         const scoresScaled = worker.util.scale3d( scores );

    //         // Colors + Legend
    //         const pointColor: {legend: Legend, value: number[]} = worker.util.createPatientColorMap(data, config.pointColor);
    //         const pointSize:  {legend: Legend, value: number[]} = worker.util.createPatientSizeMap(data, config.pointSize);
    //         const pointShape: {legend: Legend, value: number[]} = worker.util.createPatientShapeMap(data, config.pointShape);
    //         legendItems.push(pointColor.legend, pointSize.legend, pointShape.legend);

    //         worker.postMessage({
    //             config: config,
    //             data: {
    //                 legendItems: legendItems,
    //                 eigenvectors: pca.getEigenvectors(),
    //                 eigenvectorsScaled: vectorsScaled,
    //                 eigenvalues: pca.getEigenvalues(),
    //                 loadings: pca.getLoadings(),
    //                 scores: scores,
    //                 scoresScaled: scoresScaled,
    //                 explainedVariance: pca.getExplainedVariance(),
    //                 cumulativeVariance: pca.getCumulativeVariance(),
    //                 standardDeviations: pca.getStandardDeviations(),
    //                 pointColor: pointColor.value,
    //                 pointShape: pointShape.value,
    //                 pointSize: pointSize.value,
    //                 sampleIds: worker.util.createSampleMap(data),
    //                 markerIds: worker.util.createMarkerMap(data.molecularData[0])
    //             }
    //         });
    //         worker.postMessage('TERMINATE');
    // });
};
