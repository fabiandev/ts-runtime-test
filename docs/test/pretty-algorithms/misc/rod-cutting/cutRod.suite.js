suite('misc/rod-cutting#cutRod', function(suite) {
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
    tsr.cutRod(prices, 7);
  });

  bench('original', function() {
    var prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
    pkg.cutRod(prices, 7);
  });

});
