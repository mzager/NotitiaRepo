import { LocalLinearEmbeddingConfigModel, LocalLinearEmbeddingDataModel } from './locallinearembedding.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const localLinearEmbeddingCompute = (config: LocalLinearEmbeddingConfigModel, worker: DedicatedWorkerGlobalScope): void => {

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
                            method: 'manifold_sk_local_linear_embedding',
                            data: mtx.data,
                            components: config.components,
                            dimension: config.dimension,
                            n_neighbors: config.n_neighbors,
                            eigen_solver: config.eigen_solver,
                            reg: config.reg,
                            random_state: config.random_state,
                            neighbors_algorithm: config.neighbors_algorithm,
                            LocalLinearEmbeddingMethod: config.LocalLinearEmbeddingMethod
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
