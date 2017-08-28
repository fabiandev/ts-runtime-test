suite('misc/maximum-subarray#maxSubarray', function(suite) {
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
    tsr.maxSubarray(input, 0, input.length - 1);
  });
  
  bench('original', function() {
    var input = [13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7];
    pkg.maxSubarray(input, 0, input.length - 1);
  });

});
