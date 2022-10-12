import { InjectionToken } from '@angular/core';
import { EnvModel } from '@models/index';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EnvService = new InjectionToken<EnvModel>('EnvModel');
