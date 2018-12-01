import { ScatterConfigModel, ScatterDataModel } from './../component/visualization/scatter/scatter.model';
import { UmapDataModel } from './../component/visualization/umap/umap.model';
import { Action } from '@ngrx/store';
import {
  LinearDiscriminantAnalysisConfigModel,
  LinearDiscriminantAnalysisDataModel
} from 'app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.model';
import {
  MiniBatchDictionaryLearningConfigModel,
  MiniBatchDictionaryLearningDataModel
} from 'app/component/visualization/minibatchdictionarylearning/minibatchdictionarylearning.model';
import {
  MiniBatchSparsePcaConfigModel,
  MiniBatchSparsePcaDataModel
} from 'app/component/visualization/minibatchsparsepca/minibatchsparsepca.model';
import {
  QuadradicDiscriminantAnalysisConfigModel,
  QuadradicDiscriminantAnalysisDataModel
} from 'app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.model';
import {
  DictionaryLearningConfigModel,
  DictionaryLearningDataModel
} from './../component/visualization/dictionarylearning/dictionarylearning.model';
import {
  LocalLinearEmbeddingConfigModel,
  LocalLinearEmbeddingDataModel
} from './../component/visualization/locallinearembedding/locallinearembedding.model';
import {
  SpectralEmbeddingConfigModel,
  SpectralEmbeddingDataModel
} from './../component/visualization/spectralembedding/spectralembedding.model';
import { GraphEnum } from 'app/model/enum.model';
import { GraphConfig } from 'app/model/graph-config.model';
import {
  BoxWhiskersConfigModel,
  BoxWhiskersDataModel
} from './../component/visualization/boxwhiskers/boxwhiskers.model';
import { ChromosomeConfigModel, ChromosomeDataModel } from './../component/visualization/chromosome/chromosome.model';
import { DaConfigModel, DaDataModel } from './../component/visualization/da/da.model';
import { DeConfigModel, DeDataModel } from './../component/visualization/de/de.model';
import { DendogramConfigModel, DendogramDataModel } from './../component/visualization/dendogram/dendogram.model';
import { EdgeConfigModel, EdgeDataModel } from './../component/visualization/edges/edges.model';
import { FaConfigModel, FaDataModel } from './../component/visualization/fa/fa.model';
import { FastIcaConfigModel, FastIcaDataModel } from './../component/visualization/fastica/fastica.model';
import { GenomeConfigModel, GenomeDataModel } from './../component/visualization/genome/genome.model';
import { HazardConfigModel, HazardDataModel } from './../component/visualization/hazard/hazard.model';
import { HeatmapConfigModel, HeatmapDataModel } from './../component/visualization/heatmap/heatmap.model';
import { HicConfigModel, HicDataModel } from './../component/visualization/hic/hic.model';
import { HistogramConfigModel, HistogramDataModel } from './../component/visualization/histogram/histogram.model';
import { IsoMapConfigModel, IsoMapDataModel } from './../component/visualization/isomap/isomap.model';
import { LdaConfigModel, LdaDataModel } from './../component/visualization/lda/lda.model';
import { LinkedGeneConfigModel } from './../component/visualization/linkedgenes/linkedgenes.model';
import { MdsConfigModel, MdsDataModel } from './../component/visualization/mds/mds.model';
import { NmfConfigModel, NmfDataModel } from './../component/visualization/nmf/nmf.model';
import {
  ParallelCoordsConfigModel,
  ParallelCoordsDataModel
} from './../component/visualization/parallelcoords/parallelcoords.model';
import { PathwaysConfigModel, PathwaysDataModel } from './../component/visualization/pathways/pathways.model';
import { PcaConfigModel, PcaDataModel } from './../component/visualization/pca/pca.model';
import {
  PcaIncrementalConfigModel,
  PcaIncrementalDataModel
} from './../component/visualization/pcaincremental/pcaincremental.model';
import { PcaKernalConfigModel, PcaKernalDataModel } from './../component/visualization/pcakernal/pcakernal.model';
import { PcaSparseConfigModel, PcaSparseDataModel } from './../component/visualization/pcasparse/pcasparse.model';
import { PlsConfigModel, PlsDataModel } from './../component/visualization/pls/pls.model';
import { SomConfigModel, SomDataModel } from './../component/visualization/som/som.model';
import { SurvivalConfigModel, SurvivalDataModel } from './../component/visualization/survival/survival.model';
import { TimelinesConfigModel, TimelinesDataModel } from './../component/visualization/timelines/timelines.model';
import {
  TruncatedSvdConfigModel,
  TruncatedSvdDataModel
} from './../component/visualization/truncatedsvd/truncatedsvd.model';
import { TsneConfigModel, TsneDataModel } from './../component/visualization/tsne/tsne.model';
import { PlsSvdConfigModel, PlsSvdDataModel } from './../component/visualization/pls-svd/pls-svd.model';
import {
  PlsRegressionConfigModel,
  PlsRegressionDataModel
} from './../component/visualization/plsregression/plsregression.model';
import {
  PlsCanonicalConfigModel,
  PlsCanonicalDataModel
} from './../component/visualization/plscanonical/plscanonical.model';
import { CCAConfigModel, CCADataModel } from './../component/visualization/cca/cca.model';
import { LinearSVCConfigModel, LinearSVCDataModel } from './../component/visualization/linearsvc/linearsvc.model';
import { LinearSVRConfigModel, LinearSVRDataModel } from './../component/visualization/linearsvr/linearsvr.model';
import { NuSVRConfigModel, NuSVRDataModel } from './../component/visualization/nusvr/nusvr.model';
import { NuSVCConfigModel, NuSVCDataModel } from './../component/visualization/nusvc/nusvc.model';
import {
  OneClassSVMConfigModel,
  OneClassSVMDataModel
} from './../component/visualization/oneclasssvm/oneclasssvm.model';
import { SVRConfigModel, SVRDataModel } from './../component/visualization/svr/svr.model';
import { ChartSelection } from './../model/chart-selection.model';
import { GraphData } from './../model/graph-data.model';
import { UmapConfigModel } from '../component/visualization/umap/umap.model';
import { ProteinConfigModel, ProteinDataModel } from 'app/component/visualization/protein/protein.model';

