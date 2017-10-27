// @flow
//
// Note: In the expected path assertions we use the `path.join` module itself,
// since the test needs to pass and cover the Unix and Windows filesystem since
// the suite will be run on both systems.
//
const path = require('path');
const createPathUtils = require('./createPathUtils.js');

describe('createPathUtils()', () => {
  it('should be a function.', () => {
    expect(typeof createPathUtils).toBe('function');
  });

  it('should not return an object and not throw an error when called without arguments.', () => {
    expect(() => createPathUtils()).not.toThrow();
    expect(typeof createPathUtils()).toBe('object');
  });

  it('should contain at least a `root()` function that was bound to the first argument which is the rootDirPath.', () => {
    const paths = createPathUtils('/');

    expect(typeof paths.root).toBe('function');
    expect(paths.root('foo')).toBe(path.resolve('/', 'foo'));
  });

  it('should add another function to the returned object that was bound to the `root` function.', () => {
    const paths = createPathUtils('/', {foo: 'foo'});

    expect(typeof paths.foo).toBe('function');
    expect(paths.foo('bar')).toBe(path.resolve('/', 'foo', 'bar'));
  });
});
