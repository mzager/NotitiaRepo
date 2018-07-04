import { UnsafeAction } from './../action/unsafe.action';
import { VisualizationEnum } from '../model/enum.model';
import * as tip from 'app/action/tip.action';

export interface State {
  tipVisualization: VisualizationEnum;
  visible: boolean;
  enabled: boolean;
  tip: any;
}

const initialState: State = {
  tipVisualization: VisualizationEnum.NONE,
  visible: false,
  enabled: true,
  tip: null
};

export function reducer(state = initialState, action: UnsafeAction): State {
  switch (action.type) {
    case tip.TIP_SET_VISUALIZATION_COMPLETE:
      return Object.assign({}, state, { tip: action.payload, visible: true });
    case tip.TIP_SET_ENABLED:
      return Object.assign({}, state, { enabled: action.payload });
    case tip.TIP_SET_VISIBLE:
      return Object.assign({}, state, { visible: action.payload });
    default:
      return state;
  }
}

export const getTip = (state: State) => state.tip;
export const getTipVisible = (state: State) => state.visible;
export const getTipEnabled = (state: State) => state.enabled;
export const getTipVisualization = (state: State) => state.tipVisualization;
