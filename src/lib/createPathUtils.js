// @flow

export type AdditionalPathsByKeyType = {
  [string]: string
};
export type PathFnType = (...args: Array<string>) => string;
export type PathsType = {
  root: PathFnType,
  [string]: PathFnType
};

const path = require('path');

/**
 * Creates the path utils object with auto bound functions based on the arguments.
 *
 * @param  {String} [rootDirPath='/']         The absolute path to the projects root directory.
 * @param  {Object} [additionalPathsByKey={}] A map for which each key/value combination another auto-bound path resolver will be created.
 * @return {Object}                           The finalized paths object to use.
 */
function createPathUtils(
  rootDirPath: string = '/',
  additionalPathsByKey: AdditionalPathsByKeyType = {}
): PathsType {
  //
  // The `root` function is the main function that will be extended with the `.bind()` method known from functional programming languages.
  // Basically it pre-defines arguments and calls the `path.resolve` function.
  // In our case the rootDir of your application is always pre-defined as the first argument, and the root function can also be used for
  // further nested `.bind()` invocations to create a chained and pre-defined path function.
  //
  const root: PathFnType = (...args) =>
    Reflect.apply(path.resolve, null, [rootDirPath, ...args]);
  const paths: PathsType = {root};

  Object.keys(additionalPathsByKey).forEach(key => {
    const path = additionalPathsByKey[key];

    paths[key] = root.bind(null, path);
  });

  return paths;
}

module.exports = createPathUtils;
