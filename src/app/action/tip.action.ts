import { Action } from '@ngrx/store';
import { VisualizationEnum } from '../model/enum.model';

// Actions Consts
export const TIP_SET_VISUALIZATION = '[TIP] Set Visualization';
export const TIP_SET_VISUALIZATION_COMPLETE = '[TIP] Set Visualization Complete';
export const TIP_SET_ENABLED = '[TIP] Set Enabled';
export const TIP_SET_VISIBLE = '[TIP] Set Visible';

// Action Classes
export class TipSetVisualizationAction implements Action {
  readonly type: string = TIP_SET_VISUALIZATION;
  constructor(public payload: VisualizationEnum) {}
}
export class TipSetVisualizationCompleteAction implements Action {
  readonly type: string = TIP_SET_VISUALIZATION_COMPLETE;
  constructor(public payload: any) {}
}

export class TipSetEnabledAction implements Action {
  readonly type: string = TIP_SET_ENABLED;
  constructor(public payload: boolean) {}
}

export class TipSetVisibleAction implements Action {
  readonly type: string = TIP_SET_VISIBLE;
  constructor(public payload: boolean) {}
}

// Action Type
export type Actions =
  | TipSetVisualizationAction
  | TipSetVisualizationCompleteAction
  | TipSetEnabledAction
  | TipSetVisibleAction;
