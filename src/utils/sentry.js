import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN || "https://your-sentry-dsn@sentry.io/project-id",
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});

export default Sentry;