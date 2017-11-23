// @flow

jest.mock('./lib/');

const utils: any = require('./lib/');
const createConfig = require('./index.js');

describe('createConfig()', () => {
  beforeEach(() => {
    utils.parseEnvironmentVariables.mockReturnValue({
      NODE_ENV: 'development'
    });
    utils.loadEnvironmentOverrides.mockReturnValue(
      jest.fn(() => ({
        foo: 'overrideFoo'
      }))
    );
    utils.createPathUtils.mockReturnValue({
      root: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    expect(utils.createPathUtils).toHaveBeenCalledTimes(1);
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

    expect(utils.loadEnvironmentOverrides).toHaveBeenCalledTimes(1);
    expect(config.foo).toBe('overrideFoo');
  });

  it('should call and apply the extend function option to the finalized config object.', () => {
    const extend = jest.fn(() => ({foo: 'extendFoo'}));
    const config = createConfig({
      rootDirPath: '/foo',
      extend
    });

    expect(extend).toHaveBeenCalledTimes(1);
    expect(config.foo).toBe('extendFoo');
  });
});
