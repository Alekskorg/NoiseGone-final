const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'src/styles');
    return config;
  },
};

