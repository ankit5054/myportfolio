import * as Sentry from "@sentry/react";

const logger = {
  info: (message, extra = {}) => {
    console.log(message, extra);
    Sentry.addBreadcrumb({
      message,
      level: 'info',
      data: extra,
    });
  },

  warn: (message, extra = {}) => {
    console.warn(message, extra);
    Sentry.addBreadcrumb({
      message,
      level: 'warning',
      data: extra,
    });
  },

  error: (message, error = null, extra = {}) => {
    console.error(message, error, extra);
    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: { component: 'frontend' },
        extra: { message, ...extra },
      });
    } else {
      Sentry.captureMessage(message, 'error');
    }
  },

  debug: (message, extra = {}) => {
    console.debug(message, extra);
    Sentry.addBreadcrumb({
      message,
      level: 'debug',
      data: extra,
    });
  },
};

export default logger;