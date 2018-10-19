import * as graph from 'app/action/graph.action';
import * as e from 'app/model/enum.model';
// tslint:disable-next-line:max-line-length
import {
  COMPUTE_BOX_WHISKERS_COMPLETE,
  COMPUTE_CHROMOSOME_COMPLETE,
  COMPUTE_DA_COMPLETE,
  COMPUTE_DENDOGRAM_COMPLETE,
  COMPUTE_DE_COMPLETE,
  COMPUTE_DICTIONARY_LEARNING_COMPLETE,
  COMPUTE_FAST_ICA_COMPLETE,
  COMPUTE_FA_COMPLETE,
  COMPUTE_GENOME_COMPLETE,
  COMPUTE_HAZARD_COMPLETE,
  COMPUTE_HEATMAP_COMPLETE,
  COMPUTE_HIC_COMPLETE,
  COMPUTE_ISO_MAP_COMPLETE,
  COMPUTE_LDA_COMPLETE,
  COMPUTE_LINKED_GENE_COMPLETE,
  COMPUTE_LOCAL_LINEAR_EMBEDDING_COMPLETE,
  COMPUTE_MDS_COMPLETE,
  COMPUTE_NMF_COMPLETE,
  COMPUTE_NONE_COMPLETE,
  COMPUTE_PARALLEL_COORDS_COMPLETE,
  COMPUTE_PATHWAYS_COMPLETE,
  COMPUTE_PCA_COMPLETE,
  COMPUTE_PCA_INCREMENTAL_COMPLETE,
  COMPUTE_PCA_KERNAL_COMPLETE,
  COMPUTE_PCA_SPARSE_COMPLETE,
  COMPUTE_PLSR_COMPLETE,
  COMPUTE_SOM_COMPLETE,
  COMPUTE_SPECTRAL_EMBEDDING_COMPLETE,
  COMPUTE_SURVIVAL_COMPLETE,
  COMPUTE_TIMELINES_COMPLETE,
  COMPUTE_TRUNCATED_SVD_COMPLETE,
  COMPUTE_TSNE_COMPLETE,
  COMPUTE_UMAP_COMPLETE,
  COMPUTE_SCATTER_COMPLETE,
  COMPUTE_PLS_REGRESSION_COMPLETE,
  COMPUTE_PLS_CANONICAL_COMPLETE,
  COMPUTE_PLS_SVD_COMPLETE,
  COMPUTE_CCA_COMPLETE,
  COMPUTE_LINEAR_SVC_COMPLETE,
  COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS_COMPLETE,
  COMPUTE_LINEAR_SVR_COMPLETE
} from './../action/compute.action';
import { UnsafeAction } from './../action/unsafe.action';
import { DataCollection } from './../model/data-collection.model';
import { DataDecorator } from './../model/data-map.model';
import { DataSet } from './../model/data-set.model';
import { GraphConfig } from './../model/graph-config.model';
import { SelectionToolConfig } from 'app/model/selection-config.model';

// Visibility / DataFields / Depth / Visualization / Config
export interface State {
  dataSet: DataSet;
  dataCollection: DataCollection;
  visualizationType: e.VisualizationEnum;
  selectionToolConfig: SelectionToolConfig;
  config: GraphConfig;
  decorators: Array<DataDecorator>;
  depth: e.DepthEnum;
  visibility: e.VisibilityEnum;
  data: any;
}

const initialState: State = {
  dataSet: null,
  dataCollection: null,
  visualizationType: e.VisualizationEnum.NONE,
  selectionToolConfig: SelectionToolConfig.createDefault(),
  depth: null,
  visibility: e.VisibilityEnum.HIDE,
  config: null,
  decorators: [],
  data: null
};

