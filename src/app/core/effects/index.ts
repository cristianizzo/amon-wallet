import { ChainEffects } from '@app/core/effects/chain';
import { LanguageEffects } from '@app/core/effects/language';
import { WalletEffects } from '@app/core/effects/wallet';
import { ThemeEffects } from '@app/core/effects/theme';
import { CurrencyEffects } from '@app/core/effects/currency';
import { TokenEffects } from '@app/core/effects/token';
import { FormEffects } from '@app/core/effects/form';

export const effects = [
  ChainEffects,
  LanguageEffects,
  WalletEffects,
  ThemeEffects,
  CurrencyEffects,
  TokenEffects,
  FormEffects,
];
