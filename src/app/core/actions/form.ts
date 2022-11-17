import { createAction } from '@ngrx/store';
import { type } from '@app/core/util';

export const formActionTypes = {
  formSuccess: type('[Form] success'),
  formError: type('[Form] error'),
  setLoading: type('[Form] set loading'),
};

export const formSuccess = createAction(
  formActionTypes.formSuccess,
  (msg: string) => ({ msg })
);

export const formError = createAction(
  formActionTypes.formError,
  (error: any) => ({ error })
);

export const setLoading = createAction(
  formActionTypes.setLoading,
  (status: { loading: boolean }) => ({ status })
);
