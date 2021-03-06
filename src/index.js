// @flow

import type {PathsType} from './lib/createPathUtils';
import type {EnvironmentType} from './lib/parseEnvironmentVariables';

export type OptionsType = {
  rootDirPath: string,
  loggerId?: string,
  configsPathsByEnvironmentKey?: {
    [string]: string
  },
  requiredVariablesByKey?: {},
  globalsByKey?: {},
  pathsByKey?: {},
  extend?: (config: Object) => Object
};
export type ConfigType = {
  paths: PathsType,
  env: EnvironmentType,
  globals: {
    'process.env': {
      NODE_ENV: string
    },
    NODE_ENV: string,
    __ENV_DEV__: boolean,
    __ENV_PRODUCTION__: boolean,
    __ENV_TEST__: boolean,
    __DEBUG__: boolean,
    __BASENAME__: string,
    [string]: any
  },
  [string]: any
};

const omit = require('lodash.omit');
const merge = require('lodash.merge');
const debugLogger = require('debug-logger');
const utils = require('./lib/');

function createConfig(opts: OptionsType): ConfigType {
  if (!opts || !opts.rootDirPath) {
    throw new Error('Please provide an options object containing at least a `rootDirPath` to the createConfig() function.');
  }

  const {
    loggerId = 'create-config',
    rootDirPath = '',
    configsPathsByEnvironmentKey = {},
    requiredVariablesByKey = {},
    globalsByKey = {},
    pathsByKey = {}
  } = opts;
  const {info} = debugLogger(loggerId);
  const env = utils.parseEnvironmentVariables(requiredVariablesByKey);
  const rest = omit(opts, [
    'rootDirPath',
    'configsPathsByEnvironmentKey',
    'requiredVariablesByKey',
    'globalsByKey',
    'pathsByKey',
    'extend'
  ]);
  let config = Object.assign({}, rest, {env});

  // Utilities and environment globals.
  // All globals added here must also be added to your projects `.eslintrc`
  config.paths = utils.createPathUtils(rootDirPath, pathsByKey);
  config.globals = Object.assign({
    'process.env': {NODE_ENV: JSON.stringify(env.NODE_ENV)},
    NODE_ENV: env.NODE_ENV,
    __ENV_DEV__: env.isDev,
    __ENV_PRODUCTION__: env.isProduction,
    __ENV_TEST__: env.isTest,
    __DEBUG__: env.isDev,
    __BASENAME__: JSON.stringify(process.env.BASENAME || '')
  }, globalsByKey);

  // In case the project owner likes to extend the finalized config object
  // he can do so by providing an `extend()` function in the options object.
  if (typeof opts.extend === 'function') {
    const extension = opts.extend(config);
    config = merge({}, config, extension);
  }

  // Resolve optional file based overrides for the current NODE_ENV.
  info(`Apply environment overrides for NODE_ENV "${env.NODE_ENV}".`);

  const relativeNodeEnvOverridesPath = configsPathsByEnvironmentKey[env.NODE_ENV];
  if (relativeNodeEnvOverridesPath) {
    const overridesPath = config.paths.root(relativeNodeEnvOverridesPath);
    const overrides = utils.loadEnvironmentOverrides(overridesPath)(config);
    config = merge({}, config, overrides);
  }
  return config;
}

module.exports = createConfig;
