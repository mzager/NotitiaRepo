import { UnsafeAction } from './../action/unsafe.action';
import { toPayload } from '@ngrx/effects';
import { GraphConfig } from './../model/graph-config.model';
import { DATA_LOADED } from './../action/data.action';
import * as data from 'app/action/data.action';
import * as e from 'app/model/enum.model';
import * as graph from 'app/action/graph.action';
import * as compute from 'app/action/compute.action';
import { COMPUTE_CHROMOSOME, COMPUTE_CHROMOSOME_COMPLETE, COMPUTE_PCA_COMPLETE,
    COMPUTE_GRAPH_COLOR, COMPUTE_GRAPH_SHAPE, COMPUTE_GRAPH_SIZE,
    COMPUTE_GRAPH_SHAPE_COMPLETE, COMPUTE_GRAPH_SIZE_COMPLETE,
    COMPUTE_GRAPH_COLOR_COMPLETE, COMPUTE_CHROMOSOME_RING_COMPLETE,
    COMPUTE_TSNE_COMPLETE, COMPUTE_PLSR_COMPLETE, COMPUTE_HEATMAP_COMPLETE,
    COMPUTE_SOM_COMPLETE, COMPUTE_DA_COMPLETE, COMPUTE_DE_COMPLETE,
    COMPUTE_MDS_COMPLETE, COMPUTE_FA_COMPLETE, COMPUTE_NMF_COMPLETE,
    COMPUTE_LDA_COMPLETE, COMPUTE_DICTIONARY_LEARNING_COMPLETE,
    COMPUTE_FAST_ICA_COMPLETE, COMPUTE_TRUNCATED_SVD_COMPLETE,
    COMPUTE_LOCAL_LINEAR_EMBEDDING_COMPLETE, COMPUTE_ISO_MAP_COMPLETE,
    COMPUTE_SPECTRAL_EMBEDDING_COMPLETE, COMPUTE_PCA_INCREMENTAL_COMPLETE,
    COMPUTE_PCA_KERNAL_COMPLETE, COMPUTE_PCA_SPARSE_COMPLETE} from './../action/compute.action';
import { DataCollection } from './../model/data-collection.model';
import { DataField } from 'app/model/data-field.model';
import { DataSet } from './../model/data-set.model';

// Visibility / DataFields / Depth / Visualization / Config
export interface State {
    dataSet: DataSet;
    dataCollection: DataCollection;
    visualizationType: e.VisualizationEnum;
    config: GraphConfig;
    depth: e.DepthEnum;
    visibility: e.VisibilityEnum;
    data: any;
}

const initialState: State = {
    dataSet: null,
    dataCollection: null,
    visualizationType: e.VisualizationEnum.NONE,
    depth: null,
    visibility: e.VisibilityEnum.HIDE,
    config: null,
    data: null
};

function processAction(action: UnsafeAction, state: State): State {
    console.log(action.type);
    switch (action.type) {
        case COMPUTE_HEATMAP_COMPLETE:
        case COMPUTE_PCA_COMPLETE:
        case COMPUTE_CHROMOSOME_COMPLETE:
        case COMPUTE_PLSR_COMPLETE:
        case COMPUTE_SOM_COMPLETE:
        case COMPUTE_MDS_COMPLETE:
        case COMPUTE_TSNE_COMPLETE:
        case COMPUTE_DA_COMPLETE:
        case COMPUTE_DE_COMPLETE:
        case COMPUTE_FA_COMPLETE:
        case COMPUTE_NMF_COMPLETE:
        case COMPUTE_LDA_COMPLETE:
        case COMPUTE_DICTIONARY_LEARNING_COMPLETE:
        case COMPUTE_FAST_ICA_COMPLETE:
        case COMPUTE_TRUNCATED_SVD_COMPLETE:
        case COMPUTE_LOCAL_LINEAR_EMBEDDING_COMPLETE:
        case COMPUTE_ISO_MAP_COMPLETE:
        case COMPUTE_SPECTRAL_EMBEDDING_COMPLETE:
        case COMPUTE_PCA_SPARSE_COMPLETE:
        case COMPUTE_PCA_INCREMENTAL_COMPLETE:
        case COMPUTE_PCA_KERNAL_COMPLETE:
            return Object.assign({}, state, { data: action.payload.data, config: action.payload.config });
        case graph.VISIBILITY_TOGGLE:
            return Object.assign({}, state, { visibility: action.payload.data});
        case graph.DEPTH_TOGGLE:
            return Object.assign({}, state, { depth: action.payload.data});
        case graph.VISUALIZATION_TYPE_SET:
            return Object.assign({}, state, { visualization: action.payload.data });
        case graph.VISUALIZATION_COMPLETE:
            return Object.assign({}, state, { chartObject: action.payload.data });
        default:
            return state;
    }
}
export function graphReducerA(state = initialState, action: UnsafeAction): State {
        if (action.payload === undefined) { return state; }
        if (action.payload.config === undefined ) { return state; }
        if (action.payload.config.graph !== e.GraphEnum.GRAPH_A) { return state; }
       return processAction(action, state);
}

export function graphReducerB(state = initialState, action: UnsafeAction): State {
    if (action.payload === undefined) { return state; }
    if (action.payload.config === undefined ) { return state; }
    if (action.payload.config.graph !== e.GraphEnum.GRAPH_B) { return state; }
    return processAction(action, state);
}
