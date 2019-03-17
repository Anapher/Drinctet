const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: { '@core': path.resolve(__dirname, 'src/core') },
  };

  return config;
};