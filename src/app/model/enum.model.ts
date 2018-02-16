/*
    Contains Enumerations
*/
export const Colors = [0x00FF00, 0xD50000, 0xC51162, 0xAA00FF, 0x6200EA, 0x304FFE, 0x2196F3, 0x0091EA,
    0x00B8D4, 0x00BFA5, 0x64DD17, 0xAEEA00, 0xFFD600, 0xFFAB00, 0xFF6D00, 0xDD2C00,
    0x5D4037, 0x455A64];

export const enum ColorEnum {
    RED = 0xD50000,
    PINK = 0xC51162,
    PURPLE = 0xAA00FF,
    PURPLE_DARK = 0x6200EA,
    INDIGO = 0x304FFE,
    BLUE = 0x2196F3,
    BLUE_LIGHT = 0x0091EA,
    CYAN = 0x00B8D4,
    TEAL = 0x00BFA5,
    GREEN = 0x64DD17,
    LIME = 0xAEEA00,
    YELLOW = 0xFFD600,
    AMBER = 0xFFAB00,
    ORANGE = 0xFF6D00,
    ORANGE_DARK = 0xDD2C00,
    BROWN = 0x5D4037,
    BLUE_GRAY = 0x455A64
}


export const enum GenomicEnum {
    CHROMOSOME = 0,
    GENE = 1,
    CENTROMERE = 2,
    TELOMERE = 4,
    CYTOBAND = 8,
    P_ARM = 16,
    Q_ARM = 32,
    P_TELOMERE = 64,
    Q_TELOMERE = 128
}

export const enum DirtyEnum {
    LAYOUT = 1,
    COLOR = 2,
    SIZE = 4,
    SHAPE = 8,
    INTERSECT = 16,
    OPTIONS = 32,
    NO_COMPUTE = 64
}

export class LogicalOperatorEnum {
    static readonly AND = 'AND';
    static readonly OR = 'OR';
}
export class ConditionalOperatorEnum {
    static readonly GT = '>';
    static readonly LT = '<';
    static readonly GTE = '>=';
    static readonly LTE = '<=';
    static readonly IN = 'In';
    static readonly NOT = 'Not';
}

export const enum ShapeEnum {
    CIRCLE = 1,
    SQUARE = 2,
    TRIANGLE = 4,
    CONE = 8,
    BOX = 16,
    NULL = 32
}

export const enum SizeEnum {
    S = 1,
    M = 2,
    L = 3,
    XL = 4
}

export const enum GraphEnum {
    GRAPH_A = 1,
    GRAPH_B = 2,
    EDGES = 4
}
export class DistanceEnum {
    static readonly EUCLIDEAN = 'euclidean';
    static readonly MANHATTAN = 'manhattan';
    static readonly JACCARD = 'jaccard';
    static readonly DICE = 'dice';
}
export class DenseSparseEnum {
    static readonly SPARSE = 'sparse';
    static readonly DENSE = 'dense';
}
export class DimensionEnum {
    static readonly ONE_D = 'One Dimension';
    static readonly TWO_D = 'Two Dimension';
    static readonly THREE_D = 'Three Dimension';
}

export class DiseaseEnum {
    static readonly BREAST = 'BREAST';
    static readonly BRAIN = 'BRAIN';
    static readonly LUNG = 'LUNG';
}

export const enum CollectionTypeEnum {
    UNDEFINED = 0,
    SAMPLE = 1,
    PATIENT = 2,
    CNV = 4,    // CNV_THD - CNV === Gistic + CNV_THD === GISTIC_THRESHOLD
    GISTIC = 8,
    GISTIC_THRESHOLD = 16,
    MUTATION = 32,
    MIRNA = 64,
    MRNA = 128,
    PROTEIN = 256,  // EXP - PROTEIN, MIRNA, RNA
    METH = 512,
    GENE_FAMILY = 1024,
    GENE_TYPE = 2048,
    HIC = 4096,
    EVENT = 8192,
    RNA = 16384,
    TAD = 32768,
    // tslint:disable-next-line:no-bitwise
    EXP = CollectionTypeEnum.PROTEIN | CollectionTypeEnum.MIRNA | CollectionTypeEnum.MRNA,
    // tslint:disable-next-line:no-bitwise
    MOLECULAR = CollectionTypeEnum.CNV | CollectionTypeEnum.GISTIC |
        CollectionTypeEnum.GISTIC_THRESHOLD | CollectionTypeEnum.MUTATION | CollectionTypeEnum.MIRNA |
        CollectionTypeEnum.MRNA | CollectionTypeEnum.EXP | CollectionTypeEnum.METH | CollectionTypeEnum.RNA
}

