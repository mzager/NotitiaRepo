import { SvdConfigModel } from './svd.model';
import { DimensionEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import * as util from 'app/service/compute.worker.util';
import * as _ from 'lodash';
declare var ML: any;

// Internal Caches
const _config: SvdConfigModel = null;
const _molecularData: any = null;
const _pca: any = null;
const _pointColor: Array<number> = [];
const _pointSize: Array<number> = [];
const _pointShape: Array<number> = [];

export const svdCompute = (config: SvdConfigModel): Promise<any> => {

    // return new Promise(function (resolve: any, reject: any) {
    //     util.loadData(config.dataKey).then((data) => {
    //         const legendItems: Array<Legend> = [];
    //         const molecularData = data.molecularData[0];
    //         let matrix = molecularData.data;
    //         if (config.markerFilter.length > 0) {
    //             const genesOfInterest = molecularData.markers
    //                 .map((v, i) => (config.markerFilter.indexOf(v) >= 0) ? { gene: v, i: i } : -1)
    //                 .filter(v => v !== -1);
    //             matrix = genesOfInterest.map(v => molecularData.data[v.i]);
    //         }
    //         const pointColor: { legend: Legend, value: number[] } = util.createPatientColorMap(data, config.pointColor);
    //         const pointSize: { legend: Legend, value: number[] } = util.createPatientSizeMap(data, config.pointSize);
    //         const pointShape: { legend: Legend, value: number[] } = util.createPatientShapeMap(data, config.pointShape);
    //         legendItems.push(pointColor.legend, pointSize.legend, pointShape.legend);
    //         resolve({
    //             config: config,
    //             data: {
    //                 legendItems: legendItems,
    //                 pointColor: pointColor.value,
    //                 pointShape: pointShape.value,
    //                 pointSize: pointSize.value,
    //                 sampleIds: util.createSampleMap(data),
    //                 markerIds: util.createMarkerMap(molecularData)
    //             }
    //         });
    //     }, (e) => reject());
    // });
    return null;
};
