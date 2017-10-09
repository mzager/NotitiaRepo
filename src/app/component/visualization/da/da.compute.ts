import { DaConfigModel } from './da.model';
import * as util from 'app/service/compute.worker.util';
import * as _ from 'lodash';

// Internal Caches
const _config: DaConfigModel = null;
const _molecularData: any = null;
const _pca: any = null;
const _pointColor: Array<number> = [];
const _pointSize: Array<number> = [];
const _pointShape: Array<number> = [];

export const daCompute = (config: DaConfigModel): Promise<any> => {

    // return new Promise(function (resolve: any, reject: any) {

    //     util.loadData(config.dataKey).then((data) => {

    //         resolve({

    //         });

    //     }, (e) => reject() );
    // });
    return null;
};
