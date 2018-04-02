import { Legend } from './../../../model/legend.model';
import { EntityTypeEnum, DirtyEnum } from './../../../model/enum.model';
import { IsoMapConfigModel, IsoMapDataModel } from './isomap.model';
import { DedicatedWorkerGlobalScope } from 'compute';

export const isoMapCompute = (config: IsoMapConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    worker.util.getDataMatrix(config).then(matrix => {
        worker.util
            .fetchResult({
                // added more than server is calling
                method: 'manifold_sk_iso_map',
                data: matrix.data,
                n_components: config.n_components,
                dimension: config.dimension,
                tol: config.tol,
                n_neighbors: config.n_neighbors,
                eigen_solver: config.eigen_solver,
                path_method: config.path_method,
                neighbors_algorithm: config.neighbors_algorithm
            })
            .then(result => {
                result.resultScaled = worker.util.scale3d(result.result, config.pcx - 1, config.pcy - 1, config.pcz - 1);
                result.sid = matrix.sid;
                result.mid = matrix.mid;
                result.pid = matrix.pid;
                result.legends = [
                    Legend.create('Data Points',
                        config.entity === EntityTypeEnum.GENE ? ['Genes'] : ['Samples'],
                        ['circle'],
                        'SHAPE',
                        'DISCRETE'
                    )];
                worker.postMessage({
                    config: config,
                    data: result
                });
                worker.postMessage('TERMINATE');
            });
    });
};
