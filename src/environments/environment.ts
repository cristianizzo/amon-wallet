import commonConfig from './common';
import { EnvModel } from '@app/models';

// @ts-ignore
const config: EnvModel = commonConfig.getConfigObject(process.env);

if (config.env === 'local') {
  console.log(config);
}

export const environment: EnvModel = config;
