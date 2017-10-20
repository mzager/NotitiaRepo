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

export const enum DirtyEnum {
    LAYOUT = 1,
    COLOR = 2,
    SIZE = 4,
    SHAPE = 8,
    INTERSECT = 16
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
    NULL = 16
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
    CNV = 4,
    GISTIC = 8,
    GISTIC_THRESHOLD = 16,
    MUTATION = 32,
    MIRNA = 64,
    MRNA = 128,
    EXP = 256,
    METH = 512,
    // tslint:disable-next-line:no-bitwise
    MOLECULAR = CollectionTypeEnum.CNV | CollectionTypeEnum.GISTIC |
        CollectionTypeEnum.GISTIC_THRESHOLD | CollectionTypeEnum.MUTATION | CollectionTypeEnum.MIRNA |
        CollectionTypeEnum.MRNA | CollectionTypeEnum.EXP | CollectionTypeEnum.METH
}

export class DataTypeEnum {
    static readonly UNDEFINED = 'UNDEFINED';
    static readonly STRING = 'STRING';
    // static readonly DATE = 'DATE';
    // static readonly BOOL = 'BOOL';
    static readonly NUMBER = 'NUMBER';
    // static readonly FUNCTION_MEAN = 'FUNCTION_MEAN';
    // static readonly FUNCTION_MEDIAN = 'FUNCTION_MEDIAN';
}

export class EntityTypeEnum {
    static readonly UNKNOWN = 'Unknown';
    static readonly PATIENT = 'Patients';
    static readonly GENE = 'Genes';
    static readonly SAMPLE = 'Samples';
    static readonly EDGE = 'Edge';
    static readonly MIXED = 'Mixed';
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
    SPECTRAL_EMBEDDING = 536870912
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
