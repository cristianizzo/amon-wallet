import { createAction } from '@ngrx/store';
import { type } from '@app/core/util';

export const formActionTypes = {
  formStart: type('[Form] start'),
  formEnd: type('[Form] end'),
  formSuccess: type('[Form] success'),
  formError: type('[Form] error'),
  setLoading: type('[Form] set loading'),
};

export const formStart = createAction(
  formActionTypes.formStart,
  ({ loading = false, topLoading = false }) => ({ loading, topLoading })
);

export const formEnd = createAction(formActionTypes.formEnd);

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
  (status: { topLoading?: boolean; loading?: boolean }) => ({ status })
);
