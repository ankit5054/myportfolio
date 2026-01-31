// Simple console logger for frontend-only portfolio
const logger = {
  info: (message, extra = {}) => {
    console.log(message, extra);
  },

  warn: (message, extra = {}) => {
    console.warn(message, extra);
  },

  error: (message, error = null, extra = {}) => {
    console.error(message, error, extra);
  },

  debug: (message, extra = {}) => {
    console.debug(message, extra);
  },
};

export default logger;