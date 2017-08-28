suite('Primitive', function(suite) {
  var t;

  setup(function() {
    require([
      'ts-runtime/lib'
    ], (tsr) => {
      t = tsr.lib;
    });
  });
  
  bench('ts-runtime', function() {
    t.string().assert('foo');
  });

  bench('original', function() {
    if (typeof 'foo' !== 'string') {
      throw new TypeError('string expected');
    }
  });

});
