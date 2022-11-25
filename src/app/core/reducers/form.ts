import { FormStateModel } from '@core/models';
import { Action, createReducer, on } from '@ngrx/store';
import { FormActions } from '@app/core/actions';

export const featureKey = 'form';
const initialState: FormStateModel = {
  loading: false,
  topLoading: false,
};

export const formReducer = createReducer(
  initialState,
  on(FormActions.setLoading, (state = initialState, { status }) =>
    Object.assign({}, state, {
      loading: status.loading,
      topLoading: status.topLoading,
    })
  )
);

export const reducer = (state = initialState, action: Action): any =>
  formReducer(state, action);
