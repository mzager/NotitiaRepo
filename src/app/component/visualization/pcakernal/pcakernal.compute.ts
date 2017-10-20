import { PcaKernalConfigModel } from './pcakernal.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const pcaKernalCompute = (config: PcaKernalConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix([], [], config.table.map, config.table.tbl, config.entity)
            .then(mtx => {
                Promise.all([
                    worker.util.getSamplePatientMap(),
                    worker.util
                        .fetchResult({
                            method: 'cluster_sk_pca_kernal',
                            n_components: config.n_components,
                            data: mtx.data,
                            kernal: config.kernel,
                            degree: config.degree,
                            coef0: config.coef0,
                            alpha: config.alpha,
                            fit_inverse_transform: config.fit_inverse_transform,
                            eigen_solver: config.eigen_solver,
                            tol: config.tol,
                            remove_zero_eig: config.remove_zero_eig
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
