suite('Class', function(suite) {
  var t;

  setup(function() {
    require([
      'ts-runtime/lib'
    ], (tsr) => {
      t = tsr.lib;
    });
  });
  
  bench('ts-runtime', function() {
    class Foo { }
    t.class("Foo", t.object()).assert(new Foo());
  });

  bench('original', function() {
    class Foo { }
    if (!((new Foo()) instanceof Foo)) {
      throw new TypeError('Foo expected');
    }
  });

});
