/**
 * TypeScript CommonJS Hook & Test Suite Runner
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Register .ts require hook using the installed TypeScript compiler
require.extensions['.ts'] = function(module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(content, {
    compilerOptions: { 
      module: ts.ModuleKind.CommonJS, 
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true 
    }
  });
  return module._compile(transpiled.outputText, filename);
};

// Now load and run the complete i18n test suite!
require('./i18n.test.js');
