export interface EnvModel {
  host?: string;
  gitHashCommit?: string;
  env?: string; // local | dev | prod
  production: boolean;
  version?: string;
  versionCode?: string;
  defaultWalletName?: string;
  defaultLanguage?: string;
  defaultCurrency?: string;
  network?: string;
  theme?: string;
  sentry?: string;
  termsWalletVersion?: string;
  blockchainHighFee?: number;
  languages?: any;
  coinGeckoUri?: any;
  defaultChain?: any;
  defaultChainId?: any;
}
