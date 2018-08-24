// @flow

export type OverridesFnType = (config: Object) => Object;

const fs = require('fs');
const safeEval = require('node-eval');
const {warn} = require('debug-logger')('create-config');
const defaultOverrides: OverridesFnType = () => ({});

/**
 * Requires the given path and checks if the export is either a CommonJS or ES module and
 * returns a fallback override function if the file was not found or is invalid structured.
 *
 * @param  {String} path The absolute path to the override file.
 * @return {Function}    The required export or a default override that returns an empty object.
 */
function loadOverrides(path: string): OverridesFnType {
  let exports: void | OverridesFnType | {default: OverridesFnType};

  // Using `require` breaks the tests when using mock-fs in combination with Jest, since somewhere in the stack a call to
  // `node_modules/babel-core` gets made which is not available in the mocked file system.
  if (path && path.length) {
    const str = fs.readFileSync(path, 'utf-8');

    exports = safeEval(str, path);
  }

  const fn: void | OverridesFnType = exports ? exports.default || exports : undefined;

  if (typeof fn === 'function') {
    return fn;
  }

  warn(`Export of config override in "${path}" is not a function but of type "${typeof fn}".`);

  return defaultOverrides;
}

module.exports = loadOverrides;
module.exports.defaultOverrides = defaultOverrides;
