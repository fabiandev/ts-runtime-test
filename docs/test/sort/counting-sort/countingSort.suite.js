suite('sort/counting-sort#countingSort', function(suite) {
  var pkg, tsr, max;

  setup(function() {
    require([
      'pkg/sort/counting-sort/counting-sort',
      'tsr/sort/counting-sort/counting-sort',
      'lodash/max'
    ], (p, t, m) => {
      pkg = p;
      tsr = t;
      max = m;
    });
  });

  bench('ts-runtime', function() {
    var input = [5, 2, 4, 6, 1, 3];
    var result = tsr.countingSort(input, max(input));
  });

  bench('original', function() {
    var input = [5, 2, 4, 6, 1, 3];
    var result = pkg.countingSort(input, max(input));
  });

});
