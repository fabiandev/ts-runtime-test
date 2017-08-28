suite('sort/selection-sort#selectionSort', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/sort/selection-sort/selection-sort',
      'tsr/sort/selection-sort/selection-sort'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var input = [5, 2, 4, 6, 1, 3];
    tsr.selectionSort(input);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    pkg.selectionSort(input);
  });

});
