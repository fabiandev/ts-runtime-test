suite('misc/inversions-count#countInversions', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/inversions-count/inversions-count',
      'tsr/misc/inversions-count/inversions-count'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    tsr.countInversions([2, 3, 8, 6, 1]);
  });

  bench('original', function() {
    pkg.countInversions([2, 3, 8, 6, 1]);
  });

});
