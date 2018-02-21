import { DirtyEnum } from 'app/model/enum.model';
import Dexie from 'dexie';
import { PcaIncrementalConfigModel } from './pcaincremental.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from 'app/model/legend.model';
import { DedicatedWorkerGlobalScope } from 'compute';
import * as _ from 'lodash';
declare var ML: any;

export const pcaIncrementalCompute = (config: PcaIncrementalConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
            .then(mtx => {
                Promise.all([
                    worker.util.getSamplePatientMap(config.database),
                    worker.util
                        .fetchResult({
                            method: 'cluster_sk_pca_incremental',
                            n_components: config.n_components,
                            data: mtx.data,
                            whiten: config.whiten,
                            batch_size: config.batch_size
                        })
                ]).then(result => {

                        const psMap = result[0].reduce( (p, c) => { p[c.s] = c.p; return p; }, {});
                        const data = result[1];
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
