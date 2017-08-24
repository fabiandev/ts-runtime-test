# ts-runtime-test

This package uses [pretty-algorithms](https://github.com/jiayihu/pretty-algorithms) and runs its tests with a standard build and a [ts-runtime](https://github.com/fabiandev/ts-runtime) build.

## Usage

With just a few commands, it is possible to compare the test results from the different builds. Each time a test script is executed, a fresh build is created.

### Install

By installing the dependencies of this package, all preparation work is also carried out:

```sh
$ npm install
```

### Test

Build the package as-is and run the tests:

```sh
npm run test-pkg
```

Build the package with ts-runtime and run the tests:

```sh
npm run test-tsr
```

> Some runtime exceptions will be thrown by ts-runtime

Fix errors, before building and testing with ts-runtime again:

```sh
npm run test-fix
```

To run tests again, without a rebuild, the following command can be used:

```sh
npm test
```

To switch a testing environment without triggering the tests, use `npm run test:pkg`, `npm run test:tsr` or `npm run test:fix`. After that `npm test` can be used to run the test suites.
