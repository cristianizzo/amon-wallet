import { Action, createReducer, on } from '@ngrx/store';
import { FormActions } from '@app/core/actions';

export const featureKey = 'form';
const initialState: { loading: boolean } = {
  loading: false,
};

export const formReducer = createReducer(
  initialState,
  on(FormActions.setLoading, (_ = initialState, { status }) => status)
);

export const reducer = (state: { loading: boolean }, action: Action): any =>
  formReducer(state, action);