export class DataTypeEnum {
    static readonly UNDEFINED = 'UNDEFINED';
    static readonly STRING = 'STRING';
    // static readonly DATE = 'DATE';
    // static readonly BOOL = 'BOOL';
    static readonly NUMBER = 'NUMBER';
    static readonly FUNCTION = 'FUNCTION';
    // static readonly FUNCTION_MEAN = 'FUNCTION_MEAN';
    // static readonly FUNCTION_MEDIAN = 'FUNCTION_MEDIAN';
}

export class MutationTypeEnum {
    static readonly COPY_NUMBER_GAIN_HIGH = 'Copy_Number_Gain_High';
    static readonly COPY_NUMBER_GAIN_LOW = 'Copy_Number_Gain_Low';
    static readonly COPY_NUMBER_LOSS_HIGH = 'Copy_Number_Loss_High';
    static readonly COPY_NUMBER_LOSS_LOW = 'Copy_Number_Loss_Low';
    static readonly MISSENSE = 'Missense';
    static readonly SILENT = 'Silent';
    static readonly FRAME_SHIFT_DEL = 'Frame_Shift_Del';
    static readonly SPLICE_SITE = 'Splice_Site';
    static readonly NONSENSE_MUTATION = 'Nonsense_Mutation';
    static readonly FRAME_SHIFT_INS = 'Frame_Shift_Ins';
    static readonly RNA = 'RNA';
    static readonly IN_FRAME_DEL = 'In_Frame_Del';
    static readonly IN_FRAME_INS = 'In_Frame_Ins';
    static readonly NONSTOP_MUTATION = 'Nonstop_Mutation';
    static readonly TRANSLATION_START_SITE = 'Translation_Start_Site';
    static readonly DE_NOVO_START_OUTOFFRAME = 'De_novo_Start_OutOfFrame';
    static readonly DE_NOVO_START_INFRAME = 'De_novo_Start_InFrame';
    static readonly INTRON = 'Intron';
    static readonly THREE_PRIME_UTR = '3\'UTR';
    static readonly IGR = 'IGR';
    static readonly FIVE_PRIME_UTR = '5\'UTR';
    static readonly TARGETED_REGION = 'Targeted_Region';
    static readonly READ_THROUGH = 'Read-through';
    static readonly FIVE_PRIME_FLANK = '5\'Flank';
    static readonly THREE_PRIME_FLANK = '3\'Flank';
    static readonly SPLICE_SITE_SNP = 'Splice_Site_SNP';
    static readonly SPLICE_SITE_DEL = 'Splice_Site_Del';
    static readonly SPLICE_SITE_INS = 'Splice_Site_Ins';
    static readonly INDEL = 'Indel';
    static readonly R = 'R';
}

