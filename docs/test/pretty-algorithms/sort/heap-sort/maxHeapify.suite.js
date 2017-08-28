suite('sort/heap-sort#maxHeapify', function(suite) {
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
    var input = [0, 5, 4, 2, 1, 3];
    var result = tsr.maxHeapify(input, 0, input.length);
  });

  bench('original', function() {
    var input = [0, 5, 4, 2, 1, 3];
    var result = pkg.maxHeapify(input, 0, input.length);
  });

});
