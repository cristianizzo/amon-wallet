import { NetworkEffects } from '@app/core/effects/network';
import { LanguageEffects } from '@app/core/effects/language';
import { WalletEffects } from '@app/core/effects/wallet';
import { ThemeEffects } from '@app/core/effects/theme';
import { CurrencyEffects } from '@app/core/effects/currency';
import { TokenEffects } from '@app/core/effects/token';
import { FormEffects } from '@app/core/effects/form';

export const effects = [
  NetworkEffects,
  LanguageEffects,
  WalletEffects,
  ThemeEffects,
  CurrencyEffects,
  TokenEffects,
  FormEffects,
];
