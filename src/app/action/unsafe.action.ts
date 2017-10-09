import { Action } from '@ngrx/store';
export interface UnsafeAction extends Action {
  payload?: any;
}
