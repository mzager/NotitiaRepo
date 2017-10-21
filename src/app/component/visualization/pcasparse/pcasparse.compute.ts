import { PcaSparseConfigModel } from './pcasparse.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const pcaSparseCompute = (config: PcaSparseConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.table.tbl, config.entity)
            .then(mtx => {
                Promise.all([
                    worker.util.getSamplePatientMap(),
                    worker.util
                        .fetchResult({
                            method: 'cluster_sk_pca_sparse',
                            n_components: config.n_components,
                            data: mtx.data,
                            alpha: config.alpha,
                            ridge_alpha: config.ridge_alpha,
                            max_iter: config.max_iter,
                            tol: config.tol,
                            sk_method: config.sk_method
                        })
                ]).then(result => {
                        const psMap = result[0].reduce( (p, c) => { p[c.s] = c.p; return p; }, {});
                        const data = JSON.parse(result[1].body);
                        const resultScaled = worker.util.scale3d(data.result);
                        worker.postMessage({
                            config: config,
                            data: {
                                legendItems: [],
                                result: data,
                                resultScaled: resultScaled,
                                patientIds: mtx.samples.map ( v => psMap[v] ),
                                sampleIds: mtx.samples,
                                markerIds: mtx.markers
                            }
                        });
                        worker.postMessage('TERMINATE');
                    });
            });
        }
};
