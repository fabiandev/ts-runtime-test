suite('misc/maximum-subarray#maxCrossSubarray', function(suite) {
  var pkg, tsr;

  setup(function() {
    require([
      'pkg/misc/maximum-subarray/maximum-subarray',
      'tsr/misc/maximum-subarray/maximum-subarray'
    ], (p, t) => {
      pkg = p;
      tsr = t;
    });
  });
  
  bench('ts-runtime', function() {
    var input = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
    tsr.maxCrossSubarray(input, 0, 9, input.length - 1);
  });
  
  bench('original', function() {
    var input = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
    pkg.maxCrossSubarray(input, 0, 9, input.length - 1);
  });

});
