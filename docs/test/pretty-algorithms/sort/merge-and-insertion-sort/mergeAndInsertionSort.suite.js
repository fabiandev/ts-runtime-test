suite('sort/merge-and-insertion-sort#mergeAndInsertionSort', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/sort/merge-and-insertion-sort/merge-and-insertion-sort',
      'tsr/sort/merge-and-insertion-sort/merge-and-insertion-sort'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var input = [5, 2, 4, 6, 1, 3];
    tsr.mergeAndInsertionSort(input);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    pkg.mergeAndInsertionSort(input);
  });

});
