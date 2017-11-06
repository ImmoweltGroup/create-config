// @flow

const parseEnvironmentVariables = require('./parseEnvironmentVariables.js');
const envalid = require('envalid');

describe('loadEnvironmentOverrides()', () => {
  it('should be a function.', () => {
    expect(typeof parseEnvironmentVariables).toBe('function');
  });

  it('should not throw an error if no arguments where passed.', () => {
    expect(() => parseEnvironmentVariables()).not.toThrow();
  });

  it('should parse the systems environment variables and assign them to the returned object.', () => {
    const requiredVariablesByKey = {
      FOO: envalid.str({default: 'bar'})
    };
    const env = parseEnvironmentVariables(requiredVariablesByKey, {
      NODE_ENV: 'test'
    });

    expect(typeof env).toBe('object');
    expect(env.FOO).toBe('bar');
    expect(env.NODE_ENV).toBe('test');
  });

  it('should compute an `isTest` boolean and attach it to the returned object based on the passed `process.env` object.', () => {
    let env = parseEnvironmentVariables({}, {});

    expect(env.isTest).toBe(false);

    env = parseEnvironmentVariables({}, {NODE_ENV: 'test'});
    expect(env.isTest).toBe(true);
  });

  it('should compute an `isDev` boolean and attach it to the returned object based on the passed `process.env` object.', () => {
    let env = parseEnvironmentVariables({}, {NODE_ENV: 'production'});

    expect(env.isDev).toBe(false);

    env = parseEnvironmentVariables({}, {NODE_ENV: 'development'});
    expect(env.isDev).toBe(true);
  });

  it('should compute an `isProduction` boolean and attach it to the returned object based on the passed `process.env` object.', () => {
    let env = parseEnvironmentVariables({}, {});

    expect(env.isProduction).toBe(false);

    env = parseEnvironmentVariables({}, {NODE_ENV: 'production'});
    expect(env.isProduction).toBe(true);
  });
});
