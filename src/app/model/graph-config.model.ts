import { DataField } from 'app/model/data-field.model';
import { GraphEnum, VisualizationEnum } from 'app/model/enum.model';
import { DataFieldFactory, DataTable } from './data-field.model';
import { EntityTypeEnum } from './enum.model';
import { GraphData } from './graph-data.model';

/**
 * Represents The Graph Config
 */
export interface Graph {
    config: GraphConfig;
    data: GraphData;
}

export class GraphConfig {

    // TODO: Bad Bad Bad...  Need to fix this.
    public static database = 'gbm';

    dirtyFlag = 1;
    visualization: VisualizationEnum;
    entity: EntityTypeEnum;
    graph: GraphEnum;
    table: DataTable;
    label = '';
    enableCohorts = true;
    enableGenesets = true;
    enablePathways = false;
    enableSupplemental = true;
    enableLabel = true;
    enableColor = true;
    enableShape = true;

    patientSelect: Array<string> = [];
    patientFilter: Array<string> = [];
    sampleSelect: Array<string> = [];
    markerSelect: Array<string> = [];
    sampleFilter: Array<string> = [];

    cohortName = 'All Patients';
    markerName = 'Pathways in Cancer';
    pathwayName = 'integrated cancer pathway';
    pathwayUri = 'https://oncoscape.v3.sttrcancer.org/data/pathways/http___identifiers.org_panther.pathway_P02742.json.gz';

    // Default Genes Listed Are 'KEGG Pathways In Cancer'
    markerFilter: Array<string> = ['ABL1', 'AKT1', 'AKT2', 'AKT3', 'APC', 'APC2', 'APPL1', 'AR', 'ARAF', 'ARNT', 'ARNT2', 'AXIN1',
        'AXIN2', 'BAD', 'BAX', 'BCL2', 'BCL2L1', 'BCR', 'BID', 'BIRC2', 'BIRC3', 'BIRC5', 'BMP2', 'BMP4', 'BRAF', 'BRCA2', 'CASP3',
        'CASP8', 'CASP9', 'CBL', 'CBLB', 'CBLC', 'CCDC6', 'CCNA1', 'CCND1', 'CCNE1', 'CCNE2', 'CDC42', 'CDH1', 'CDK2', 'CDK4', 'CDK6',
        'CDKN1A', 'CDKN1B', 'CDKN2A', 'CDKN2B', 'CEBPA', 'CHUK', 'CKS1B', 'COL4A1', 'COL4A2', 'COL4A4', 'COL4A6', 'CREBBP', 'CRK', 'CRKL',
        'CSF1R', 'CSF2RA', 'CSF3R', 'CTBP1', 'CTBP2', 'CTNNA1', 'CTNNA2', 'CTNNA3', 'CTNNB1', 'CUL2', 'CYCS', 'DAPK1', 'DAPK2', 'DAPK3',
        'DCC', 'DVL1', 'DVL2', 'DVL3', 'E2F1', 'E2F2', 'E2F3', 'EGF', 'EGFR', 'EGLN1', 'EGLN2', 'EGLN3', 'EP300', 'EPAS1', 'ERBB2', 'ETS1',
        'FADD', 'FAS', 'FASLG', 'FGF1', 'FGF10', 'FGF11', 'FGF12', 'FGF13', 'FGF14', 'FGF16', 'FGF17', 'FGF18', 'FGF19', 'FGF2', 'FGF20'];


