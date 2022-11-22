import { Action, createReducer, on } from '@ngrx/store';
import { FormActions } from '@app/core/actions';

export const featureKey = 'form';
const initialState: {
  loading: boolean;
  start: boolean;
  end: boolean;
  topLoading: boolean;
} = {
  loading: false,
  topLoading: false,
  start: false,
  end: false,
};

export const formReducer = createReducer(
  initialState,
  on(FormActions.setLoading, (state = initialState, { status }) =>
    Object.assign({}, state, {
      loading: status.loading,
      topLoading: status.topLoading,
    })
  )
  // on(FormActions.formStart, (state = initialState) => {
  //   return Object.assign({}, state, {
  //     start: true,
  //     end: false,
  //     loading: true,
  //   });
  // }),
  // on(FormActions.formEnd, (state = initialState) => {
  //   return Object.assign({}, state, {
  //     end: true,
  //     loading: false,
  //   });
  // }),
);

export const reducer = (state = initialState, action: Action): any =>
  formReducer(state, action);
