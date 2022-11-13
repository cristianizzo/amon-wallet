import { environment } from '@env/environment';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

const sentryKey = environment.sentry;

if (sentryKey && sentryKey.length > 0) {
  Sentry.init({
    dsn: sentryKey,
    release: `${environment.gitHashCommit}`,
    tracesSampleRate: 1.0,
    environment: environment.env,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: [window.location.origin, environment.host],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
  });
}
