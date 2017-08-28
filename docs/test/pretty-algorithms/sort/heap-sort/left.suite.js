suite('sort/heap-sort#left', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/sort/heap-sort/heap-sort',
      'tsr/sort/heap-sort/heap-sort'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    tsr.left(0);
  });

  bench('original', function() {
    pkg.left(0);
  });

});
