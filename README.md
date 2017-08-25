# ts-runtime-test

This package uses [pretty-algorithms](https://github.com/jiayihu/pretty-algorithms) and runs its tests with a standard build and a [ts-runtime](https://github.com/fabiandev/ts-runtime) build.

# Install

By installing the dependencies of this package, all preparation work is also carried out:

```sh
$ npm install
```

# Unit Tests

The test results of the original code base, a build with ts-runtime, as well as a fixed ts-runtime build can be compared. To set the environment to test in, the following commands can be used:

| Environment            | Command            |
| ---------------------- | ------------------ |
| Original Build         | `npm run test:pkg` |
| ts-runtime Build       | `npm run test:tsr` |
| Fixed ts-runtime Build | `npm run test:fix` |

After that, the tests can be executed as often as desired with `npm test`.  
To get a fresh build, the testing environment can be set again.

> Build and test in a single step by running `npm run test-(env)` with `(env)` set to `pkg`, `tsr` or `fix`. 

# Benchmark Tests

Run the performance tests locally with `npm run benchmark`, to start a development server with the testing interface, or visit https://fabiandev.github.io/ts-runtime-test/.
