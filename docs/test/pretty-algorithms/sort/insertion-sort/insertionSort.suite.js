suite('sort/insertion-sort#insertionSort', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/sort/insertion-sort/insertion-sort',
      'tsr/sort/insertion-sort/insertion-sort'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var input = [5, 2, 4, 6, 1, 3];
    tsr.insertionSort(input);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    pkg.insertionSort(input);
  });

});
