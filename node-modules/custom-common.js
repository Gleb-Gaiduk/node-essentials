'use strict';

const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const RUN_OPTIONS = { timeout: 5000, displayErrors: false };

const requireMock = (name) => {
  console.log(`Intercepted require: ${name}`);
};

function customRequire(filePath, sandbox) {
  // Resolution
  const modulePath = path.resolve(__dirname, filePath);

  if (customRequire.cache.has(modulePath)) {
    return customRequire.cache.get(modulePath);
  }

  // Loading
  const src = fs.readFileSync(modulePath, 'utf-8');

  // Wrapping
  const code = `(require, module, exports, __filename, __dirname) => {\n${src}\n}`;
  const script = new vm.Script(code);
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const wrapper = script.runInContext(context, RUN_OPTIONS);
  const module = {
    exports: {}
  };

  // Evaluation
  wrapper(requireMock, module, module.exports, __filename, __dirname);

  // Caching
  customRequire.cache.set(modulePath, module.exports);
  return module.exports;
}

customRequire.cache = new Map();

const main = () => {
  const sandbox = { Map: class PseudoMap {} };
  const exported = customRequire('./test.js', sandbox);
  console.log(exported);
};

main();
main();
