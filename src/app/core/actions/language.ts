import { createAction } from '@ngrx/store';
import { LanguageModel } from '@models/language.model';
import { type } from '@app/core/util';

export const languageActionTypes = {
  initLanguage: type('[Language] init language'),
  switchLanguage: type('[Language] switch language'),
  getLanguage: type('[Language] get language'),
  updateStateLanguages: type('[Language] update state languages'),
};

export const initLanguage = createAction(languageActionTypes.initLanguage);

export const switchLanguage = createAction(
  languageActionTypes.switchLanguage,
  (language: LanguageModel) => ({ language })
);

export const updateStateLanguages = createAction(
  languageActionTypes.updateStateLanguages,
  (languages: LanguageModel[]) => ({ languages })
);
