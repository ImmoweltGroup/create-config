# `createConfig(Options: Object)`

#### `options.rootDirPath`
The `rootDirPath` should be an absolute path pointing to the root folder of your application, e.g. if your projects config file is located in `config/index.js` we recommend you to use the `path.resolve` function like

```js
const createConfig = require('@immowelt/create-config/');
const path = require('path');

module.exports = createConfig({
  rootDirPath: path.resolve(__dirname, '..')
});
```

#### `options.loggerId`
An optional logger / debug namespace to use which the function will use for feedback.

#### `options.configsPathsByEnvironmentKey`
A key map which each key matches the value of `NODE_ENV` environment variable and the value the relative path from your `rootDirPath`.
Once the `createConfig` function detects the `NODE_ENV` being set to a value that matches a key of the object, the target file will be required and used to override e.g. production settings into your application.

```js
// config/index.js
const createConfig = require('@immowelt/create-config/');
const path = require('path');

const config = createConfig({
  rootDirPath: path.resolve(__dirname, '..'),
  configsPathsByEnvironmentKey: {
    production: 'index.production.js'
  }
});

console.log(config.foo);
```

```js
// config/index.production.js
module.exports = config => ({
  foo: 'bar'
});
```

```sh
# Executing the script in the production env would print "foo" into stdout
NODE_ENV=production node config/index.js

# Executing the script in any other env would print "undefined" since the override file was not loaded.
NODE_ENV=development node config/index.js
```

#### `options.requiredVariablesByKey`
A key map which each key matches the name of the targeted environment variable and the value the validator of [envalid](https://github.com/af/envalid). All definitions will be validated upon config initialization so you can be sure to expect the values in the returned `config.env` object.

```js
// config/index.js
const createConfig = require('@immowelt/create-config/');
const path = require('path');
const {str} = require('envalid');

module.exports = createConfig({
  rootDirPath: path.resolve(__dirname, '..'),
  requiredVariablesByKey: {
    FOO: str({default: 'bar'})
  }
});
```

#### `options.globalsByKey`
A key map which should be used in case you use webpack, it includes values like `process.env.NODE_ENV` by default to slim down bundles sizes when bundling e.g. React. The resulted value can be found in `config.globals` and should be used in combination with the `webpack.DefinePlugin`.

#### `options.pathsByKey`
A key map which each key represents the name of the helper function to create and the value the relative basepath of it. E.g.

```js
const createConfig = require('@immowelt/create-config/');
const path = require('path');

const config = createConfig({
  rootDirPath: path.resolve(__dirname, '..'),
  pathsByKey: {
    fooBar: 'foo/bar'
  }
});

//
// By default you will find one single function that is named `root` in `config.paths`.
// This function is bound to your application root and the following call would return "/usr/src/foo"
//
console.log(config.paths.root());

//
// Returns a string relative to your application root directory, e.g.
// the following call would return "/usr/src/foo/bar"
//
console.log(config.paths.fooBar());

//
// You can also specify additional parameters to get a path relative to the basepath of the function, e.g.
// the following call would return "/usr/src/foo/bar/baz"
//
console.log(config.paths.fooBar('baz'));
```

#### `options.extend`
In case you want to extend your config object, you can specify an extend function that will be called with the intermediate generated config object.
The function should return an object and it will automatically be merged with the intermediate config inside the `create-config` package.

E.g.

```js
const createConfig = require('@immowelt/create-config/');
const path = require('path');

const config = createConfig({
  rootDirPath: path.resolve(__dirname, '..'),
  extend: () => ({
    foo: 'bar'
  })
});

console.log(config.foo); // 'bar'
```
