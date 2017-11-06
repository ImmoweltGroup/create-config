# Examples

Creating a config object is as simple as eating a banana, the only required option is the `rootDirPath` that you need to specify, e.g.

```js
// config/index.js
const createConfig = require('@immowelt/util-create-project-config/');
const path = require('path');

module.exports = createConfig({
	rootDirPath: path.resolve(__dirname, '..')
});
```

The config object looks like:

```js
{
    //
    // A pre-configured `env` object containing the system environment variables, as well as `boolean` values
    // like `isProduction`, `isDev` and `isTest` based upon the `NODE_ENV` environment variable.
    //
    // All key/value pairs of the `requiredVariablesByKey` option will be merged into this object as well.
    //
    env: {
        NODE_ENV: 'development',
        isProduction: false,
        isDev: true,
        isTest: false
    },

    //
    // A common `globals` object containing useful variables to pass into a webpack build.
    // All key/value pairs of the `globalsByKey` option will be merged into this object as well.
    //
    globals: {
        'process.env': {
            NODE_ENV: 'development'
        },
        NODE_ENV: 'production',
        __ENV_DEV__: false,
        __ENV_PRODUCTION__: false,
        __ENV_TEST__: false,
        __DEBUG__: false,
        __BASENAME__: ''
    },

    //
    // An extendable `paths` object containing at least a `root` function.
    // e.g. `config.paths.root('package.json')` returns you the absolute path to your projects `package.json`.
    //
    // All key/value pairs of the `pathsByKey` option will be bound to the `root` function and merged into this object as well.
    //
    paths: {
        root: [Function: root]
    },

    //
    // Additional project based configuration values created by the optional `extend()` option as well as
    // `NODE_ENV` based override files, e.g. `index.production.js`.
    //
}
```