// Action Constants
export const COMPUTE_EDGES = '[Compute] Edges';
export const COMPUTE_EDGES_COMPLETE = '[Compute] Edges Complete';
export const COMPUTE_LOAD_DATA = '[Compute] Load Data';
export const COMPUTE_LOAD_DATA_COMPLETE = '[Compute] Load Data Complete';
export const COMPUTE_CHROMOSOME = '[Compute] Chromosome';
export const COMPUTE_CHROMOSOME_COMPLETE = '[Compute] Chromosome Complete';
export const COMPUTE_GENOME = '[Compute] Genome';
export const COMPUTE_GENOME_COMPLETE = '[Compute] Chromosome Genome Complete';
export const COMPUTE_LINKED_GENE = '[Compute] Linked Gene';
export const COMPUTE_LINKED_GENE_COMPLETE = '[Compute] Linked Gene Complete';
export const COMPUTE_HIC = '[Compute] HiC';
export const COMPUTE_HIC_COMPLETE = '[Compute] HiC Complete';
export const COMPUTE_NONE = '[Compute] None';
export const COMPUTE_NONE_COMPLETE = '[Compute] None Complete';
export const COMPUTE_PROTEIN = '[Compute Protein]';
export const COMPUTE_PROTEIN_COMPLETE = '[Compute Protein Complete]';
export const COMPUTE_PCA = '[Compute] Pca';
export const COMPUTE_PCA_COMPLETE = '[Compute] Pca Complete';
export const COMPUTE_PCA_SPARSE = '[Compute] Pca Sparse';
export const COMPUTE_PCA_SPARSE_COMPLETE = '[Compute] Pca Sparse Complete';
export const COMPUTE_PCA_KERNAL = '[Compute] Pca Kernal';
export const COMPUTE_PCA_KERNAL_COMPLETE = '[Compute] Pca Kernal Complete';
export const COMPUTE_PCA_INCREMENTAL = '[Compute] Pca Incremental';
export const COMPUTE_PCA_INCREMENTAL_COMPLETE = '[Compute] Pca Incremental Complete';
export const COMPUTE_SPECTRAL_EMBEDDING = '[Compute] Spectral Embedding';
export const COMPUTE_SPECTRAL_EMBEDDING_COMPLETE = '[Compute] Spectral Embedding Complete';
export const COMPUTE_LOCAL_LINEAR_EMBEDDING = '[Compute] Local Linear Embedding';
export const COMPUTE_LOCAL_LINEAR_EMBEDDING_COMPLETE = '[Compute] Local Linear Embedding Complete';
export const COMPUTE_ISO_MAP = '[Compute] Iso Map';
export const COMPUTE_ISO_MAP_COMPLETE = '[Compute] Iso Map Complete';
export const COMPUTE_FA = '[Compute] Fa';
export const COMPUTE_FA_COMPLETE = '[Compute] Fa Complete';
export const COMPUTE_FAST_ICA = '[Compute] Fast Ica';
export const COMPUTE_FAST_ICA_COMPLETE = '[Compute] Fast Ica Complete';
export const COMPUTE_DICTIONARY_LEARNING = '[Compute] Dictionary Learning';
export const COMPUTE_DICTIONARY_LEARNING_COMPLETE = '[Compute] Dictionary Learning Complete';
export const COMPUTE_DA = '[Compute] Da';
export const COMPUTE_DA_COMPLETE = '[Compute] Da Complete';
export const COMPUTE_DE = '[Compute] De';
export const COMPUTE_DE_COMPLETE = '[Compute] De Complete';
export const COMPUTE_SURVIVAL = '[Compute] Survival';
export const COMPUTE_SURVIVAL_COMPLETE = '[Compute] Survival Complete';
export const COMPUTE_HAZARD = '[Compute] Hazard';
export const COMPUTE_HAZARD_COMPLETE = '[Compute] Hazard Complete';
export const COMPUTE_DENDOGRAM = '[Compute] Dendogram';
export const COMPUTE_DENDOGRAM_COMPLETE = '[Compute] Dendogram Complete';
export const COMPUTE_HEATMAP = '[Compute] Heatmap';
export const COMPUTE_HEATMAP_COMPLETE = '[Compute] Heatmap Complete';
export const COMPUTE_HISTOGRAM = '[Compute] Histogram';
export const COMPUTE_HISTOGRAM_COMPLETE = '[Compute] Histogram Complete';
export const COMPUTE_PARALLEL_COORDS = '[Compute] Parallel Coords';
export const COMPUTE_PARALLEL_COORDS_COMPLETE = '[Compute] Parallel Coords Complete';
export const COMPUTE_BOX_WHISKERS = '[Compute] Box Whiskers';
export const COMPUTE_BOX_WHISKERS_COMPLETE = '[Compute] Box Whiskers Complete';
export const COMPUTE_TIMELINES = '[Compute] Timelines';
export const COMPUTE_TIMELINES_COMPLETE = '[Compute] Timelines Complete';
export const COMPUTE_NMF = '[Compute] NMF';
export const COMPUTE_NMF_COMPLETE = '[Compute] NMF Complete';
export const COMPUTE_TRUNCATED_SVD = '[Compute] Truncated SVD';
export const COMPUTE_TRUNCATED_SVD_COMPLETE = '[Compute] Truncated SVD Complete';
export const COMPUTE_PATHWAYS = '[Compute] Pathways';
export const COMPUTE_PATHWAYS_COMPLETE = '[Compute] Pathways Complete';
export const COMPUTE_TSNE = '[Compute] Tsne';
export const COMPUTE_TSNE_COMPLETE = '[Compute] Tsne Complete';
export const COMPUTE_UMAP = '[Compute] Umap';
export const COMPUTE_UMAP_COMPLETE = '[Compute] Umap Complete';
export const COMPUTE_SCATTER = '[Compute] Scatter';
export const COMPUTE_SCATTER_COMPLETE = '[Compute] Scatter Complete';
export const COMPUTE_PLSR = '[Compute] Plsr';
export const COMPUTE_PLSR_COMPLETE = '[Compute] Plsr Complete';
export const COMPUTE_SVM = '[Compute] SVM';
export const COMPUTE_SVM_COMPLETE = '[Compute] SVM Complete';
export const COMPUTE_SOM = '[Compute] SOM';
export const COMPUTE_SOM_COMPLETE = '[Compute] SOM Complete';
export const COMPUTE_MEAN = '[Compute] Mean';
export const COMPUTE_MEAN_COMPLETE = '[Compute] Meam Complete';
export const COMPUTE_MDS = '[Compute] MDS';
export const COMPUTE_MDS_COMPLETE = '[Compute] MDS Complete';
export const COMPUTE_MINI_BATCH_SPARSE_PCA = '[Compute] Mini Batch Sparse PCA';
export const COMPUTE_MINI_BATCH_SPARSE_PCA_COMPLETE = '[Compute] Mini Batch Sparse PCA Complete';
export const COMPUTE_MINI_BATCH_DICTIONARY_LEARNING = '[Compute] Mini Batch Dictionary Learning';
export const COMPUTE_MINI_BATCH_DICTIONARY_LEARNING_COMPLETE = '[Compute] Mini Batch Dictionary Learning Complete';
export const COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS = '[Compute] Quadratic Discriminant Analysis';
export const COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS_COMPLETE = '[Compute] Quadratic Discriminant Analysis Complete';
export const COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS = '[Compute] Linear Discriminant Analysis';
export const COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS_COMPLETE = '[Compute] Linear Discriminant Analysis Complete';
export const COMPUTE_LDA = '[Compute] LDA';
export const COMPUTE_LDA_COMPLETE = '[Compute] LDA Complete';
export const COMPUTE_PLS_SVD = '[Compute] PlsSvd';
export const COMPUTE_PLS_SVD_COMPLETE = '[Compute] PlsSvd Complete';
export const COMPUTE_PLS_REGRESSION = '[Compute] PlsRegression';
export const COMPUTE_PLS_REGRESSION_COMPLETE = '[Compute] PlsRegression Complete';
export const COMPUTE_PLS_CANONICAL = '[Compute] PlsCanonical';
export const COMPUTE_PLS_CANONICAL_COMPLETE = '[Compute] PlsCanonical Complete';
export const COMPUTE_CCA = '[Compute] CCA';
export const COMPUTE_CCA_COMPLETE = '[Compute] CCA Complete';
export const COMPUTE_LINEAR_SVC = '[Compute] Linear SVC';
export const COMPUTE_LINEAR_SVC_COMPLETE = '[Compute] Linear SVC Complete';
export const COMPUTE_LINEAR_SVR = '[Compute] Linear SVR';
export const COMPUTE_LINEAR_SVR_COMPLETE = '[Compute] Linear SVR Complete';
export const COMPUTE_NU_SVC = '[Compute] Nu SVC';
export const COMPUTE_NU_SVC_COMPLETE = '[Compute] Nu SVC Complete';
export const COMPUTE_NU_SVR = '[Compute] Nu SVR';
export const COMPUTE_NU_SVR_COMPLETE = '[Compute] Nu SVR Complete';
export const COMPUTE_ONE_CLASS_SVM = '[Compute] One Class SVM';
export const COMPUTE_ONE_CLASS_SVM_COMPLETE = '[Compute] One Class SVM Complete';
export const COMPUTE_SVR = '[Compute]  SVR';
export const COMPUTE_SVR_COMPLETE = '[Compute]  SVR Complete';
export const COMPUTE_POPULATION_SUMMARY = '[Compute] Population Summary';
export const COMPUTE_POPULATION_SUMMARY_COMPLETE = '[Compute] Population Summary Complete';
export const COMPUTE_SAMPLE_SUMMARY = '[Compute] Sample Summary';
export const COMPUTE_SAMPLE_SUMMARY_COMPLETE = '[Compute] Sample Summary Complete';
export const COMPUTE_GRAPH_COLOR = '[Compute] Graph Color';
export const COMPUTE_GRAPH_COLOR_COMPLETE = '[Compute] Graph Color Complete';
export const COMPUTE_GRAPH_SIZE = '[Compute] Graph Size';
export const COMPUTE_GRAPH_SIZE_COMPLETE = '[Compute] Graph Size Complete';
export const COMPUTE_GRAPH_SHAPE = '[Compute] Graph Shape';
export const COMPUTE_GRAPH_SHAPE_COMPLETE = '[Compute] Graph Shape Complete';
export const COMPUTE_DECORATOR_ADD = '[Compute] Decorator Add';
export const COMPUTE_DECORATOR_DEL = '[Compute] Decorator Del';
export const COMPUTE_DECORATOR_UPDATE = '[Compute] Decorator Update';
export const COMPUTE_SELECT_SAMPLES = '[Compute] Select Samples';
export const COMPUTE_SELECT_SAMPLES_COMPLETE = '[Compute] Select Samples Complete';
export const COMPUTE_SELECT_MARKERS = '[Compute] Select Markers';
export const COMPUTE_SELECT_MARKERS_COMPLETE = '[Compute] Select Markers Complete';
export const COMPUTE_SELECT_HIDE = '[Compute] Select Hide';
export const COMPUTE_SELECT_SAMPLES_SAVE = '[Compute] Select Samples Save';
export const COMPUTE_SELECT_MARKERS_SAVE = '[Compute] Select Markers Save';