    // 'FGF21', 'FGF22', 'FGF23', 'FGF3', 'FGF4', 'FGF5', 'FGF6', 'FGF7', 'FGF8', 'FGF9', 'FGFR1', 'FGFR2', 'FGFR3', 'FH', 'FIGF', 'FLT3',
    // 'FLT3LG', 'FN1', 'FOS', 'FOXO1', 'FZD1', 'FZD10', 'FZD2', 'FZD3', 'FZD4', 'FZD5', 'FZD6', 'FZD7', 'FZD8', 'FZD9', 'GLI1', 'GLI2',
    // 'GLI3', 'GRB2', 'GSK3B', 'GSTP1', 'HDAC1', 'HDAC2', 'HGF', 'HHIP', 'HIF1A', 'HRAS', 'HSP90AA1', 'HSP90AB1', 'HSP90B1', 'IGF1',
    // 'IGF1R', 'IKBKB', 'IKBKG', 'IL6', 'IL8', 'ITGA2', 'ITGA2B', 'ITGA3', 'ITGA6', 'ITGAV', 'ITGB1', 'JAK1', 'JUN', 'JUP', 'KIT',
    // 'KITLG', 'KLK3', 'KRAS', 'LAMA1', 'LAMA2', 'LAMA3', 'LAMA4', 'LAMA5', 'LAMB1', 'LAMB2', 'LAMB3', 'LAMB4', 'LAMC1', 'LAMC2', 'LAMC3'];
    // 'LEF1', 'LOC652346', 'LOC652671', 'LOC652799', 'MAP2K1', 'MAP2K2', 'MAPK1', 'MAPK10', 'MAPK3', 'MAPK8', 'MAPK9', 'MAX', 'MDM2',
    // 'MECOM', 'MET', 'MITF', 'MLH1', 'MMP1', 'MMP2', 'MMP9', 'MSH2', 'MSH3', 'MSH6', 'MTOR', 'MYC', 'NCOA4', 'NFKB1', 'NFKB2', 'NFKBIA',
    // 'NKX3-1', 'NOS2', 'NRAS', 'NTRK1', 'PAX8', 'PDGFA', 'PDGFB', 'PDGFRA', 'PDGFRB', 'PGF', 'PIAS1', 'PIAS2', 'PIAS3', 'PIAS4',
    // 'PIK3CA', 'PIK3CB', 'PIK3CD', 'PIK3CG', 'PIK3R1', 'PIK3R2', 'PIK3R3', 'PIK3R5', 'PLCG1', 'PLCG2', 'PLD1', 'PML', 'PPARD', 'PPARG',
    // 'PRKCA', 'PRKCB', 'PRKCG', 'PTCH1', 'PTCH2', 'PTEN', 'PTGS2', 'PTK2', 'RAC1', 'RAC2', 'RAC3', 'RAD51', 'RAF1', 'RALA', 'RALB',
    // 'RALBP1', 'RALGDS', 'RARA', 'RARB', 'RASSF1', 'RASSF5', 'RB1', 'RBX1', 'RELA', 'RET', 'RHOA', 'RUNX1', 'RUNX1T1', 'RXRA', 'RXRB',
    // 'RXRG', 'SHH', 'SKP2', 'SLC2A1', 'SMAD2', 'SMAD3', 'SMAD4', 'SMO', 'SOS1', 'SOS2', 'SPI1', 'STAT1', 'STAT3', 'STAT5A', 'STAT5B',
    // 'STK36', 'STK4', 'SUFU', 'TCEB1', 'TCEB2', 'TCF7', 'TCF7L1', 'TCF7L2', 'TFG', 'TGFA', 'TGFB1', 'TGFB2', 'TGFB3', 'TGFBR1', 'TGFBR2',
    // 'TP53', 'TPM3', 'TPR', 'TRAF1', 'TRAF2', 'TRAF3', 'TRAF4', 'TRAF5', 'TRAF6', 'VEGFA', 'VEGFB', 'VEGFC', 'VHL', 'WNT1', 'WNT10A',
    // 'WNT10B', 'WNT11', 'WNT16', 'WNT2', 'WNT2B', 'WNT3', 'WNT3A', 'WNT4', 'WNT5A', 'WNT5B', 'WNT6', 'WNT7A', 'WNT7B', 'WNT8A',
    // 'WNT8B', 'WNT9A', 'WNT9B', 'XIAP', 'ZBTB16'];

    // pointColor: DataField = DataFieldFactory.getUndefined();
    // pointShape: DataField = DataFieldFactory.getUndefined();
    // pointSize: DataField = DataFieldFactory.getUndefined();
    pointIntersect: DataField = DataFieldFactory.getUndefined();
    database: string;

    constructor() {
        this.database = GraphConfig.database;
    }
}
