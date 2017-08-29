tsr = require('ts-runtime');
// ts = require('typescript');

var files = process.argv.slice(2);

if (!files.length) {
  console.error('No files passed.');
  return;
}

var options = {
  force: true,
  excludeDeclarationFile: true,
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    declaration: false,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    sourceMap: true,
    lib: [
      'lib.dom.d.ts',
      'lib.es2015.d.ts',
      'lib.es2016.d.ts'
    ],
    module: 5, // ts.ModuleKind.ES2015
    moduleResolution: 2, // ts.ModuleResolutionKind.NodeJs
    target: 2, // ts.ScriptTarget.ES2015
    typeRoots: [
      'temp/node_modules/@types'
    ],
    baseUrl: '.',
    paths: {}
  }
};

tsr.transform(files, options);
