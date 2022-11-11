import { ProviderEffects } from '@app/core/effects/provider';
import { LanguageEffects } from '@app/core/effects/language';
import { WalletEffects } from '@app/core/effects/wallet';
import { ThemeEffects } from '@app/core/effects/theme';
import { CurrencyEffects } from '@app/core/effects/currency';
import { TokenEffects } from '@app/core/effects/token';

export const effects = [
  ProviderEffects,
  LanguageEffects,
  WalletEffects,
  ThemeEffects,
  CurrencyEffects,
  TokenEffects,
];