function processAction(action: UnsafeAction, state: State): State {
  switch (action.type) {
    case COMPUTE_NONE_COMPLETE:
    case COMPUTE_PATHWAYS_COMPLETE:
    case COMPUTE_TIMELINES_COMPLETE:
    case COMPUTE_DENDOGRAM_COMPLETE:
    case COMPUTE_HEATMAP_COMPLETE:
    case COMPUTE_BOX_WHISKERS_COMPLETE:
    case COMPUTE_PARALLEL_COORDS_COMPLETE:
    case COMPUTE_LINKED_GENE_COMPLETE:
    case COMPUTE_HIC_COMPLETE:
    case COMPUTE_PCA_COMPLETE:
    case COMPUTE_CHROMOSOME_COMPLETE:
    case COMPUTE_GENOME_COMPLETE:
    case COMPUTE_PLSR_COMPLETE:
    case COMPUTE_SOM_COMPLETE:
    case COMPUTE_MDS_COMPLETE:
    case COMPUTE_TSNE_COMPLETE:
    case COMPUTE_UMAP_COMPLETE:
    case COMPUTE_SCATTER_COMPLETE:
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
    case COMPUTE_HAZARD_COMPLETE:
    case COMPUTE_PLS_CANONICAL_COMPLETE:
    case COMPUTE_PLS_REGRESSION_COMPLETE:
    case COMPUTE_PLS_SVD_COMPLETE:
    case COMPUTE_CCA_COMPLETE:
    case COMPUTE_LINEAR_SVC_COMPLETE:
    case COMPUTE_LINEAR_DISCRIMINANT_ANALYSIS_COMPLETE:
    case COMPUTE_SURVIVAL_COMPLETE:
    case COMPUTE_PLS_SVD_COMPLETE:
    case COMPUTE_PLS_REGRESSION_COMPLETE:
    case COMPUTE_PLS_CANONICAL_COMPLETE:
    case COMPUTE_CCA_COMPLETE:
    case COMPUTE_LINEAR_SVC_COMPLETE:
    case COMPUTE_LINEAR_SVR_COMPLETE:
      return Object.assign({}, state, {
        data: action.payload.data,
        config: action.payload.config
      });
    // case COMPUTE_DECORATOR_UPDATE:
    //     return Object.assign({}, state, { decorators: (action as compute.DecoratorUpdateAction).payload.decorators });
    case graph.SELECTION_TOOL_CHANGE:
      return Object.assign({}, state, {
        selectionToolConfig: action.payload.selectionTool
      });
    case graph.VISIBILITY_TOGGLE:
      return Object.assign({}, state, { visibility: action.payload.data });
    case graph.DEPTH_TOGGLE:
      return Object.assign({}, state, { depth: action.payload.data });
    case graph.VISUALIZATION_TYPE_SET:
      return Object.assign({}, state, { visualization: action.payload.data });
    case graph.VISUALIZATION_COMPLETE:
      return Object.assign({}, state, { chartObject: action.payload.data });
    case graph.DATA_DECORATOR_ADD:
      const decorator = action.payload.decorator;
      const decorators = state.decorators.filter(
        v => v.type !== decorator.type
      );
      decorators.push(decorator);
      return Object.assign({}, state, { decorators: decorators });
    case graph.DATA_DECORATOR_DEL:
      return Object.assign({}, state, {
        decorators: state.decorators.filter(
          v => v.type !== action.payload.decorator.type
        )
      });
    case graph.DATA_DECORATOR_DEL_ALL:
      return Object.assign({}, state, { decorators: [] });
    default:
      return state;
  }
}
export function graphReducerA(
  state = initialState,
  action: UnsafeAction
): State {
  if (action.payload === undefined) {
    return state;
  }
  if (action.payload.config === undefined) {
    return state;
  }
  if (action.payload.config.graph !== e.GraphEnum.GRAPH_A) {
    return state;
  }
  return processAction(action, state);
}

export function graphReducerB(
  state = initialState,
  action: UnsafeAction
): State {
  if (action.payload === undefined) {
    return state;
  }
  if (action.payload.config === undefined) {
    return state;
  }
  if (action.payload.config.graph !== e.GraphEnum.GRAPH_B) {
    return state;
  }
  return processAction(action, state);
}
