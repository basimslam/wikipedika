const Dotenv = require('dotenv-webpack');

module.exports = function override(config, env) {
  // Add DotenvWebpack plugin
  config.plugins = [
    ...config.plugins,
    new Dotenv()
  ];

  return config;
};