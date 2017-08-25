suite('sort/merge-sort#mergeSort', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/sort/merge-sort/merge-sort',
      'tsr/sort/merge-sort/merge-sort'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var input = [5, 2, 4, 6, 1, 3];
    tsr.mergeSort(input);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    pkg.mergeSort(input);
  });

});
