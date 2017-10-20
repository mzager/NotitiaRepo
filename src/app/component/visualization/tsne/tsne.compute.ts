import { TsneConfigModel, TsneDataModel } from './tsne.model';
import { DimensionEnum, DirtyEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';
declare var ML: any;



export const tsneCompute = (config: TsneConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix([], [], config.table.map, config.table.tbl, config.entity)
            .then(mtx => {
                Promise.all([
                    worker.util.getSamplePatientMap(),
                    worker.util
                        .fetchResult({
                            // added more than server is calling
                            method: 'manifold_sk_tsne',
                            data: mtx.data,
                            components: config.components,
                            dimension: config.dimension,
                            eigen_solver: config.eigen_solver,
                            random_state: config.random_state,
                            n_neighbors: config.n_neighbors,
                            n_jobs: config.n_jobs,
                            gamma: config.gamma,
                            affinity: config.affinity
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
