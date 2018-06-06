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
    GENE = 1 << 0,
    CENTROMERE = 1 << 1,
    TELOMERE = 1 << 2,
    CYTOBAND = 1 << 3,
    P_ARM = 1 << 4,
    Q_ARM = 1 << 5,
    P_TELOMERE = 1 << 6,
    Q_TELOMERE = 1 << 7
}

export const enum DirtyEnum {
    LAYOUT = 0,
    COLOR = 1 << 0,
    SIZE = 1 << 1,
    SHAPE = 1 << 2,
    INTERSECT = 1 << 3,
    OPTIONS = 1 << 4,
    NO_COMPUTE = 1 << 5,
    ALL = LAYOUT & COLOR & SIZE & SHAPE & INTERSECT & OPTIONS
}

export class UserPanelFormEnum {
    static readonly SIGN_IN = 'SIGN_IN';
    static readonly SIGN_UP = 'SIGN_UP';
    static readonly SIGN_IN_CONFIRM = 'SIGN_IN_CONFIRM';
    static readonly SIGN_UP_CONFIRM = 'SIGN_UP_CONFIRM';
    static readonly CHANGE_PASSWORD = 'CHANGE_PASSWORD';
    static readonly UPDATE_PASSWORD = 'UPDATE_PASSWORD';
    static readonly FORGOT_PASSWORD = 'FORGOT_PASSWORD';
    static readonly PROJECT_LIST = 'PROJECT_LIST';
    static readonly BLANK = 'BLANK';
}

export class SpriteMaterialEnum {
    static readonly BLAST = './assets/shapes/shape-blast-solid-legend.png';
    static readonly BLOB = './assets/shapes/shape-blob-solid-legend.png';
    static readonly CIRCLE = './assets/shapes/shape-circle-solid-legend.png';
    static readonly DIAMOND = './assets/shapes/shape-diamond-solid-legend.png';
    static readonly POLYGON = './assets/shapes/shape-polygon-solid-legend.png';
    static readonly SQUARE = './assets/shapes/shape-square-solid-legend.png';
    static readonly STAR = './assets/shapes/shape-star-solid-legend.png';
    static readonly TRIANGLE = './assets/shapes/shape-triangle-solid-legend.png';
    static readonly NA = './assets/shapes/shape-na-solid-legend.png';
}

export const enum ShapeEnum {
    CIRCLE = 1 << 1,
    SQUARE = 1 << 2,
    TRIANGLE = 1 << 3,
    CONE = 1 << 4,
    BOX = 1 << 5,
    NA = 1 << 6
}

export const enum SizeEnum {
    S = 1,
    M = 2,
    L = 3,
    XL = 4
}

