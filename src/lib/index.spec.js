// @flow

const utils = require('./index.js');

describe('utils', () => {
  it('should be an object that exposes all utils.', () => {
    expect(typeof utils).toBe('object');
    expect(Object.keys(utils)).toEqual([
      'createPathUtils',
      'loadEnvironmentOverrides',
      'parseEnvironmentVariables'
    ]);
  });
});
