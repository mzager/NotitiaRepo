import { SelectionToolConfig } from 'app/model/selection-config.model';
import { GraphConfig } from './../model/graph-config.model';
import { DataDecorator } from './../model/data-map.model';
import { WorkspaceConfigModel } from './../model/workspace.model';
import {
  PcaConfigModel,
  PcaDataModel
} from './../component/visualization/pca/pca.model';
import { COMPUTE_PCA_COMPLETE } from './compute.action';
import { Action } from '@ngrx/store';
import { DataField } from 'app/model/data-field.model';
import {
  GraphEnum,
  DataTypeEnum,
  VisibilityEnum,
  DepthEnum,
  VisualizationEnum
} from 'app/model/enum.model';

// Actions Consts
export const WORKSPACE_CONFIG = '[GRAPH] Workspace Config Set';
export const DATA_TYPE_SET = '[GRAPH] Data Type Set';
export const VISUALIZATION_TYPE_SET = '[GRAPH] Visualization Type Set';
export const VISIBILITY_TOGGLE = '[GRAPH] Visibility Toggle';
export const DEPTH_TOGGLE = '[GRAPH] Depth Toggle';
export const SAVE_COHORT = '[GRAPH] Save Cohort';
export const INSERT_ANNOTATION = '[GRAPH] Insert Annotation';
export const VISUALIZATION_COMPLETE = '[GRAPH] Visualization Complete';
export const DATA_DECORATOR_ADD = '[GRAPH] Data Decorator Add';
export const DATA_DECORATOR_DEL = '[GRAPH] Data Decorator Remove';
export const DATA_DECORATOR_CREATE = '[GRAPH] Data Decorator Create';
export const DATA_DECORATOR_DEL_ALL = '[GRAPH] Data Decorator Remove All';
export const SELECTION_TOOL_CHANGE = '[GRAPH] Selection Tool Change';

// Action Classes
export class WorkspaceConfigAction implements Action {
  readonly type: string = WORKSPACE_CONFIG;
  constructor(public payload: WorkspaceConfigModel) {}
}
export class DataSetAction implements Action {
  readonly type: string = DATA_TYPE_SET;
  constructor(public payload: { graph: GraphEnum; data: DataTypeEnum }) {}
}
export class VisualizationSetAction implements Action {
  readonly type: string = VISUALIZATION_TYPE_SET;
  constructor(public payload: { graph: GraphEnum; data: VisualizationEnum }) {}
}
export class VisibilityToggleAction implements Action {
  readonly type: string = VISIBILITY_TOGGLE;
  constructor(public payload: { graph: GraphEnum; data?: any }) {}
}
export class DepthToggleAction implements Action {
  readonly type: string = DEPTH_TOGGLE;
  constructor(public payload: { graph: GraphEnum; data?: any }) {}
}
export class VisualizationCompleteAction implements Action {
  readonly type: string = VISUALIZATION_COMPLETE;
  constructor(
    public payload: { graph: GraphEnum; visualization: GraphEnum; data: any }
  ) {}
}
export class SelectionToolChangeAction implements Action {
  readonly type: string = SELECTION_TOOL_CHANGE;
  constructor(
    public payload: { config: GraphConfig; selectionTool: SelectionToolConfig }
  ) {}
}
export class DataDecoratorCreateAction implements Action {
  readonly type: string = DATA_DECORATOR_CREATE;
  constructor(
    public payload: { config: GraphConfig; decorator: DataDecorator }
  ) {}
}
export class DataDecoratorDelAction implements Action {
  readonly type: string = DATA_DECORATOR_DEL;
  constructor(
    public payload: { config: GraphConfig; decorator: DataDecorator }
  ) {}
}
export class DataDecoratorDelAllAction implements Action {
  readonly type: string = DATA_DECORATOR_DEL_ALL;
  constructor(public payload: { config: GraphConfig }) {}
}
export class DataDecoratorAddAction implements Action {
  readonly type: string = DATA_DECORATOR_ADD;
  constructor(
    public payload: { config: GraphConfig; decorator: DataDecorator }
  ) {}
}

// Action Type
export type Actions =
  | DataSetAction
  | VisualizationSetAction
  | VisibilityToggleAction
  | DepthToggleAction
  | VisualizationCompleteAction
  | DataDecoratorCreateAction
  | DataDecoratorAddAction
  | DataDecoratorDelAction
  | DataDecoratorDelAllAction
  | SelectionToolChangeAction;
