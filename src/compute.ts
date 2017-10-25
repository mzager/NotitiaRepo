import { linkedgeneCompute } from './app/component/visualization/linkedgenes/linkedgenes.compute';
import { VisualizationEnum } from 'app/model/enum.model';
import { pcaSparseCompute } from './app/component/visualization/pcasparse/pcasparse.compute';
import { pcaKernalCompute } from './app/component/visualization/pcakernal/pcakernal.compute';
import { pcaIncrementalCompute } from './app/component/visualization/pcaincremental/pcaincremental.compute';
import { isoMapCompute } from './app/component/visualization/isomap/isomap.compute';
import { spectralEmbeddingCompute } from './app/component/visualization/spectralembedding/spectralembedding.compute';
import { localLinearEmbeddingCompute } from './app/component/visualization/locallinearembedding/locallinearembedding.compute';
import { dictionaryLearningCompute } from './app/component/visualization/dictionarylearning/dictionarylearning.compute';
import { fasticaCompute } from './app/component/visualization/fastica/fastica.compute';
import { truncatedSvdCompute } from './app/component/visualization/truncatedsvd/truncatedsvd.compute';
import { ldaCompute } from './app/component/visualization/lda/lda.compute';
import { nmfCompute } from './app/component/visualization/nmf/nmf.compute';

import { faCompute } from './app/component/visualization/fa/fa.compute';
import { mdsCompute } from './app/component/visualization/mds/mds.compute';
import { somCompute } from './app/component/visualization/som/som.compute';
import { heatmapCompute } from './app/component/visualization/heatmap/heatmap.compute';
import { edgesCompute } from './app/component/visualization/edges/edges.compute';
import { DedicatedWorkerGlobalScope } from './compute';
import { tsneCompute } from './app/component/visualization/tsne/tsne.compute';
import { pcaCompute } from './app/component/visualization/pca/pca.compute';
import { chromosomeCompute } from './app/component/visualization/chromosome/chromosome.compute';
import { ComputeWorkerUtil } from './app/service/compute.worker.util';
// import * as util from './app/service/compute.worker.util';
// Recompile:  npm run worker
export interface DedicatedWorkerGlobalScope extends Window {
    util: ComputeWorkerUtil;
    postMessage(data: any, transferList?: any): void;
    importScripts(src: string): void;
}

onmessage = function (e) {

    const me = self as DedicatedWorkerGlobalScope;
    if (!me.hasOwnProperty('util')) {
        console.log('Init Thread');
        me.importScripts('ml220.js');
        me.util = new ComputeWorkerUtil();
    }

    switch (e.data.visualization) {
        case VisualizationEnum.PCA:
            pcaCompute(e.data, me);
            break;
        case VisualizationEnum.CHROMOSOME:
            chromosomeCompute(e.data, me);
            break;
        case VisualizationEnum.TSNE:
            tsneCompute(e.data, me);
            break;
        case VisualizationEnum.EDGES:
            edgesCompute(e.data, me);
            break;
        case VisualizationEnum.HEATMAP:
            heatmapCompute(e.data, me);
            break;
        case VisualizationEnum.LINKED_GENE:
            linkedgeneCompute(e.data, me);
            break;
        case VisualizationEnum.MDS:
            mdsCompute(e.data, me);
            break;
        case VisualizationEnum.SOM:
            somCompute(e.data, me);
            break;
        case VisualizationEnum.FA:
            faCompute(e.data, me);
            break;
        case VisualizationEnum.DICTIONARY_LEARNING:
            dictionaryLearningCompute(e.data, me);
            break;
        case VisualizationEnum.FAST_ICA:
            fasticaCompute(e.data, me);
            break;
        case VisualizationEnum.TRUNCATED_SVD:
            truncatedSvdCompute(e.data, me);
            break;
        case VisualizationEnum.LDA:
            ldaCompute(e.data, me);
            break;
        case VisualizationEnum.NMF:
            nmfCompute(e.data, me);
            break;
        case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING:
            localLinearEmbeddingCompute(e.data, me);
            break;
        case VisualizationEnum.SPECTRAL_EMBEDDING:
            spectralEmbeddingCompute(e.data, me);
            break;
        case VisualizationEnum.ISOMAP:
            isoMapCompute(e.data, me);
            break;
        case VisualizationEnum.INCREMENTAL_PCA:
            pcaIncrementalCompute(e.data, me);
            break;
        case VisualizationEnum.KERNAL_PCA:
            pcaKernalCompute(e.data, me);
            break;
        case VisualizationEnum.SPARSE_PCA:
            pcaSparseCompute(e.data, me);
            break;
    }
};
