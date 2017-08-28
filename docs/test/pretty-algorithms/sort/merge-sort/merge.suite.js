suite('sort/merge-sort#merge', function(suite) {
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
    var input = [4, 5, 6, 1, 2, 3];
    tsr.merge(input, 0, 3, 6);
  });

  bench('original', function() {
    var input = [4, 5, 6, 1, 2, 3];
    pkg.merge(input, 0, 3, 6);
  });

});
