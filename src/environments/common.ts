import { configParser } from './utils';

const getConfigObject = (sourceConfig) => ({
  host: configParser(
    sourceConfig,
    'string',
    'NG_APP_HOST',
    window.location.origin
  ),
  gitHashCommit: configParser(sourceConfig, 'string', 'NG_APP_COMMIT', null),
  env: configParser(sourceConfig, 'string', 'NG_APP_ENV', 'local'), // local | dev | prod
  production: configParser(sourceConfig, 'bool', 'NG_APP_PROD_BUILD', false),
  version: configParser(sourceConfig, 'string', 'NG_APP_VERSION', '0.0.1'),
  versionCode: configParser(
    sourceConfig,
    'string',
    'NG_APP_VERSION_CODE',
    '0000000'
  ),
  defaultLanguage: configParser(
    sourceConfig,
    'string',
    'NG_APP_DEFAULT_LANGUAGE',
    'en'
  ),
  defaultCurrency: configParser(
    sourceConfig,
    'string',
    'NG_APP_DEFAULT_CURRENCY',
    'USD'
  ),
  theme: configParser(sourceConfig, 'string', 'NG_APP_THEME', 'light'),
  sentry: configParser(sourceConfig, 'string', 'NG_APP_SENTRY_DSN', null),
  termsWalletVersion: configParser(
    sourceConfig,
    'string',
    'NG_APP_TERMS_WALLET_VERSION',
    '1.1.0'
  ),
  languages: configParser(sourceConfig, 'array', 'NG_APP_LANGUAGES', [
    'en',
    'it',
  ]),
  defaultWalletName: configParser(
    sourceConfig,
    'string',
    'NG_APP_DEFAULT_WALLET_NAME',
    'EVM Account 1'
  ),
  coinGeckoUri: configParser(
    sourceConfig,
    'string',
    'NG_APP_COINGECKO_URI',
    'https://api.coingecko.com/api/v3'
  ),
  defaultNetwork: configParser(
    sourceConfig,
    'string',
    'NG_APP_DEFAULT_NETWORK',
    'ETH'
  ),
  defaultChainId: configParser(
    sourceConfig,
    'number',
    'NG_APP_DEFAULT_CHAIN_ID',
    5
  ),
});

export default { getConfigObject };
