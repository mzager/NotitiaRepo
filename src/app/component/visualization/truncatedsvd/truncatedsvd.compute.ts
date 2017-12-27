import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { TruncatedSvdConfigModel, TruncatedSvdDataModel } from './truncatedsvd.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
import * as data from 'app/action/data.action';
declare var ML: any;

export const truncatedSvdCompute = (config: TruncatedSvdConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);

        if (config.dirtyFlag & DirtyEnum.LAYOUT) {
            worker.util
                .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
                .then(mtx => {
                    Promise.all([
                        worker.util.getSamplePatientMap(config.database),
                        worker.util
                            .fetchResult({
                                // added more than server is calling
                                method: 'cluster_sk_truncated_svd',
                                n_components: config.n_components,
                                algorithm: config.algorithm,
                                tol: config.tol,
                                data: mtx.data,
                                n_iter: config.n_iter
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
