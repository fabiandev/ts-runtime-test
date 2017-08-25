suite('sort/heap-sort#heapSort', function(suite) {
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
    var input = [5, 2, 4, 6, 1, 3];
    var result = tsr.heapSort(input);
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    var result = pkg.heapSort(input);
  });

});
