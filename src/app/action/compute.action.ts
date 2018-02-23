import { DendogramConfigModel, DendogramDataModel } from './../component/visualization/dendogram/dendogram.model';
import { MiniBatchSparsePcaConfigModel, MiniBatchSparsePcaDataModel } from 'app/component/visualization/minibatchsparsepca/minibatchsparsepca.model';
import { MiniBatchDictionaryLearningConfigModel, MiniBatchDictionaryLearningDataModel } from 'app/component/visualization/minibatchdictionarylearning/minibatchdictionarylearning.model';
import { LinearDiscriminantAnalysisConfigModel, LinearDiscriminantAnalysisDataModel } from 'app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.model';
import { HicConfigModel, HicDataModel } from './../component/visualization/hic/hic.model';
import { BoxWhiskersDataModel, BoxWhiskersConfigModel } from './../component/visualization/boxwhiskers/boxwhiskers.model';
import { ParallelCoordsConfigModel, ParallelCoordsDataModel } from './../component/visualization/parallelcoords/parallelcoords.model';
import { GenomeConfigModel, GenomeDataModel } from './../component/visualization/genome/genome.model';
import { LinkedGeneConfigModel, LinkedGeneDataModel } from './../component/visualization/linkedgenes/linkedgenes.model';
import { GraphData } from './../model/graph-data.model';
import { GraphConfig } from 'app/model/graph-config.model';
import { PcaSparseConfigModel, PcaSparseDataModel } from './../component/visualization/pcasparse/pcasparse.model';
import {
    SpectralEmbeddingDataModel, SpectralEmbeddingConfigModel
} from './../component/visualization/spectralembedding/spectralembedding.model';
import {
    LocalLinearEmbeddingConfigModel, LocalLinearEmbeddingDataModel
} from './../component/visualization/locallinearembedding/locallinearembedding.model';
import { IsoMapConfigModel, IsoMapDataModel } from './../component/visualization/isomap/isomap.model';
import { PcaKernalConfigModel, PcaKernalDataModel } from './../component/visualization/pcakernal/pcakernal.model';
import { PcaIncrementalConfigModel, PcaIncrementalDataModel } from './../component/visualization/pcaincremental/pcaincremental.model';
import { TruncatedSvdConfigModel, TruncatedSvdDataModel } from './../component/visualization/truncatedsvd/truncatedsvd.model';
import { NmfConfigModel, NmfDataModel } from './../component/visualization/nmf/nmf.model';
import { LdaConfigModel, LdaDataModel } from './../component/visualization/lda/lda.model';
import { FastIcaConfigModel, FastIcaDataModel } from './../component/visualization/fastica/fastica.model';
import {
    DictionaryLearningConfigModel, DictionaryLearningDataModel
} from './../component/visualization/dictionarylearning/dictionarylearning.model';
import { FaConfigModel, FaDataModel } from './../component/visualization/fa/fa.model';
import { MdsConfigModel, MdsDataModel } from './../component/visualization/mds/mds.model';
import { DeConfigModel, DeDataModel } from './../component/visualization/de/de.model';
import { DaConfigModel, DaDataModel } from './../component/visualization/da/da.model';
import { SomConfigModel, SomDataModel } from './../component/visualization/som/som.model';
import { SurvivalConfigModel, SurvivalDataModel } from './../component/visualization/survival/survival.model';
import { PathwaysConfigModel, PathwaysDataModel } from './../component/visualization/pathways/pathways.model';
import { TimelinesConfigModel, TimelinesDataModel } from './../component/visualization/timelines/timelines.model';
import { HistogramConfigModel, HistogramDataModel } from './../component/visualization/histogram/histogram.model';
import { HeatmapConfigModel, HeatmapDataModel } from './../component/visualization/heatmap/heatmap.model';
import { EdgeConfigModel, EdgeDataModel } from './../component/visualization/edges/edges.model';
import { TsneConfigModel, TsneDataModel } from './../component/visualization/tsne/tsne.model';
import { PlsConfigModel, PlsDataModel } from './../component/visualization/pls/pls.model';
import { ChromosomeConfigModel, ChromosomeDataModel } from './../component/visualization/chromosome/chromosome.model';
import { PcaConfigModel, PcaDataModel } from './../component/visualization/pca/pca.model';
import { GraphEnum } from 'app/model/enum.model';
import { Action } from '@ngrx/store';
import { QuadradicDiscriminantAnalysisConfigModel, QuadradicDiscriminantAnalysisDataModel } from 'app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.model';

