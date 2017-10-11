import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { FaConfigModel, FaDataModel } from './fa.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const faCompute = (config: FaConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSize(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix([], [], config.table.map, config.table.tbl, config.entity)
            .then(mtx => {
                Promise.all([
                    worker.util.getSamplePatientMap(),
                    worker.util
                        .fetchResult({
                            // added more than server is calling
                            method: 'cluster_sk_factor_analysis',
                            data: mtx.data,
                            components: config.components,
                            dimension: config.dimension,
                            max_iter: config.max_iter,
                            tol: config.tol,
                            iterated_power: config.iterated_power,
                            random_state: config.random_state,
                            fun: config.svd_method
                        })
                ]).then(result => {
                    const psMap = result[0].reduce((p, c) => { p[c.s] = c.p; return p; }, {});
                    const data = JSON.parse(result[1].body);
                    const resultScaled = worker.util.scale3d(data.result);
                    worker.postMessage({
                        config: config,
                        data: {
                            legendItems: [],
                            result: data,
                            resultScaled: resultScaled,
                            patientIds: mtx.samples.map(v => psMap[v]),
                            sampleIds: mtx.samples,
                            markerIds: mtx.markers
                        }
                    });
                    worker.postMessage('TERMINATE');
                });
            });
    }
};