export const enum GraphEnum {
    GRAPH_A = 1 << 0,
    GRAPH_B = 1 << 1,
    EDGES = 1 << 2
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
    SAMPLE = 1 << 0,
    PATIENT = 1 << 2,
    CNV = 1 << 3,    // CNV_THD - CNV === Gistic + CNV_THD === GISTIC_THRESHOLD
    GISTIC = 1 << 4,
    GISTIC_THRESHOLD = 1 << 5,
    MUTATION = 1 << 6,
    MIRNA = 1 << 7,
    MRNA = 1 << 8,
    PROTEIN = 1 << 9,  // EXP - PROTEIN, MIRNA, RNA
    METH = 1 << 10,
    GENE_FAMILY = 1 << 11,
    GENE_TYPE = 1 << 12,
    HIC = 1 << 13,
    EVENT = 1 << 14,
    RNA = 1 << 15,
    TAD = 1 << 16,
    GENE_NAME = 1 << 17,
    // tslint:disable-next-line:no-bitwise
    EXP = CollectionTypeEnum.PROTEIN | CollectionTypeEnum.MIRNA | CollectionTypeEnum.MRNA,
    // Molec Data Field Tables (use to determine the color options and decorators)
    MOLEC_DATA_FIELD_TABLES = CollectionTypeEnum.RNA | CollectionTypeEnum.MRNA |
    CollectionTypeEnum.GISTIC | CollectionTypeEnum.GISTIC_THRESHOLD |
    CollectionTypeEnum.GENE_TYPE | CollectionTypeEnum.GENE_NAME,
    // tslint:disable-next-line:no-bitwise
    MOLECULAR = CollectionTypeEnum.CNV | CollectionTypeEnum.GISTIC |
    CollectionTypeEnum.GISTIC_THRESHOLD | CollectionTypeEnum.MIRNA |
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
export class ConnectionTypeEnum {
    static readonly NONE = 'None';
    static readonly UNKNOWN = 'Unknown';
    static readonly PATIENTS_PATIENTS = 'PATIENTS-PATIENTS';
    static readonly SAMPLES_SAMPLES = 'SAMPLES-SAMPLES';
    static readonly GENES_GENES = 'GENES-GENES';
    static readonly SAMPLES_PATIENTS = 'PATIENTS-SAMPLES';
    static readonly GENES_SAMPLES = 'GENES-SAMPLES';
    static readonly GENES_PATIENTS = 'GENES-PATIENTS';
    static createFromEntities(entityA: EntityTypeEnum, entityB: EntityTypeEnum): ConnectionTypeEnum {
        const entities = [entityA, entityB].sort().map(v => v.toString().toUpperCase()).join('-');
        switch (entities) {
            case ConnectionTypeEnum.PATIENTS_PATIENTS: return ConnectionTypeEnum.PATIENTS_PATIENTS;
            case ConnectionTypeEnum.GENES_GENES: return ConnectionTypeEnum.GENES_GENES;
            case ConnectionTypeEnum.GENES_PATIENTS: return ConnectionTypeEnum.GENES_PATIENTS;
            case ConnectionTypeEnum.GENES_SAMPLES: return ConnectionTypeEnum.GENES_SAMPLES;
            case ConnectionTypeEnum.PATIENTS_PATIENTS: return ConnectionTypeEnum.PATIENTS_PATIENTS;
            case ConnectionTypeEnum.SAMPLES_PATIENTS: return ConnectionTypeEnum.SAMPLES_PATIENTS;
            case ConnectionTypeEnum.SAMPLES_SAMPLES: return ConnectionTypeEnum.SAMPLES_SAMPLES;
        }
        return ConnectionTypeEnum.NONE;
    }
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
    ONE_D = 1 << 0,
    TWO_D = 1 << 1,
    SINGLE = 1 << 2,
    MISC = 1 << 3
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
    DECOMPOSITION = -1,
    MANIFOLDLEARNING = -2,
    SUPPORT_VECTOR_MACHINES = -3,
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
    QUADRATIC_DISCRIMINANT_ANALYSIS = 274877906944,
    DENDOGRAM = 549755813888,
    SPREADSHEET = 1099511627776,
    SPARSE_CODER = 2199023255552,
    HAZARD = 4398046511104,
    DASHBOARD = 8796093022208
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
    SELECT = 1 << 0,
    MOVE = 1 << 1,
    ROTATE = 1 << 2,
    ZOOM = 1 << 3,
    INSERT_ANNOTATION = 1 << 4
}

export const enum GraphActionEnum {
    VISIBILITY_TOGGLE = 1 << 0,
    DEPTH_TOGGLE = 1 << 1,
    SAVE_COHORT = 1 << 2,
    SET_COLOR = 1 << 3,
    SET_SHAPE = 1 << 4,
    SET_SIZE = 1 << 5
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

export const enum PanelEnum {
    NONE = 1 << 0,
    LANDING = 1 << 1,
    DATA = 1 << 2,
    ANALYSIS = 1 << 3,
    COHORT = 1 << 4,
    GENESET = 1 << 5,
    COLOR = 1 << 6,
    HELP = 1 << 7,
    SETTINGS = 1 << 8,
    ABOUT = 1 << 9,
    CITATION = 1 << 10,
    DOCUMENTATION = 1 << 12,
    DASHBOARD = 2048,
    PATHWAYS = 1 << 13,
    FEEDBACK = 1 << 14,
    UPLOAD = 1 << 15,
    SPREADSHEET = 1099511627776
}

// Panels
export const enum SinglePanelEnum {
    SHOW = 1,
    HIDE = 0
}

export const enum GraphPanelEnum {
    NONE = 0,
    GRAPH_A = 1 << 0,
    GRAPH_B = 1 << 1
}
