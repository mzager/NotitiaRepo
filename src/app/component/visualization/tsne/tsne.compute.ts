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
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
            .then(mtx => {
                Promise.all([
                    worker.util.getSamplePatientMap(config.database),
                    worker.util
                        .fetchResult({
                            method: 'manifold_sk_tsne',
                            data: mtx.data,
                            n_components: config.n_components,
                            dimension: config.dimension,
                            perplexity: config.perplexity,
                            early_exaggeration: config.early_exaggeration,
                            learning_rate: config.learning_rate,
                            n_iter: config.n_iter,
                            n_iter_without_progress: config.n_iter,
                            min_grad_norm: config.min_grad_norm,
                            metric: config.metric,
                            sk_method: config.sk_method
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