export class NullDataAction implements Action {
  readonly type = 'NULL';
  constructor() {}
}

// Action Classes
export class LoadDataAction implements Action {
  readonly type: string = COMPUTE_LOAD_DATA;
  constructor(public payload: { graph: GraphEnum; pouchId: string }) {}
}
export class LoadDataActionComplete implements Action {
  readonly type: string = COMPUTE_LOAD_DATA_COMPLETE;
  constructor(public payload: { success: boolean }) {}
}
export class EdgesAction implements Action {
  readonly type: string = COMPUTE_EDGES;
  constructor(public payload: { config: EdgeConfigModel }) {}
}
export class EdgesCompleteAction implements Action {
  readonly type: string = COMPUTE_EDGES_COMPLETE;
  constructor(public payload: { config: EdgeConfigModel; data: EdgeDataModel }) {}
}
// export class DecoratorAddAction implements Action {
//     readonly type: string = COMPUTE_DECORATOR_ADD;
//     constructor(public payload: { decorator: DataDecorator, decorators: Array<DataDecorator> }) { }
// }
// export class DecoratorDelAction implements Action {
//     readonly type: string = COMPUTE_DECORATOR_DEL;
//     constructor(public payload: { decorator: DataDecorator, decorators: Array<DataDecorator> }) { }
// }
// export class DecoratorUpdateAction implements Action {
//     readonly type: string = COMPUTE_DECORATOR_UPDATE;
//     constructor(public payload: { config: GraphConfig, decorators: Array<DataDecorator> }) { }
// }

