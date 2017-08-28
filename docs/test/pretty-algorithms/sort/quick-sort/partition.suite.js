suite('sort/quick-sort#partition', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/sort/quick-sort/quick-sort',
      'tsr/sort/quick-sort/quick-sort'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var input = [5, 2, 4, 6, 1, 3];
    tsr.partition(input, 0, input.length - 1, false);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    pkg.partition(input, 0, input.length - 1, false);
  });

});
