// @flow

const mockFs = require('mock-fs');
const loadEnvironmentOverrides = require('./loadEnvironmentOverrides.js');

describe('loadEnvironmentOverrides()', () => {
  beforeEach(() => {
    mockFs(
      {
        '/foo/cjs.js': 'module.exports = () => ({foo: "bar"})',
        '/foo/es.js': 'module.exports.default = () => ({foo: "baz"})',
        '/foo/bar.js': 'module.exports = {}'
      },
      {
        createCwd: false,
        createTmp: false
      }
    );
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should be a function.', () => {
    expect(typeof loadEnvironmentOverrides).toBe('function');
  });

  it('should return an default overrides function.', () => {
    // $FlowFixMe: suppressing this error since it is a test case
    expect(loadEnvironmentOverrides()).toBe(
      loadEnvironmentOverrides.defaultOverrides
    );
  });

  it('should require the passed file and return its contents.', () => {
    const fn = loadEnvironmentOverrides('/foo/cjs.js');

    expect(typeof fn).toBe('function');
    expect(typeof fn({})).toBe('object');
    expect(fn({}).foo).toBe('bar');
  });

  it('should require the passed file and return its ES6 module export if found.', () => {
    const fn = loadEnvironmentOverrides('/foo/es.js');

    expect(typeof fn).toBe('function');
    expect(typeof fn({})).toBe('object');
    expect(fn({}).foo).toBe('baz');
  });

  it('should fallback to the defaultOverrides function if the export is not a function.', () => {
    const fn = loadEnvironmentOverrides('/foo/bar.js');

    expect(fn).toBe(loadEnvironmentOverrides.defaultOverrides);
  });
});
