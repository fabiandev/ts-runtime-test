suite('sort/quick-sort#quickSort', function(suite) {
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
    tsr.quickSort(input);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    pkg.quickSort(input);
  });

});