// Action Constants
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
export const COMPUTE_EDGES = '[Compute] Edges';
export const COMPUTE_EDGES_COMPLETE = '[Compute] Edges Complete';
export const COMPUTE_NONE = '[Compute] None';
export const COMPUTE_NONE_COMPLETE = '[Compute] None Complete';
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
export const SELECT_SAMPLES = '[Compute] Select Samples';
export const SELECT_MARKERS = '[Compute] Select Markers';

export class NullDataAction implements Action {
    readonly type = 'NULL';
    constructor() { }
}

// Action Classes
export class LoadDataAction implements Action {
    readonly type: string = COMPUTE_LOAD_DATA;
    constructor(public payload: { graph: GraphEnum, pouchId: string }) { }
}
export class LoadDataActionComplete implements Action {
    readonly type: string = COMPUTE_LOAD_DATA_COMPLETE;
    constructor(public payload: { success: boolean }) { }
}
export class EdgesAction implements Action {
    readonly type: string = COMPUTE_EDGES;
    constructor(public payload: { config: EdgeConfigModel }) { }
}
export class EdgesCompleteAction implements Action {
    readonly type: string = COMPUTE_EDGES_COMPLETE;
    constructor(public payload: { config: EdgeConfigModel, data: EdgeDataModel }) { }
}
export class NoneAction implements Action {
    readonly type: string = COMPUTE_NONE;
    constructor(public payload: { config: GraphConfig }) { }
}
export class NoneCompleteAction implements Action {
    readonly type: string = COMPUTE_NONE_COMPLETE;
    constructor(public payload: { config: GraphConfig, data: GraphData }) { }
}
export class DictionaryLearningAction implements Action {
    readonly type: string = COMPUTE_DICTIONARY_LEARNING;
    constructor(public payload: { config: DictionaryLearningConfigModel }) { }
}
export class DictionaryLearningCompleteAction implements Action {
    readonly type: string = COMPUTE_DICTIONARY_LEARNING_COMPLETE;
    constructor(public payload: { config: DictionaryLearningConfigModel, data: DictionaryLearningDataModel }) { }
}
export class FastIcaAction implements Action {
    readonly type: string = COMPUTE_FAST_ICA;
    constructor(public payload: { config: FastIcaConfigModel }) { }
}
export class FastIcaCompleteAction implements Action {
    readonly type: string = COMPUTE_FAST_ICA_COMPLETE;
    constructor(public payload: { config: FastIcaConfigModel, data: FastIcaDataModel }) { }
}
export class LdaAction implements Action {
    readonly type: string = COMPUTE_LDA;
    constructor(public payload: { config: LdaConfigModel }) { }
}
export class LdaCompleteAction implements Action {
    readonly type: string = COMPUTE_LDA_COMPLETE;
    constructor(public payload: { config: LdaConfigModel, data: LdaDataModel }) { }
}
export class NmfAction implements Action {
    readonly type: string = COMPUTE_NMF;
    constructor(public payload: { config: NmfConfigModel }) { }
}
export class NmfCompleteAction implements Action {
    readonly type: string = COMPUTE_NMF_COMPLETE;
    constructor(public payload: { config: NmfConfigModel, data: NmfDataModel }) { }
}
export class TruncatedSvdAction implements Action {
    readonly type: string = COMPUTE_TRUNCATED_SVD;
    constructor(public payload: { config: TruncatedSvdConfigModel }) { }
}
export class TruncatedSvdCompleteAction implements Action {
    readonly type: string = COMPUTE_TRUNCATED_SVD_COMPLETE;
    constructor(public payload: { config: TruncatedSvdConfigModel, data: TruncatedSvdDataModel }) { }
}
export class FaAction implements Action {
    readonly type: string = COMPUTE_FA;
    constructor(public payload: { config: FaConfigModel }) { }
}
export class FaCompleteAction implements Action {
    readonly type: string = COMPUTE_FA_COMPLETE;
    constructor(public payload: { config: FaConfigModel, data: FaDataModel }) { }
}
export class DaAction implements Action {
    readonly type: string = COMPUTE_DA;
    constructor(public payload: { config: DaConfigModel }) { }
}
export class DaCompleteAction implements Action {
    readonly type: string = COMPUTE_DA_COMPLETE;
    constructor(public payload: { config: DaConfigModel, data: DaDataModel }) { }
}
export class DeAction implements Action {
    readonly type: string = COMPUTE_DE;
    constructor(public payload: { config: DeConfigModel }) { }
}
export class DeCompleteAction implements Action {
    readonly type: string = COMPUTE_DE_COMPLETE;
    constructor(public payload: { config: DeConfigModel, data: DeDataModel }) { }
}
export class PcaAction implements Action {
    readonly type: string = COMPUTE_PCA;
    constructor(public payload: { config: PcaConfigModel }) { }
}
export class PcaCompleteAction implements Action {
    readonly type: string = COMPUTE_PCA_COMPLETE;
    constructor(public payload: { config: PcaConfigModel, data: PcaDataModel }) { }
}
export class PcaIncrementalAction implements Action {
    readonly type: string = COMPUTE_PCA_INCREMENTAL;
    constructor(public payload: { config: PcaIncrementalConfigModel }) { }
}
export class PcaIncrementalCompleteAction implements Action {
    readonly type: string = COMPUTE_PCA_INCREMENTAL_COMPLETE;
    constructor(public payload: { config: PcaIncrementalConfigModel, data: PcaIncrementalDataModel }) { }
}
export class PcaKernalAction implements Action {
    readonly type: string = COMPUTE_PCA_KERNAL;
    constructor(public payload: { config: PcaKernalConfigModel }) { }
}
export class PcaKernalCompleteAction implements Action {
    readonly type: string = COMPUTE_PCA_KERNAL_COMPLETE;
    constructor(public payload: { config: PcaKernalConfigModel, data: PcaKernalDataModel }) { }
}
export class PcaSparseAction implements Action {
    readonly type: string = COMPUTE_PCA_SPARSE;
    constructor(public payload: { config: PcaSparseConfigModel }) { }
}
export class PcaSparseCompleteAction implements Action {
    readonly type: string = COMPUTE_PCA_SPARSE_COMPLETE;
    constructor(public payload: { config: PcaSparseConfigModel, data: PcaSparseDataModel }) { }
}
export class IsoMapAction implements Action {
    readonly type: string = COMPUTE_ISO_MAP;
    constructor(public payload: { config: IsoMapConfigModel }) { }
}
export class IsoMapCompleteAction implements Action {
    readonly type: string = COMPUTE_ISO_MAP_COMPLETE;
    constructor(public payload: { config: IsoMapConfigModel, data: IsoMapDataModel }) { }
}
export class LocalLinearEmbeddingAction implements Action {
    readonly type: string = COMPUTE_LOCAL_LINEAR_EMBEDDING;
    constructor(public payload: { config: LocalLinearEmbeddingConfigModel }) { }
}
export class LocalLinearEmbeddingCompleteAction implements Action {
    readonly type: string = COMPUTE_LOCAL_LINEAR_EMBEDDING_COMPLETE;
    constructor(public payload: { config: LocalLinearEmbeddingConfigModel, data: LocalLinearEmbeddingDataModel }) { }
}
export class SpectralEmbeddingAction implements Action {
    readonly type: string = COMPUTE_SPECTRAL_EMBEDDING;
    constructor(public payload: { config: SpectralEmbeddingConfigModel }) { }
}
export class SpectralEmbeddingCompleteAction implements Action {
    readonly type: string = COMPUTE_SPECTRAL_EMBEDDING_COMPLETE;
    constructor(public payload: { config: SpectralEmbeddingConfigModel, data: SpectralEmbeddingDataModel }) { }
}
export class TsneAction implements Action {
    readonly type: string = COMPUTE_TSNE;
    constructor(public payload: { config: TsneConfigModel }) { }
}
export class TsneCompleteAction implements Action {
    readonly type: string = COMPUTE_TSNE_COMPLETE;
    constructor(public payload: { config: TsneConfigModel, data: TsneDataModel }) { }
}
export class PlsAction implements Action {
    readonly type: string = COMPUTE_PLSR;
    constructor(public payload: { config: PlsConfigModel }) { }
}
export class PlsCompleteAction implements Action {
    readonly type: string = COMPUTE_PLSR_COMPLETE;
    constructor(public payload: { config: PlsConfigModel, data: PlsDataModel }) { }
}
export class ChromosomeAction implements Action {
    readonly type: string = COMPUTE_CHROMOSOME;
    constructor(public payload: { config: ChromosomeConfigModel }) { }
}
export class ChromosomeCompleteAction implements Action {
    readonly type: string = COMPUTE_CHROMOSOME_COMPLETE;
    constructor(public payload: { config: ChromosomeConfigModel, data: ChromosomeDataModel }) { }
}
export class GenomeAction implements Action {
    readonly type: string = COMPUTE_GENOME;
    constructor(public payload: { config: GenomeConfigModel }) { }
}
export class GenomeCompleteAction implements Action {
    readonly type: string = COMPUTE_GENOME_COMPLETE;
    constructor(public payload: { config: GenomeConfigModel, data: GenomeDataModel }) { }
}
export class LinkedGeneAction implements Action {
    readonly type: string = COMPUTE_LINKED_GENE;
    constructor(public payload: { config: LinkedGeneConfigModel }) { }
}
export class LinkedGeneCompleteAction implements Action {
    readonly type: string = COMPUTE_LINKED_GENE_COMPLETE;
    constructor(public payload: { config: GenomeConfigModel, data: GenomeDataModel }) { }
}
export class HicAction implements Action {
    readonly type: string = COMPUTE_HIC;
    constructor(public payload: { config: HicConfigModel }) { }
}
export class HicCompleteAction implements Action {
    readonly type: string = COMPUTE_HIC_COMPLETE;
    constructor(public payload: { config: HicConfigModel, data: HicDataModel }) { }
}
export class SurvivalAction implements Action {
    readonly type: string = COMPUTE_SURVIVAL;
    constructor(public payload: { config: SurvivalConfigModel }) { }
}
export class SurvivalCompleteAction implements Action {
    readonly type: string = COMPUTE_SURVIVAL_COMPLETE;
    constructor(public payload: { config: SurvivalConfigModel, data: SurvivalDataModel }) { }
}
export class DendogramAction implements Action {
    readonly type: string = COMPUTE_DENDOGRAM;
    constructor(public payload: { config: DendogramConfigModel }) { }
}
export class DendogramCompleteAction implements Action {
    readonly type: string = COMPUTE_DENDOGRAM_COMPLETE;
    constructor(public payload: { config: DendogramConfigModel, data: DendogramDataModel }) { }
}
export class HeatmapAction implements Action {
    readonly type: string = COMPUTE_HEATMAP;
    constructor(public payload: { config: HeatmapConfigModel }) { }
}
export class HeatmapCompleteAction implements Action {
    readonly type: string = COMPUTE_HEATMAP_COMPLETE;
    constructor(public payload: { config: HeatmapConfigModel, data: HeatmapDataModel }) { }
}
export class ParallelCoordsAction implements Action {
    readonly type: string = COMPUTE_PARALLEL_COORDS;
    constructor(public payload: { config: ParallelCoordsConfigModel }) { }
}
export class ParallelCoordsCompleteAction implements Action {
    readonly type: string = COMPUTE_PARALLEL_COORDS_COMPLETE;
    constructor(public payload: { config: ParallelCoordsConfigModel, data: ParallelCoordsDataModel }) { }
}
export class BoxWhiskersAction implements Action {
    readonly type: string = COMPUTE_BOX_WHISKERS;
    constructor(public payload: { config: BoxWhiskersConfigModel }) { }
}
export class BoxWhiskersCompleteAction implements Action {
    readonly type: string = COMPUTE_BOX_WHISKERS_COMPLETE;
    constructor(public payload: { config: BoxWhiskersConfigModel, data: BoxWhiskersDataModel }) { }
}
export class HistogramAction implements Action {
    readonly type: string = COMPUTE_HISTOGRAM;
    constructor(public payload: { config: HistogramConfigModel }) { }
}
export class HistogramCompleteAction implements Action {
    readonly type: string = COMPUTE_HISTOGRAM_COMPLETE;
    constructor(public payload: { config: HistogramConfigModel, data: HistogramDataModel }) { }
}
export class TimelinesAction implements Action {
    readonly type: string = COMPUTE_TIMELINES;
    constructor(public payload: { config: TimelinesConfigModel }) { }
}
export class TimelinesCompleteAction implements Action {
    readonly type: string = COMPUTE_TIMELINES_COMPLETE;
    constructor(public payload: { config: TimelinesConfigModel, data: TimelinesDataModel }) { }
}
export class PathwaysAction implements Action {
    readonly type: string = COMPUTE_PATHWAYS;
    constructor(public payload: { config: PathwaysConfigModel }) { }
}
export class PathwaysCompleteAction implements Action {
    readonly type: string = COMPUTE_PATHWAYS_COMPLETE;
    constructor(public payload: { config: PathwaysConfigModel, data: PathwaysDataModel }) { }
}
export class LinearDiscriminantAnalysisAction implements Action {
    readonly type: string = COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS;
    constructor(public payload: { config: LinearDiscriminantAnalysisConfigModel }) { }
}
export class LinearDiscriminantAnalysisCompleteAction implements Action {
    readonly type: string = COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS_COMPLETE;
    constructor(public payload: { config: LinearDiscriminantAnalysisConfigModel, data: LinearDiscriminantAnalysisDataModel }) { }
}
export class QuadraticDiscriminantAnalysisAction implements Action {
    readonly type: string = COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS;
    constructor(public payload: { config: QuadradicDiscriminantAnalysisConfigModel }) { }
}
export class QuadraticDiscriminantAnalysisCompleteAction implements Action {
    readonly type: string = COMPUTE_QUADRATIC_DISCRIMINANT_ANALYSIS_COMPLETE;
    constructor(public payload: { config: QuadradicDiscriminantAnalysisConfigModel, data: QuadradicDiscriminantAnalysisDataModel }) { }
}
export class MiniBatchDictionaryLearningAction implements Action {
    readonly type: string = COMPUTE_MINI_BATCH_DICTIONARY_LEARNING;
    constructor(public payload: { config: MiniBatchDictionaryLearningConfigModel }) { }
}
export class MiniBatchDictionaryLearningCompleteAction implements Action {
    readonly type: string = COMPUTE_MINI_BATCH_DICTIONARY_LEARNING_COMPLETE;
    constructor(public payload: { config: MiniBatchDictionaryLearningConfigModel, data: MiniBatchDictionaryLearningDataModel }) { }
}
export class MiniBatchSparsePcaAction implements Action {
    readonly type: string = COMPUTE_MINI_BATCH_SPARSE_PCA;
    constructor(public payload: { config: MiniBatchSparsePcaConfigModel }) { }
}
export class MiniBatchSparsePcaCompleteAction implements Action {
    readonly type: string = COMPUTE_MINI_BATCH_SPARSE_PCA_COMPLETE;
    constructor(public payload: { config: MiniBatchSparsePcaConfigModel, data: MiniBatchSparsePcaDataModel }) { }
}
export class SomAction implements Action {
    readonly type: string = COMPUTE_SOM;
    constructor(public payload: { config: SomConfigModel }) { }
}
export class SomCompleteAction implements Action {
    readonly type: string = COMPUTE_SOM_COMPLETE;
    constructor(public payload: { config: SomConfigModel, data: SomDataModel }) { }
}
export class MdsAction implements Action {
    readonly type: string = COMPUTE_MDS;
    constructor(public payload: { config: MdsConfigModel }) { }
}
export class MdsCompleteAction implements Action {
    readonly type: string = COMPUTE_MDS_COMPLETE;
    constructor(public payload: { config: MdsConfigModel, data: MdsDataModel }) { }
}
export class SvmAction implements Action {
    readonly type: string = COMPUTE_SVM;
    constructor(public payload: {
        graph: GraphEnum, samples: Array<string>, genes: Array<string>,
        C: number, tolerance: number, maxPasses: number, maxIterations: number, kernel: string, signa: number
    }) { }
}
export class SvmCompleteAction implements Action {
    readonly type: string = COMPUTE_SVM_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class MeanAction implements Action {
    readonly type: string = COMPUTE_MEAN;
    constructor(public payload: { graph: GraphEnum, genes: Array<string> }) { }
}
export class MeanCompleteAction implements Action {
    readonly type: string = COMPUTE_SVM_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class PopulationSummaryAction implements Action {
    readonly type: string = COMPUTE_POPULATION_SUMMARY;
    constructor(public payload: { graph: GraphEnum, }) { }
}
export class PopulationSummaryCompleteAction implements Action {
    readonly type: string = COMPUTE_SVM_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class SampleSummaryAction implements Action {
    readonly type: string = COMPUTE_SAMPLE_SUMMARY;
    constructor(public payload: { graph: GraphEnum, samples: Array<string> }) { }
}
export class SampleSummaryCompleteAction implements Action {
    readonly type: string = COMPUTE_SAMPLE_SUMMARY_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class GraphColorAction implements Action {
    readonly type: string = COMPUTE_GRAPH_COLOR;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class GraphColorCompleteAction implements Action {
    readonly type: string = COMPUTE_GRAPH_COLOR_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class GraphShapeAction implements Action {
    readonly type: string = COMPUTE_GRAPH_SHAPE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class GraphShapeCompleteAction implements Action {
    readonly type: string = COMPUTE_GRAPH_SHAPE_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class GraphSizeAction implements Action {
    readonly type: string = COMPUTE_GRAPH_SIZE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class GraphSizeCompleteAction implements Action {
    readonly type: string = COMPUTE_GRAPH_SIZE_COMPLETE;
    constructor(public payload: { graph: GraphEnum, data: any }) { }
}
export class SelectSamplesAction implements Action {
    readonly type: string = SELECT_SAMPLES;
    constructor(public payload: { samples: Array<string> }) { }
}
export class SelectMarkersAction implements Action {
    readonly type: string = SELECT_MARKERS;
    constructor(public payload: { markers: Array<string> }) { }
}

// Action Type
export type Actions =
    LoadDataAction | LoadDataActionComplete |
    ChromosomeAction | ChromosomeCompleteAction |
    GenomeAction | GenomeCompleteAction |
    LinkedGeneAction | LinkedGeneCompleteAction |
    HicAction | HicCompleteAction |
    DaAction | DaCompleteAction |
    DeAction | DeCompleteAction |
    PcaAction | PcaCompleteAction |
    PcaIncrementalAction | PcaIncrementalCompleteAction |
    PcaKernalAction | PcaKernalCompleteAction |
    PcaSparseAction | PcaSparseCompleteAction |
    SpectralEmbeddingAction | SpectralEmbeddingCompleteAction |
    LocalLinearEmbeddingAction | LocalLinearEmbeddingCompleteAction |
    IsoMapAction | IsoMapCompleteAction |
    PlsAction | PlsCompleteAction |
    TsneAction | TsneCompleteAction |
    SurvivalAction | SurvivalCompleteAction |
    DendogramAction | DendogramCompleteAction |
    HeatmapAction | HeatmapCompleteAction |
    BoxWhiskersAction | BoxWhiskersCompleteAction |
    ParallelCoordsAction | ParallelCoordsCompleteAction |
    HistogramAction | HistogramCompleteAction |
    TimelinesAction | TimelinesCompleteAction |
    PathwaysAction | PathwaysCompleteAction |
    MdsAction | MdsCompleteAction |
    SomAction | SomCompleteAction |
    SvmAction | SvmCompleteAction |
    MeanAction | MeanCompleteAction |
    TruncatedSvdAction | TruncatedSvdCompleteAction |
    LdaAction | LdaCompleteAction |
    NmfAction | NmfCompleteAction |
    MiniBatchSparsePcaAction | MiniBatchSparsePcaCompleteAction |
    MiniBatchDictionaryLearningAction | MiniBatchDictionaryLearningCompleteAction |
    LinearDiscriminantAnalysisAction | LinearDiscriminantAnalysisCompleteAction |
    QuadraticDiscriminantAnalysisAction | QuadraticDiscriminantAnalysisCompleteAction |
    DictionaryLearningAction | DictionaryLearningCompleteAction |
    FastIcaAction | FastIcaCompleteAction |
    PopulationSummaryAction | PopulationSummaryCompleteAction |
    SampleSummaryAction | SampleSummaryCompleteAction |
    GraphColorAction | GraphShapeAction | GraphSizeAction |
    GraphColorCompleteAction | GraphShapeCompleteAction | GraphSizeCompleteAction |
    SelectSamplesAction | SelectMarkersAction;
 