import { environment } from '@env/environment';
import * as Sentry from '@sentry/angular';
import logger from 'pino';

class LogData {
  service: string;

  constructor(name) {
    this.service = name;
  }

  add(data) {
    return {data, service: this.service};
  }
}

const log = logger({
  browser: {
    write: {
      info: (info) => {
        if (environment.env !== 'prod') {
          // eslint-disable-next-line no-console
          console.info(info);
        }
      },
      warn: (warn) => {
        if (environment.env !== 'prod') {
          console.warn(warn);
        }
      },
      error: (error) => {
        if (environment.env !== 'prod') {
          console.error(error);
        }

        if (environment.sentry) {
          Sentry.captureException(error);
        }
      },
    },
    asObject: true,
    serialize: true,
  },
});

export default Object.assign(log, {
  logContent: (serviceName) => new LogData(serviceName),
});
