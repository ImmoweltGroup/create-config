// @flow

const sinon = require('sinon');
const utils = require('./lib/');
const createConfig = require('./index.js');

describe('createConfig()', () => {
  let parseEnvironmentVariables;
  let loadEnvironmentOverrides;
  let createPathUtils;

  beforeEach(() => {
    parseEnvironmentVariables = sinon
      .stub(utils, 'parseEnvironmentVariables')
      .returns({
        NODE_ENV: 'development'
      });
    loadEnvironmentOverrides = sinon
      .stub(utils, 'loadEnvironmentOverrides')
      .returns(() => ({foo: 'overrideFoo'}));
    createPathUtils = sinon.spy(utils, 'createPathUtils');
  });

  afterEach(() => {
    parseEnvironmentVariables.restore();
    loadEnvironmentOverrides.restore();
    createPathUtils.restore();
  });

  it('should be a function.', () => {
    expect(typeof createConfig).toBe('function');
  });

  it('should throw an error if no arguments where passed.', () => {
    expect(() => createConfig({rootDirPath: ''})).toThrow();
  });

  it('should return an object.', () => {
    expect(typeof createConfig({rootDirPath: '/foo'})).toBe('object');
  });

  it('should call the utils.createPathUtils function and attach the returned value to the config.', () => {
    const config = createConfig({rootDirPath: '/foo'});

    expect(createPathUtils.callCount).toBe(1);
    expect(typeof config.paths).toBe('object');
    expect(typeof config.paths.root).toBe('function');
  });

  it('should call and apply the returned override function to the finalized config object.', () => {
    const config = createConfig({
      rootDirPath: '/foo',
      configsPathsByEnvironmentKey: {
        development: 'index.development.js'
      }
    });

    expect(config.foo).toBe('overrideFoo');
  });

  it('should call and apply the extend function option to the finalized config object.', () => {
    const config = createConfig({
      rootDirPath: '/foo',
      extend: () => ({foo: 'extendFoo'})
    });

    expect(config.foo).toBe('extendFoo');
  });
});
