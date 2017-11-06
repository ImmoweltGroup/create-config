// @flow

export type RequiredVariablesByKeyType = {
  [string]: string
};
export type ParsedEnvironmentType = {
  NODE_ENV: string,
  [string]: string
};
export type EnvironmentType = {
  isProduction: boolean,
  isDev: boolean,
  isTest: boolean,
  [string]: string
};

const envalid = require('envalid');

function parseEnvironmentVariables(
  requiredVariablesByKey: RequiredVariablesByKeyType = {},
  environment: Object = process.env
): EnvironmentType {
  const requiredEnv = Object.assign(
    {
      NODE_ENV: envalid.str({default: 'development'})
    },
    requiredVariablesByKey
  );
  const env: ParsedEnvironmentType = envalid.cleanEnv(environment, requiredEnv);
  const NODE_ENV = env.NODE_ENV.toLowerCase();

  return Object.assign({}, env, {
    NODE_ENV,
    isProduction: NODE_ENV === 'production',
    isDev: NODE_ENV === 'development',
    isTest: NODE_ENV === 'test'
  });
}

module.exports = parseEnvironmentVariables;
