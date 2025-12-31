const path = require('path');

module.exports = function override(config) {
  config.ignoreWarnings = [
    {
      module: /node_modules\/@sentry/,
      message: /Failed to parse source map/,
    },
  ];
  return config;
};