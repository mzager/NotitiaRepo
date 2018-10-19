import { scatterCompute } from './app/component/visualization/scatter/scatter.compute';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { hazardCompute } from './app/component/visualization/hazard/hazard.compute';
import { histogramCompute } from './app/component/visualization/histogram/histogram.compute';
import { dendogramCompute } from './app/component/visualization/dendogram/dendogram.compute';
import { survivalCompute } from './app/component/visualization/survival/survival.compute';

import { timelinesCompute } from './app/component/visualization/timelines/timelines.compute';
import { hicCompute } from './app/component/visualization/hic/hic.compute';
import { parallelcoordsCompute } from './app/component/visualization/parallelcoords/parallelcoords.compute';
import { boxwhiskersCompute } from './app/component/visualization/boxwhiskers/boxwhiskers.compute';
import { genomeCompute } from './app/component/visualization/genome/genome.compute';
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
import { tsneCompute } from './app/component/visualization/tsne/tsne.compute';
import { umapCompute } from './app/component/visualization/umap/umap.compute';
import { pcaCompute } from './app/component/visualization/pca/pca.compute';
import { chromosomeCompute } from './app/component/visualization/chromosome/chromosome.compute';
import { ComputeWorkerUtil } from './app/service/compute.worker.util';
import { pathwaysCompute } from './app/component/visualization/pathways/pathways.compute';
import { miniBatchSparsePcaCompute } from './app/component/visualization/minibatchsparsepca/minibatchsparsepca.compute';
// tslint:disable-next-line:max-line-length
import { linearDiscriminantAnalysisCompute } from './app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.compute';
// tslint:disable-next-line:max-line-length
import { miniBatchDictionaryLearningCompute } from './app/component/visualization/minibatchdictionarylearning/minibatchdictionarylearning.compute';
// tslint:disable-next-line:max-line-length
import { quadradicDiscriminantAnalysisCompute } from './app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.compute';
import { CCACompute } from './app/component/visualization/cca/cca.compute';
import { PlsSvdCompute } from './app/component/visualization/pls-svd/pls-svd.compute';
import { PlsRegressionCompute } from './app/component/visualization/plsregression/plsregression.compute';
import { PlsCanonicalCompute } from './app/component/visualization/plscanonical/plscanonical.compute';
import { LinearSVCCompute } from './app/component/visualization/linearsvc/linearsvc.compute';
import { LinearSVRCompute } from './app/component/visualization/linearsvr/linearsvr.compute';
onmessage = e => {
  const me = self as DedicatedWorkerGlobalScope;
  if (!me.hasOwnProperty('util')) {
    console.log('Init Thread');
    // me.importScripts('ml220.js');
    me.util = new ComputeWorkerUtil();
  }

  switch (e.data.visualization) {
    case VisualizationEnum.EDGES:
      edgesCompute(e.data, me);
      break;
    case VisualizationEnum.DENDOGRAM:
      dendogramCompute(e.data, me);
      break;
    case VisualizationEnum.QUADRATIC_DISCRIMINANT_ANALYSIS:
      quadradicDiscriminantAnalysisCompute(e.data, me);
      break;
    case VisualizationEnum.LINEAR_DISCRIMINANT_ANALYSIS:
      linearDiscriminantAnalysisCompute(e.data, me);
      break;
    case VisualizationEnum.MINI_BATCH_DICTIONARY_LEARNING:
      miniBatchDictionaryLearningCompute(e.data, me);
      break;
    case VisualizationEnum.MINI_BATCH_SPARSE_PCA:
      miniBatchSparsePcaCompute(e.data, me);
      break;
    case VisualizationEnum.PCA:
      pcaCompute(e.data, me);
      break;
    case VisualizationEnum.PATHWAYS:
      pathwaysCompute(e.data, me);
      break;
    case VisualizationEnum.CHROMOSOME:
      chromosomeCompute(e.data, me);
      break;
    case VisualizationEnum.GENOME:
      genomeCompute(e.data, me);
      break;
    case VisualizationEnum.HAZARD:
      hazardCompute(e.data, me);
      break;
    case VisualizationEnum.SURVIVAL:
      survivalCompute(e.data, me);
      break;
    case VisualizationEnum.TSNE:
      tsneCompute(e.data, me);
      break;
    case VisualizationEnum.UMAP:
      umapCompute(e.data, me);
      break;
    case VisualizationEnum.SCATTER:
      scatterCompute(e.data, me);
      break;
    case VisualizationEnum.EDGES:
      edgesCompute(e.data, me);
      break;
    case VisualizationEnum.HEATMAP:
      heatmapCompute(e.data, me);
      break;
    case VisualizationEnum.BOX_WHISKERS:
      boxwhiskersCompute(e.data, me);
      break;
    case VisualizationEnum.TIMELINES:
      timelinesCompute(e.data, me);
      break;
    case VisualizationEnum.PARALLEL_COORDS:
      parallelcoordsCompute(e.data, me);
      break;
    case VisualizationEnum.LINKED_GENE:
      linkedgeneCompute(e.data, me);
      break;
    case VisualizationEnum.HIC:
      hicCompute(e.data, me);
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
    case VisualizationEnum.HISTOGRAM:
      histogramCompute(e.data, me);
      break;
    case VisualizationEnum.LINEAR_SVC:
      LinearSVCCompute(e.data, me);
      break;
    case VisualizationEnum.CCA:
      CCACompute(e.data, me);
      break;
    case VisualizationEnum.PLSCANONICAL:
      PlsCanonicalCompute(e.data, me);
      break;
    case VisualizationEnum.PLSREGRESSION:
      PlsRegressionCompute(e.data, me);
      break;
    case VisualizationEnum.PLSSVD:
      PlsSvdCompute(e.data, me);
      break;
    case VisualizationEnum.LINEAR_SVR:
      LinearSVRCompute(e.data, me);
      break;

  }
};