export class NoneAction implements Action {
  readonly type: string = COMPUTE_NONE;
  constructor(public payload: { config: GraphConfig }) {}
}
export class NoneCompleteAction implements Action {
  readonly type: string = COMPUTE_NONE_COMPLETE;
  constructor(public payload: { config: GraphConfig; data: GraphData }) {}
}
export class DictionaryLearningAction implements Action {
  readonly type: string = COMPUTE_DICTIONARY_LEARNING;
  constructor(public payload: { config: DictionaryLearningConfigModel }) {}
}
export class DictionaryLearningCompleteAction implements Action {
  readonly type: string = COMPUTE_DICTIONARY_LEARNING_COMPLETE;
  constructor(
    public payload: {
      config: DictionaryLearningConfigModel;
      data: DictionaryLearningDataModel;
    }
  ) {}
}
export class ProteinAction implements Action {
  readonly type: string = COMPUTE_PROTEIN;
  constructor(public payload: { config: ProteinConfigModel }) {}
}
export class ProteinCompleteAction implements Action {
  readonly type: string = COMPUTE_PROTEIN_COMPLETE;
  constructor(public payload: { config: ProteinConfigModel; data: ProteinDataModel }) {}
}
export class FastIcaAction implements Action {
  readonly type: string = COMPUTE_FAST_ICA;
  constructor(public payload: { config: FastIcaConfigModel }) {}
}
export class FastIcaCompleteAction implements Action {
  readonly type: string = COMPUTE_FAST_ICA_COMPLETE;
  constructor(public payload: { config: FastIcaConfigModel; data: FastIcaDataModel }) {}
}
export class LdaAction implements Action {
  readonly type: string = COMPUTE_LDA;
  constructor(public payload: { config: LdaConfigModel }) {}
}
export class LdaCompleteAction implements Action {
  readonly type: string = COMPUTE_LDA_COMPLETE;
  constructor(public payload: { config: LdaConfigModel; data: LdaDataModel }) {}
}
export class NmfAction implements Action {
  readonly type: string = COMPUTE_NMF;
  constructor(public payload: { config: NmfConfigModel }) {}
}
export class NmfCompleteAction implements Action {
  readonly type: string = COMPUTE_NMF_COMPLETE;
  constructor(public payload: { config: NmfConfigModel; data: NmfDataModel }) {}
}
export class TruncatedSvdAction implements Action {
  readonly type: string = COMPUTE_TRUNCATED_SVD;
  constructor(public payload: { config: TruncatedSvdConfigModel }) {}
}
export class TruncatedSvdCompleteAction implements Action {
  readonly type: string = COMPUTE_TRUNCATED_SVD_COMPLETE;
  constructor(
    public payload: {
      config: TruncatedSvdConfigModel;
      data: TruncatedSvdDataModel;
    }
  ) {}
}
export class FaAction implements Action {
  readonly type: string = COMPUTE_FA;
  constructor(public payload: { config: FaConfigModel }) {}
}
export class FaCompleteAction implements Action {
  readonly type: string = COMPUTE_FA_COMPLETE;
  constructor(public payload: { config: FaConfigModel; data: FaDataModel }) {}
}
export class DaAction implements Action {
  readonly type: string = COMPUTE_DA;
  constructor(public payload: { config: DaConfigModel }) {}
}
export class DaCompleteAction implements Action {
  readonly type: string = COMPUTE_DA_COMPLETE;
  constructor(public payload: { config: DaConfigModel; data: DaDataModel }) {}
}
export class DeAction implements Action {
  readonly type: string = COMPUTE_DE;
  constructor(public payload: { config: DeConfigModel }) {}
}
export class DeCompleteAction implements Action {
  readonly type: string = COMPUTE_DE_COMPLETE;
  constructor(public payload: { config: DeConfigModel; data: DeDataModel }) {}
}
export class PcaAction implements Action {
  readonly type: string = COMPUTE_PCA;
  constructor(public payload: { config: PcaConfigModel }) {}
}
export class PcaCompleteAction implements Action {
  readonly type: string = COMPUTE_PCA_COMPLETE;
  constructor(public payload: { config: PcaConfigModel; data: PcaDataModel }) {}
}
export class PcaIncrementalAction implements Action {
  readonly type: string = COMPUTE_PCA_INCREMENTAL;
  constructor(public payload: { config: PcaIncrementalConfigModel }) {}
}
export class PcaIncrementalCompleteAction implements Action {
  readonly type: string = COMPUTE_PCA_INCREMENTAL_COMPLETE;
  constructor(
    public payload: {
      config: PcaIncrementalConfigModel;
      data: PcaIncrementalDataModel;
    }
  ) {}
}
export class PcaKernalAction implements Action {
  readonly type: string = COMPUTE_PCA_KERNAL;
  constructor(public payload: { config: PcaKernalConfigModel }) {}
}
export class PcaKernalCompleteAction implements Action {
  readonly type: string = COMPUTE_PCA_KERNAL_COMPLETE;
  constructor(public payload: { config: PcaKernalConfigModel; data: PcaKernalDataModel }) {}
}
export class PcaSparseAction implements Action {
  readonly type: string = COMPUTE_PCA_SPARSE;
  constructor(public payload: { config: PcaSparseConfigModel }) {}
}
export class PcaSparseCompleteAction implements Action {
  readonly type: string = COMPUTE_PCA_SPARSE_COMPLETE;
  constructor(public payload: { config: PcaSparseConfigModel; data: PcaSparseDataModel }) {}
}
export class IsoMapAction implements Action {
  readonly type: string = COMPUTE_ISO_MAP;
  constructor(public payload: { config: IsoMapConfigModel }) {}
}
export class IsoMapCompleteAction implements Action {
  readonly type: string = COMPUTE_ISO_MAP_COMPLETE;
  constructor(public payload: { config: IsoMapConfigModel; data: IsoMapDataModel }) {}
}
export class LocalLinearEmbeddingAction implements Action {
  readonly type: string = COMPUTE_LOCAL_LINEAR_EMBEDDING;
  constructor(public payload: { config: LocalLinearEmbeddingConfigModel }) {}
}
export class LocalLinearEmbeddingCompleteAction implements Action {
  readonly type: string = COMPUTE_LOCAL_LINEAR_EMBEDDING_COMPLETE;
  constructor(
    public payload: {
      config: LocalLinearEmbeddingConfigModel;
      data: LocalLinearEmbeddingDataModel;
    }
  ) {}
}
export class SpectralEmbeddingAction implements Action {
  readonly type: string = COMPUTE_SPECTRAL_EMBEDDING;
  constructor(public payload: { config: SpectralEmbeddingConfigModel }) {}
}
export class SpectralEmbeddingCompleteAction implements Action {
  readonly type: string = COMPUTE_SPECTRAL_EMBEDDING_COMPLETE;
  constructor(
    public payload: {
      config: SpectralEmbeddingConfigModel;
      data: SpectralEmbeddingDataModel;
    }
  ) {}
}
export class TsneAction implements Action {
  readonly type: string = COMPUTE_TSNE;
  constructor(public payload: { config: TsneConfigModel }) {}
}
export class TsneCompleteAction implements Action {
  readonly type: string = COMPUTE_TSNE_COMPLETE;
  constructor(public payload: { config: TsneConfigModel; data: TsneDataModel }) {}
}
export class UmapAction implements Action {
  readonly type: string = COMPUTE_UMAP;
  constructor(public payload: { config: UmapConfigModel }) {}
}
export class UmapCompleteAction implements Action {
  readonly type: string = COMPUTE_UMAP_COMPLETE;
  constructor(public payload: { config: UmapConfigModel; data: UmapDataModel }) {}
}
export class ScatterAction implements Action {
  readonly type: string = COMPUTE_SCATTER;
  constructor(public payload: { config: ScatterConfigModel }) {}
}
export class ScatterCompleteAction implements Action {
  readonly type: string = COMPUTE_SCATTER_COMPLETE;
  constructor(public payload: { config: ScatterConfigModel; data: ScatterDataModel }) {}
}
export class PlsAction implements Action {
  readonly type: string = COMPUTE_PLSR;
  constructor(public payload: { config: PlsConfigModel }) {}
}
export class PlsCompleteAction implements Action {
  readonly type: string = COMPUTE_PLSR_COMPLETE;
  constructor(public payload: { config: PlsConfigModel; data: PlsDataModel }) {}
}
export class ChromosomeAction implements Action {
  readonly type: string = COMPUTE_CHROMOSOME;
  constructor(public payload: { config: ChromosomeConfigModel }) {}
}
export class ChromosomeCompleteAction implements Action {
  readonly type: string = COMPUTE_CHROMOSOME_COMPLETE;
  constructor(public payload: { config: ChromosomeConfigModel; data: ChromosomeDataModel }) {}
}
export class GenomeAction implements Action {
  readonly type: string = COMPUTE_GENOME;
  constructor(public payload: { config: GenomeConfigModel }) {}
}
export class GenomeCompleteAction implements Action {
  readonly type: string = COMPUTE_GENOME_COMPLETE;
  constructor(public payload: { config: GenomeConfigModel; data: GenomeDataModel }) {}
}
export class LinkedGeneAction implements Action {
  readonly type: string = COMPUTE_LINKED_GENE;
  constructor(public payload: { config: LinkedGeneConfigModel }) {}
}
export class LinkedGeneCompleteAction implements Action {
  readonly type: string = COMPUTE_LINKED_GENE_COMPLETE;
  constructor(public payload: { config: GenomeConfigModel; data: GenomeDataModel }) {}
}
export class HicAction implements Action {
  readonly type: string = COMPUTE_HIC;
  constructor(public payload: { config: HicConfigModel }) {}
}
export class HicCompleteAction implements Action {
  readonly type: string = COMPUTE_HIC_COMPLETE;
  constructor(public payload: { config: HicConfigModel; data: HicDataModel }) {}
}
export class SurvivalAction implements Action {
  readonly type: string = COMPUTE_SURVIVAL;
  constructor(public payload: { config: SurvivalConfigModel }) {}
}
export class SurvivalCompleteAction implements Action {
  readonly type: string = COMPUTE_SURVIVAL_COMPLETE;
  constructor(public payload: { config: SurvivalConfigModel; data: SurvivalDataModel }) {}
}
export class HazardAction implements Action {
  readonly type: string = COMPUTE_HAZARD;
  constructor(public payload: { config: HazardConfigModel }) {}
}
export class HazardCompleteAction implements Action {
  readonly type: string = COMPUTE_HAZARD_COMPLETE;
  constructor(public payload: { config: HazardConfigModel; data: HazardDataModel }) {}
}
export class DendogramAction implements Action {
  readonly type: string = COMPUTE_DENDOGRAM;
  constructor(public payload: { config: DendogramConfigModel }) {}
}
export class DendogramCompleteAction implements Action {
  readonly type: string = COMPUTE_DENDOGRAM_COMPLETE;
  constructor(public payload: { config: DendogramConfigModel; data: DendogramDataModel }) {}
}
export class HeatmapAction implements Action {
  readonly type: string = COMPUTE_HEATMAP;
  constructor(public payload: { config: HeatmapConfigModel }) {}
}
export class HeatmapCompleteAction implements Action {
  readonly type: string = COMPUTE_HEATMAP_COMPLETE;
  constructor(public payload: { config: HeatmapConfigModel; data: HeatmapDataModel }) {}
}
export class ParallelCoordsAction implements Action {
  readonly type: string = COMPUTE_PARALLEL_COORDS;
  constructor(public payload: { config: ParallelCoordsConfigModel }) {}
}
export class ParallelCoordsCompleteAction implements Action {
  readonly type: string = COMPUTE_PARALLEL_COORDS_COMPLETE;
  constructor(
    public payload: {
      config: ParallelCoordsConfigModel;
      data: ParallelCoordsDataModel;
    }
  ) {}
}
export class BoxWhiskersAction implements Action {
  readonly type: string = COMPUTE_BOX_WHISKERS;
  constructor(public payload: { config: BoxWhiskersConfigModel }) {}
}
export class BoxWhiskersCompleteAction implements Action {
  readonly type: string = COMPUTE_BOX_WHISKERS_COMPLETE;
  constructor(
    public payload: {
      config: BoxWhiskersConfigModel;
      data: BoxWhiskersDataModel;
    }
  ) {}
}
export class HistogramAction implements Action {
  readonly type: string = COMPUTE_HISTOGRAM;
  constructor(public payload: { config: HistogramConfigModel }) {}
}
export class HistogramCompleteAction implements Action {
  readonly type: string = COMPUTE_HISTOGRAM_COMPLETE;
  constructor(public payload: { config: HistogramConfigModel; data: HistogramDataModel }) {}
}
export class TimelinesAction implements Action {
  readonly type: string = COMPUTE_TIMELINES;
  constructor(public payload: { config: TimelinesConfigModel }) {}
}
export class TimelinesCompleteAction implements Action {
  readonly type: string = COMPUTE_TIMELINES_COMPLETE;
  constructor(public payload: { config: TimelinesConfigModel; data: TimelinesDataModel }) {}
}
export class PathwaysAction implements Action {
  readonly type: string = COMPUTE_PATHWAYS;
  constructor(public payload: { config: PathwaysConfigModel }) {}
}
export class PathwaysCompleteAction implements Action {
  readonly type: string = COMPUTE_PATHWAYS_COMPLETE;
  constructor(public payload: { config: PathwaysConfigModel; data: PathwaysDataModel }) {}
}
export class LinearDiscriminantAnalysisAction implements Action {
  readonly type: string = COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS;
  constructor(public payload: { config: LinearDiscriminantAnalysisConfigModel }) {}
}
export class LinearDiscriminantAnalysisCompleteAction implements Action {
  readonly type: string = COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS_COMPLETE;
  constructor(
    public payload: {
      config: LinearDiscriminantAnalysisConfigModel;
      data: LinearDiscriminantAnalysisDataModel;
    }
  ) {}
}
export class QuadraticDiscriminantAnalysisAction implements Action {
  readonly type: string = COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS;
  constructor(public payload: { config: QuadradicDiscriminantAnalysisConfigModel }) {}
}
export class QuadraticDiscriminantAnalysisCompleteAction implements Action {
  readonly type: string = COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS_COMPLETE;
  constructor(
    public payload: {
      config: QuadradicDiscriminantAnalysisConfigModel;
      data: QuadradicDiscriminantAnalysisDataModel;
    }
  ) {}
}
export class MiniBatchDictionaryLearningAction implements Action {
  readonly type: string = COMPUTE_MINI_BATCH_DICTIONARY_LEARNING;
  constructor(public payload: { config: MiniBatchDictionaryLearningConfigModel }) {}
}
export class MiniBatchDictionaryLearningCompleteAction implements Action {
  readonly type: string = COMPUTE_MINI_BATCH_DICTIONARY_LEARNING_COMPLETE;
  constructor(
    public payload: {
      config: MiniBatchDictionaryLearningConfigModel;
      data: MiniBatchDictionaryLearningDataModel;
    }
  ) {}
}
export class MiniBatchSparsePcaAction implements Action {
  readonly type: string = COMPUTE_MINI_BATCH_SPARSE_PCA;
  constructor(public payload: { config: MiniBatchSparsePcaConfigModel }) {}
}
export class PlsSvdAction implements Action {
  readonly type: string = COMPUTE_PLS_SVD;
  constructor(public payload: { config: PlsSvdConfigModel }) {}
}
export class PlsSvdCompleteAction implements Action {
  readonly type: string = COMPUTE_PLS_SVD_COMPLETE;
  constructor(public payload: { config: PlsSvdConfigModel; data: PlsSvdDataModel }) {}
}
export class PlsRegressionAction implements Action {
  readonly type: string = COMPUTE_PLS_REGRESSION;
  constructor(public payload: { config: PlsRegressionConfigModel }) {}
}
export class PlsRegressionCompleteAction implements Action {
  readonly type: string = COMPUTE_PLS_REGRESSION_COMPLETE;
  constructor(public payload: { config: PlsRegressionConfigModel; data: PlsRegressionDataModel }) {}
}
export class PlsCanonicalAction implements Action {
  readonly type: string = COMPUTE_PLS_CANONICAL;
  constructor(public payload: { config: PlsCanonicalConfigModel }) {}
}
export class PlsCanonicalCompleteAction implements Action {
  readonly type: string = COMPUTE_PLS_CANONICAL_COMPLETE;
  constructor(public payload: { config: PlsCanonicalConfigModel; data: PlsCanonicalDataModel }) {}
}
export class CCAAction implements Action {
  readonly type: string = COMPUTE_CCA;
  constructor(public payload: { config: CCAConfigModel }) {}
}
export class CCACompleteAction implements Action {
  readonly type: string = COMPUTE_CCA_COMPLETE;
  constructor(public payload: { config: CCAConfigModel; data: CCADataModel }) {}
}
export class LinearSVCAction implements Action {
  readonly type: string = COMPUTE_LINEAR_SVC;
  constructor(public payload: { config: LinearSVCConfigModel }) {}
}
export class LinearSVCCompleteAction implements Action {
  readonly type: string = COMPUTE_LINEAR_SVC_COMPLETE;
  constructor(public payload: { config: LinearSVCConfigModel; data: LinearSVCDataModel }) {}
}
export class LinearSVRAction implements Action {
  readonly type: string = COMPUTE_LINEAR_SVR;
  constructor(public payload: { config: LinearSVRConfigModel }) {}
}
export class LinearSVRCompleteAction implements Action {
  readonly type: string = COMPUTE_LINEAR_SVR_COMPLETE;
  constructor(public payload: { config: LinearSVRConfigModel; data: LinearSVRDataModel }) {}
}
export class NuSVRAction implements Action {
  readonly type: string = COMPUTE_NU_SVR;
  constructor(public payload: { config: NuSVRConfigModel }) {}
}
export class NuSVRCompleteAction implements Action {
  readonly type: string = COMPUTE_NU_SVR_COMPLETE;
  constructor(public payload: { config: NuSVRConfigModel; data: NuSVRDataModel }) {}
}
export class NuSVCAction implements Action {
  readonly type: string = COMPUTE_NU_SVC;
  constructor(public payload: { config: NuSVCConfigModel }) {}
}
export class NuSVCCompleteAction implements Action {
  readonly type: string = COMPUTE_NU_SVC_COMPLETE;
  constructor(public payload: { config: NuSVCConfigModel; data: NuSVCDataModel }) {}
}
export class OneClassSVMAction implements Action {
  readonly type: string = COMPUTE_ONE_CLASS_SVM;
  constructor(public payload: { config: OneClassSVMConfigModel }) {}
}
export class OneClassSVMCompleteAction implements Action {
  readonly type: string = COMPUTE_ONE_CLASS_SVM_COMPLETE;
  constructor(public payload: { config: OneClassSVMConfigModel; data: OneClassSVMDataModel }) {}
}
export class SVRAction implements Action {
  readonly type: string = COMPUTE_SVR;
  constructor(public payload: { config: SVRConfigModel }) {}
}
export class SVRCompleteAction implements Action {
  readonly type: string = COMPUTE_SVR_COMPLETE;
  constructor(public payload: { config: SVRConfigModel; data: SVRDataModel }) {}
}
export class MiniBatchSparsePcaCompleteAction implements Action {
  readonly type: string = COMPUTE_MINI_BATCH_SPARSE_PCA_COMPLETE;
  constructor(
    public payload: {
      config: MiniBatchSparsePcaConfigModel;
      data: MiniBatchSparsePcaDataModel;
    }
  ) {}
}
export class SomAction implements Action {
  readonly type: string = COMPUTE_SOM;
  constructor(public payload: { config: SomConfigModel }) {}
}
export class SomCompleteAction implements Action {
  readonly type: string = COMPUTE_SOM_COMPLETE;
  constructor(public payload: { config: SomConfigModel; data: SomDataModel }) {}
}
export class MdsAction implements Action {
  readonly type: string = COMPUTE_MDS;
  constructor(public payload: { config: MdsConfigModel }) {}
}
export class MdsCompleteAction implements Action {
  readonly type: string = COMPUTE_MDS_COMPLETE;
  constructor(public payload: { config: MdsConfigModel; data: MdsDataModel }) {}
}
export class SvmAction implements Action {
  readonly type: string = COMPUTE_SVM;
  constructor(
    public payload: {
      graph: GraphEnum;
      samples: Array<string>;
      genes: Array<string>;
      C: number;
      tolerance: number;
      maxPasses: number;
      maxIterations: number;
      kernel: string;
      signa: number;
    }
  ) {}
}
export class SvmCompleteAction implements Action {
  readonly type: string = COMPUTE_SVM_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class MeanAction implements Action {
  readonly type: string = COMPUTE_MEAN;
  constructor(public payload: { graph: GraphEnum; genes: Array<string> }) {}
}
export class MeanCompleteAction implements Action {
  readonly type: string = COMPUTE_SVM_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class PopulationSummaryAction implements Action {
  readonly type: string = COMPUTE_POPULATION_SUMMARY;
  constructor(public payload: { graph: GraphEnum }) {}
}
export class PopulationSummaryCompleteAction implements Action {
  readonly type: string = COMPUTE_SVM_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class SampleSummaryAction implements Action {
  readonly type: string = COMPUTE_SAMPLE_SUMMARY;
  constructor(public payload: { graph: GraphEnum; samples: Array<string> }) {}
}
export class SampleSummaryCompleteAction implements Action {
  readonly type: string = COMPUTE_SAMPLE_SUMMARY_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class GraphColorAction implements Action {
  readonly type: string = COMPUTE_GRAPH_COLOR;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class GraphColorCompleteAction implements Action {
  readonly type: string = COMPUTE_GRAPH_COLOR_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class GraphShapeAction implements Action {
  readonly type: string = COMPUTE_GRAPH_SHAPE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class GraphShapeCompleteAction implements Action {
  readonly type: string = COMPUTE_GRAPH_SHAPE_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class GraphSizeAction implements Action {
  readonly type: string = COMPUTE_GRAPH_SIZE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class GraphSizeCompleteAction implements Action {
  readonly type: string = COMPUTE_GRAPH_SIZE_COMPLETE;
  constructor(public payload: { graph: GraphEnum; data: any }) {}
}
export class SelectSamplesAction implements Action {
  readonly type: string = COMPUTE_SELECT_SAMPLES;
  constructor(public payload: { samples: Array<string> }) {}
}
export class SelectSamplesCompleteAction implements Action {
  readonly type: string = COMPUTE_SELECT_SAMPLES_COMPLETE;
  constructor(public payload: { selection: ChartSelection; stats: string }) {}
}
export class SelectMarkersAction implements Action {
  readonly type: string = COMPUTE_SELECT_MARKERS;
  constructor(public payload: { markers: Array<string> }) {}
}
export class SelectMarkersCompleteAction implements Action {
  readonly type: string = COMPUTE_SELECT_MARKERS_COMPLETE;
  constructor(public payload: { selection: ChartSelection; stats: string }) {}
}
export class SelectHideAction implements Action {
  readonly type: string = COMPUTE_SELECT_HIDE;
  constructor(public payload: {}) {}
}
export class SelectSaveSamplesAction implements Action {
  readonly type: string = COMPUTE_SELECT_SAMPLES_SAVE;
  constructor(public payload: { name: string; selection: ChartSelection }) {}
}
export class SelectSaveMarkersAction implements Action {
  readonly type: string = COMPUTE_SELECT_MARKERS_SAVE;
  constructor(public payload: { name: string; selection: ChartSelection }) {}
}

// Action Type
export type Actions =
  | LoadDataAction
  | LoadDataActionComplete
  | ChromosomeAction
  | ChromosomeCompleteAction
  | GenomeAction
  | GenomeCompleteAction
  | LinkedGeneAction
  | LinkedGeneCompleteAction
  | HicAction
  | HicCompleteAction
  | DaAction
  | DaCompleteAction
  | DeAction
  | DeCompleteAction
  | PcaAction
  | PcaCompleteAction
  | PcaIncrementalAction
  | PcaIncrementalCompleteAction
  | PcaKernalAction
  | PcaKernalCompleteAction
  | PcaSparseAction
  | PcaSparseCompleteAction
  | SpectralEmbeddingAction
  | SpectralEmbeddingCompleteAction
  | LocalLinearEmbeddingAction
  | LocalLinearEmbeddingCompleteAction
  | IsoMapAction
  | IsoMapCompleteAction
  | PlsAction
  | PlsCompleteAction
  | TsneAction
  | TsneCompleteAction
  | UmapAction
  | UmapCompleteAction
  | ScatterAction
  | ScatterCompleteAction
  | SurvivalAction
  | SurvivalCompleteAction
  | HazardAction
  | HazardCompleteAction
  | DendogramAction
  | DendogramCompleteAction
  | HeatmapAction
  | HeatmapCompleteAction
  | BoxWhiskersAction
  | BoxWhiskersCompleteAction
  | ParallelCoordsAction
  | ParallelCoordsCompleteAction
  | HistogramAction
  | HistogramCompleteAction
  | TimelinesAction
  | TimelinesCompleteAction
  | PathwaysAction
  | PathwaysCompleteAction
  | ProteinAction
  | ProteinCompleteAction
  | MdsAction
  | MdsCompleteAction
  | SomAction
  | SomCompleteAction
  | SvmAction
  | SvmCompleteAction
  | MeanAction
  | MeanCompleteAction
  | TruncatedSvdAction
  | TruncatedSvdCompleteAction
  | LdaAction
  | LdaCompleteAction
  | NmfAction
  | NmfCompleteAction
  | MiniBatchSparsePcaAction
  | MiniBatchSparsePcaCompleteAction
  | MiniBatchDictionaryLearningAction
  | MiniBatchDictionaryLearningCompleteAction
  | LinearDiscriminantAnalysisAction
  | LinearDiscriminantAnalysisCompleteAction
  | QuadraticDiscriminantAnalysisAction
  | QuadraticDiscriminantAnalysisCompleteAction
  | DictionaryLearningAction
  | DictionaryLearningCompleteAction
  | FastIcaAction
  | FastIcaCompleteAction
  | PopulationSummaryAction
  | PopulationSummaryCompleteAction
  | SampleSummaryAction
  | SampleSummaryCompleteAction
  | GraphColorAction
  | GraphShapeAction
  | GraphSizeAction
  | GraphColorCompleteAction
  | GraphShapeCompleteAction
  | GraphSizeCompleteAction
  | SelectSamplesAction
  | SelectSamplesCompleteAction
  | SelectMarkersAction
  | SelectMarkersCompleteAction
  | SelectSaveSamplesAction
  | SelectSaveMarkersAction
  | SelectHideAction
  | PlsSvdAction
  | PlsSvdCompleteAction
  | PlsRegressionAction
  | PlsRegressionCompleteAction
  | PlsCanonicalAction
  | PlsCanonicalCompleteAction
  | CCAAction
  | CCACompleteAction
  | LinearSVCAction
  | LinearSVCCompleteAction
  | LinearSVRAction
  | LinearSVRCompleteAction
  | NuSVRAction
  | NuSVRCompleteAction
  | NuSVCAction
  | NuSVCCompleteAction
  | OneClassSVMAction
  | OneClassSVMCompleteAction;
