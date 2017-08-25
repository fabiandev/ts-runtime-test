suite('misc/rod-cutting#bottomUpCutRod', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/rod-cutting/rod-cutting',
      'tsr/misc/rod-cutting/rod-cutting'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });

  bench('ts-runtime', function() {
    var prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
    tsr.bottomUpCutRod(prices, 4);
  });

  bench('original', function() {
    var prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
    pkg.bottomUpCutRod(prices, 4);
  });

});