export class EntityTypeEnum {
    static readonly NONE = 'None';
    static readonly UNKNOWN = 'Unknown';
    static readonly PATIENT = 'Patients';
    static readonly GENE = 'Genes';
    static readonly SAMPLE = 'Samples';
    static readonly EVENT = 'Events';
    static readonly EDGE = 'Edge';
    static readonly MIXED = 'Mixed';
}
export class ChartTypeEnum {
    static readonly PIE = 'Pie';
    static readonly DONUT = 'Donut';
    static readonly HISTOGRAM = 'Histogram';
    static readonly LINE = 'Line';
    static readonly LABEL = 'Label';
    static readonly SCATTER = 'Scatter';
}
export const enum StatTypeEnum {
    ONE_D = 1,
    TWO_D = 2,
    SINGLE = 4,
    MISC = 8
}
export const enum StatRendererEnum {
    HTML = 1,
    VEGA = 2,
    D3 = 3
}
export const enum StatRendererColumns {
    SIX = 6,
    TWELVE = 12
}
export const enum VisualizationEnum {
    NONE = 0,
    PCA = 1,
    PLS = 2,
    CHROMOSOME = 3,
    TSNE = 4,
    EDGES = 8,
    SURVIVAL = 16,
    HEATMAP = 32,
    HISTOGRAM = 64,
    TIMELINES = 128,
    PATHWAYS = 256,
    KMEANS = 512,
    KMEDIAN = 1024,
    KMEDOIDS = 2048,
    SOM = 4096,
    MDS = 8192,
    DA = 16384,
    DE = 32768,
    FA = 65536,
    TRUNCATED_SVD = 131072,
    INCREMENTAL_PCA = 262144,
    KERNAL_PCA = 524288,
    SPARSE_PCA = 1048576,
    PROBABILISTIC_PCA = 2097152,
    RANDOMIZED_PCA = 4194304,
    FAST_ICA = 8388608,
    DICTIONARY_LEARNING = 16777216,
    LDA = 33554432,
    NMF = 67108864,
    ISOMAP = 134217728,
    LOCALLY_LINEAR_EMBEDDING = 268435456,
    SPECTRAL_EMBEDDING = 536870912,
    LINKED_GENE = 1073741824,
    GENOME = 2147483648,
    BOX_WHISKERS = 4294967296,
    PARALLEL_COORDS = 8589934592,
    HIC = 17179869184,
    MINI_BATCH_DICTIONARY_LEARNING = 34359738368,
    MINI_BATCH_SPARSE_PCA = 68719476736,
    LINEAR_DISCRIMINANT_ANALYSIS = 137438953472,
    QUADRATIC_DISCRIMINANT_ANALYSIS = 274877906944
}

// Visibility
export const enum VisibilityEnum {
    SHOW = 1,
    HIDE = 2
}

export const enum DepthEnum {
    FRONT = 1,
    BACK = 2
}
// Tools
export const enum ToolEnum {
    SELECT = 1,
    MOVE = 2,
    ROTATE = 4,
    ZOOM = 8,
    INSERT_ANNOTATION = 16
}

export const enum GraphActionEnum {
    VISIBILITY_TOGGLE = 1,
    DEPTH_TOGGLE = 2,
    SAVE_COHORT = 4,
    SET_COLOR = 8,
    SET_SHAPE = 16,
    SET_SIZE = 32
}
export class WorkspaceLayoutEnum {
    static readonly SINGLE = 'Single';
    static readonly HORIZONTAL = 'Horizontal';
    static readonly VERTICAL = 'Vertical';
    static readonly OVERLAY = 'Overlay';
}


export class HClustMethodEnum {
    static readonly AGNES = 'agnes';
    static readonly DIANA = 'diana';
}
export class HClustDistanceEnum {
    static readonly SINGLE = 'single';
    static readonly COMPLETE = 'complete';
    static readonly AVERAGE = 'average';
    static readonly CENTROID = 'centroid';
    static readonly WARD = 'ward';
}



// Panels
export const enum SinglePanelEnum {
    SHOW = 1,
    HIDE = 0
}
export const enum FilePanelEnum {
    NONE = 0,
    OPEN = 1,
    SAVE = 2
}
export const enum EdgePanelEnum {
    NONE = 0,
    SETTINGS = 1
}
export const enum TcgaPanelEnum {
    NONE = 0,
    DATASETS = 1
}
export const enum QueryPanelEnum {
    NONE = 0,
    BUILDER = 1,
    SAVED = 2
}
export const enum ToolPanelEnum {
    NONE = 0,
    SETTINGS = 1
}
export const enum GraphPanelEnum {
    NONE = 0,
    GRAPH_A = 1,
    GRAPH_B = 2
}
export const enum StatPanelEnum {
    NONE = 0,
    SURVIVAL = 1,
    HISTOGRAM = 2,
    SUMMARY = 3,
}
export const enum LegendPanelEnum {
    NONE = 0,
    ALL = 1,
    GRAPH_1 = 2,
    GRAPH_2 = 3,
    EDGES = 4
}
export const enum HistoryPanelEnum {
    NONE = 0,
    HISTORY = 1
}

export const enum DataPanelEnum {
    NONE = 0,
    TABLE = 1
}
export const enum WorkspacePanelEnum {
    NONE = 0,
    SETTINGS = 1
}
