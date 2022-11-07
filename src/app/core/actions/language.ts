import { createAction } from '@ngrx/store';
import { LanguageModel } from '@models/language.model';
import { type } from '@app/core/util';

export const languageActionTypes = {
  initLanguage: type('[Language] init language'),
  updateStateLanguages: type('[Language] update state languages'),
  languageError: type('[Language] language error'),
  switchLanguage: type('[Language] switch language'),
  getLanguage: type('[Language] get language'),
};

export const initLanguage = createAction(
  languageActionTypes.initLanguage
);

export const updateStateLanguages = createAction(
  languageActionTypes.updateStateLanguages,
  (languages: LanguageModel[]) => ({languages})
);

export const languageError = createAction(
  languageActionTypes.languageError,
  (error: any) => ({error})
);

export const switchLanguage = createAction(
  languageActionTypes.switchLanguage,
  (language: LanguageModel) => ({language})
);
